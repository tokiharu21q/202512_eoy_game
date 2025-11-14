import { NextResponse } from 'next/server';
import { getGameState } from '@/lib/serverState';

// ゲーム状態取得API（GET）
export async function GET() {
  try {
    const gameState = getGameState();
    return NextResponse.json(gameState);
  } catch (error) {
    return NextResponse.json(
      { error: 'ゲーム状態の取得に失敗しました' },
      { status: 500 }
    );
  }
}

