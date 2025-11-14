import { Participant, GameStateInfo, Selection } from './types';

// サーバー側の状態管理（インメモリ）
// 本番環境ではデータベースやRedisなどを使用することを推奨

let participants: Map<string, Participant> = new Map();
let gameState: GameStateInfo = {
  state: 'waiting',
  round: 0,
};
let selections: Selection[] = [];
let roundResultsCache: Map<number, any> = new Map(); // 各回戦の結果をキャッシュ

// 参加者管理
export function addParticipant(participant: Participant): void {
  participants.set(participant.id, participant);
}

export function getParticipant(id: string): Participant | undefined {
  return participants.get(id);
}

export function getAllParticipants(): Participant[] {
  return Array.from(participants.values());
}

export function getParticipantCount(): number {
  return participants.size;
}

// ゲーム状態管理
export function getGameState(): GameStateInfo {
  return { ...gameState };
}

export function setGameState(state: GameStateInfo): void {
  gameState = { ...state };
}

// 選択情報管理
export function addSelection(selection: Selection): void {
  selections.push(selection);
}

export function getSelections(): Selection[] {
  return [...selections];
}

export function getSelectionsByRound(round: number): Selection[] {
  return selections.filter((s) => s.round === round);
}

// ゲームリセット（新しいゲーム開始時）
export function resetGame(): void {
  participants.clear();
  selections = [];
  gameState = {
    state: 'waiting',
    round: 0,
  };
}

// 回戦リセット（次の回戦に進む時）
export function resetRound(): void {
  selections = selections.filter((s) => s.round !== gameState.round);
}

// 回戦結果のキャッシュ管理
export function setRoundResult(round: number, result: any): void {
  roundResultsCache.set(round, result);
}

export function getRoundResult(round: number): any | undefined {
  return roundResultsCache.get(round);
}

export function getAllRoundResults(): any[] {
  return Array.from(roundResultsCache.values());
}

