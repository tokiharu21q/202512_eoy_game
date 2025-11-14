# プロジェクト構造と依存関係の流れ

## ディレクトリ構造

```
202512_eoy_game/
├── app/                          # Next.js App Routerのルートディレクトリ
│   ├── layout.tsx               # 共通レイアウト
│   ├── page.tsx                 # ホーム画面（参加者側）
│   ├── globals.css              # グローバルスタイル
│   ├── (participant)/           # 参加者側のルートグループ
│   │   ├── register/            # 参加登録画面
│   │   │   └── page.tsx
│   │   ├── game/                # ゲーム画面
│   │   │   └── page.tsx
│   │   └── end/                 # ゲーム終了画面
│   │       └── page.tsx
│   ├── (admin)/                 # 進行側のルートグループ
│   │   ├── control/             # 進行用画面
│   │   │   └── page.tsx
│   │   ├── result/              # 各回の結果発表画面
│   │   │   └── [round]/page.tsx
│   │   ├── ranking/             # 中間順位発表画面
│   │   │   └── intermediate/page.tsx
│   │   ├── ranking/             # 最終順位発表画面
│   │   │   └── final/page.tsx
│   │   ├── award/               # 表彰画面
│   │   │   ├── 3rd/page.tsx
│   │   │   ├── 2nd/page.tsx
│   │   │   └── 1st/page.tsx
│   │   └── credits/             # スタッフロール画面
│   │       └── page.tsx
│   └── api/                     # API Routes
│       ├── participants/        # 参加者管理API
│       │   ├── route.ts         # POST: 参加登録
│       │   └── [id]/route.ts   # GET: 参加者情報取得
│       ├── game/                # ゲーム状態管理API
│       │   ├── state/route.ts   # GET: ゲーム状態取得
│       │   ├── start/route.ts   # POST: ゲーム開始
│       │   └── select/route.ts  # POST: カード選択
│       └── results/             # 結果取得API
│           └── route.ts         # GET: 結果取得
├── components/                   # 共通コンポーネント
│   ├── Timer.tsx                # タイマーコンポーネント
│   ├── Countdown.tsx            # カウントダウンコンポーネント
│   ├── Card.tsx                 # カードコンポーネント
│   └── Layout.tsx               # 共通レイアウトコンポーネント
├── lib/                         # ユーティリティ関数
│   ├── types.ts                 # 型定義
│   ├── gameLogic.ts             # ゲームロジック（得点計算、順位計算）
│   └── gameData.ts              # ゲームデータ（カード定義など）
├── public/                      # 静的ファイル
└── rule.md                      # 憲法
├── rodemap.md                   # ロードマップ
├── todolist.md                  # Todoリスト
├── README.md                    # 要件定義
└── flow.md                      # 本ファイル
```

## データフロー

### 1. 参加登録フロー
```
参加者 → 参加登録画面(/register)
      → POST /api/participants
      → サーバー: 参加者ID生成、参加者情報保存
      → レスポンス: 参加者ID
      → ゲーム画面(/game)に遷移
```

### 2. ゲーム開始フロー
```
進行係 → 進行用画面(/control)
      → POST /api/game/start
      → サーバー: ゲーム状態を「countdown」に変更、開始時刻を記録
      → 参加者画面: ポーリング（1秒間隔）で状態を確認
      → 状態が「countdown」に変更されたことを検知
      → カウントダウン開始
      → カード表示
```

### 3. カード選択フロー
```
参加者 → カードクリック
      → POST /api/game/select (参加者ID, カード番号, 回戦数)
      → サーバー: 選択情報を保存、サーバー側の受信時刻（タイムスタンプ）を記録
      → レスポンス: 成功/失敗
      → 参加者画面: 選択状態を視覚的に更新（クライアント側のみ）
      → 進行側: 結果発表時にGET /api/resultsで取得
      → サーバー: 終了時刻以前の選択のみを有効とし、同じ参加者の複数の選択がある場合は最新のものを採用
      → 進行側: 有効な選択結果を表示（リアルタイム反映は不要）
```

### 4. 結果発表フロー
```
進行係 → 「得点発表」ボタン
      → GET /api/results?round=n
      → サーバー: 選択状況を集計、得点計算
      → レスポンス: 結果データ
      → 結果発表画面(/result/[round])に遷移
```

## 型定義の依存関係

### types.ts
```typescript
// 参加者情報
interface Participant {
  id: string;
  name: string;
  affiliation: string;
  motivation: string;
  totalPoints: number;
}

// ゲーム状態
type GameState = 'waiting' | 'countdown' | 'playing' | 'finished';

// カード情報
interface Card {
  id: number;
  value: number;
}

// 選択情報
interface Selection {
  participantId: string;
  cardId: number;
  round: number;
}

// 結果情報
interface RoundResult {
  round: number;
  cardResults: {
    cardId: number;
    cardValue: number;
    selectCount: number;
    points: number;
    participants: string[];
  }[];
}
```

## 関数の依存関係

### gameLogic.ts
- `calculatePoints(cardValue: number, selectCount: number): number`
  - 得点計算式を実装
  - 依存: なし

- `calculateRankings(participants: Participant[]): Participant[]`
  - 順位計算
  - 依存: Participant型

### gameData.ts
- `getCardsForRound(round: number): Card[]`
  - 各回のカード定義を返す
  - 依存: Card型

## コンポーネントの依存関係

### Layout.tsx
- 全画面の共通レイアウト
- 依存: なし

### Timer.tsx
- 20秒タイマー表示
- 依存: なし（独立コンポーネント）

### Countdown.tsx
- 3秒カウントダウン表示
- 依存: なし（独立コンポーネント）

### Card.tsx
- カード表示と選択処理
- 依存: Card型、選択処理のコールバック関数

## API Routesの依存関係

### /api/participants (POST)
- 参加者登録
- 依存: Participant型、参加者ID生成ロジック

### /api/game/state (GET)
- 現在のゲーム状態取得
- 依存: GameState型

### /api/game/start (POST)
- ゲーム開始トリガー
- 依存: GameState型、開始時刻の記録

### /api/game/select (POST)
- カード選択処理
- 依存: Selection型、選択情報保存ロジック

### /api/results (GET)
- 結果取得
- 依存: RoundResult型、gameLogic.tsの計算関数

## 状態管理の流れ

1. **初期状態**: ゲーム状態 = 'waiting'
2. **参加者登録**: 参加者リストに追加
3. **ゲーム開始**: ゲーム状態 = 'countdown' → 'playing'
4. **カード選択**: 選択情報をサーバーに送信
5. **タイマー終了**: ゲーム状態 = 'finished'
6. **結果計算**: 得点計算、順位更新
7. **次回戦準備**: ゲーム状態 = 'waiting'（次の回戦へ）

## 状態同期の流れ

### 参加者側
- 待機中: 1秒間隔でGET /api/game/stateをポーリングしてゲーム状態を確認
- ゲーム中: ポーリングは停止（クライアント側でタイマー管理）
- カード選択: POST /api/game/selectで選択情報を送信（即座に送信）

### 進行側
- 待機人数取得: ボタン押下時にGET /api/participants/countを呼び出し
- ゲーム開始: POST /api/game/startでゲーム状態を変更
- 結果取得: 結果発表時にGET /api/resultsで選択状況を取得

### 設計方針
- WebSocket/SSEは使用しない（軽量化のため）
- ポーリングは待機中のみ実施（ゲーム中は不要）
- カード選択は即座にPOST送信（進行側へのリアルタイム反映は不要）

