import { Participant, Selection, Card, RoundResult } from './types';
import { getCardsForRound } from './gameData';

// 得点計算式を実装
export function calculatePoints(cardValue: number, selectCount: number): number {
  if (selectCount === 0) {
    return 0;
  }
  return cardValue / selectCount;
}

// 各回の得点集計処理
export function calculateRoundResults(
  round: number,
  selections: Selection[],
  endTime: number
): RoundResult {
  // 終了時刻以前の選択のみを有効とする
  const validSelections = selections.filter(
    (selection) => selection.round === round && selection.timestamp <= endTime
  );

  // 同じ参加者の複数の選択がある場合は最新のものを採用
  const latestSelections = new Map<string, Selection>();
  for (const selection of validSelections) {
    const existing = latestSelections.get(selection.participantId);
    if (!existing || selection.timestamp > existing.timestamp) {
      latestSelections.set(selection.participantId, selection);
    }
  }

  // カード別に選択人数を集計
  const cardCounts = new Map<number, string[]>();
  for (const selection of latestSelections.values()) {
    const participants = cardCounts.get(selection.cardId) || [];
    participants.push(selection.participantId);
    cardCounts.set(selection.cardId, participants);
  }

  // カード情報を取得
  const cards = getCardsForRound(round);

  // 結果を構築
  const cardResults = cards.map((card) => {
    const participants = cardCounts.get(card.id) || [];
    const selectCount = participants.length;
    const points = calculatePoints(card.value, selectCount);

    return {
      cardId: card.id,
      cardValue: card.value,
      selectCount,
      points,
      participants,
    };
  });

  return {
    round,
    cardResults,
  };
}

// 順位付けロジックの実装
export function calculateRankings(participants: Participant[]): Participant[] {
  // 合計ptが多い順にソート
  return [...participants].sort((a, b) => b.totalPoints - a.totalPoints);
}

// 合計ptの計算処理
export function updateParticipantPoints(
  participants: Participant[],
  roundResults: RoundResult[]
): Participant[] {
  // 参加者ごとの得点を初期化
  const pointsMap = new Map<string, number>();
  for (const participant of participants) {
    pointsMap.set(participant.id, 0);
  }

  // 各回の結果から得点を加算
  for (const result of roundResults) {
    for (const cardResult of result.cardResults) {
      for (const participantId of cardResult.participants) {
        const currentPoints = pointsMap.get(participantId) || 0;
        pointsMap.set(participantId, currentPoints + cardResult.points);
      }
    }
  }

  // 参加者情報を更新
  return participants.map((participant) => ({
    ...participant,
    totalPoints: pointsMap.get(participant.id) || 0,
  }));
}

