import { NextResponse } from 'next/server';
import { getGameState, setGameState } from '@/lib/serverState';

// ゲーム終了API（POST）
export async function POST() {
  try {
    const currentState = getGameState();

    // ゲーム状態をfinishedに更新
    const newState = {
      ...currentState,
      state: 'finished' as const,
    };

    setGameState(newState);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'ゲーム終了処理に失敗しました' },
      { status: 500 }
    );
  }
}

