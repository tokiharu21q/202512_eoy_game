import { Card } from './types';

// 各回のカード定義（事前決定されたデータ）
// 1回戦: 3枚のカード
// 2回戦: 4枚のカード
// 3回戦: 5枚のカード
// 4回戦: 4枚のカード
// 5回戦: 3枚のカード

const round1Cards: Card[] = [
  { id: 1, value: 3 },
  { id: 2, value: 5 },
  { id: 3, value: 10 },
];

const round2Cards: Card[] = [
  { id: 1, value: 2 },
  { id: 2, value: 4 },
  { id: 3, value: 6 },
  { id: 4, value: 12 },
];

const round3Cards: Card[] = [
  { id: 1, value: 1 },
  { id: 2, value: 3 },
  { id: 3, value: 5 },
  { id: 4, value: 8 },
  { id: 5, value: 15 },
];

const round4Cards: Card[] = [
  { id: 1, value: 4 },
  { id: 2, value: 7 },
  { id: 3, value: 11 },
  { id: 4, value: 18 },
];

const round5Cards: Card[] = [
  { id: 1, value: 6 },
  { id: 2, value: 10 },
  { id: 3, value: 20 },
];

// 各回のカード定義を返す
export function getCardsForRound(round: number): Card[] {
  switch (round) {
    case 1:
      return round1Cards;
    case 2:
      return round2Cards;
    case 3:
      return round3Cards;
    case 4:
      return round4Cards;
    case 5:
      return round5Cards;
    default:
      return [];
  }
}

