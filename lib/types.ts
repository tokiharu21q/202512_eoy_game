// 参加者情報
export interface Participant {
  id: string;
  name: string;
  affiliation: string;
  motivation: string;
  totalPoints: number;
}

// ゲーム状態
export type GameState = 'waiting' | 'countdown' | 'playing' | 'finished';

// カード情報
export interface Card {
  id: number;
  value: number;
}

// 選択情報
export interface Selection {
  participantId: string;
  cardId: number;
  round: number;
  timestamp: number; // サーバー側の受信時刻（ミリ秒）
}

// 結果情報
export interface RoundResult {
  round: number;
  cardResults: {
    cardId: number;
    cardValue: number;
    selectCount: number;
    points: number;
    participants: string[];
  }[];
}

// ゲーム状態情報
export interface GameStateInfo {
  state: GameState;
  round: number;
  startTime?: number; // ゲーム開始時刻（ミリ秒）
  endTime?: number; // タイマー終了時刻（ミリ秒）
}

