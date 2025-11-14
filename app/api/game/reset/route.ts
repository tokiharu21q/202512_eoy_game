import { NextResponse } from 'next/server';
import { getGameState, setGameState } from '@/lib/serverState';

// ゲーム状態リセットAPI（POST）- 次の回戦の準備
export async function POST() {
  try {
    const currentState = getGameState();

    // ゲーム状態をwaitingに更新
    const newState = {
      ...currentState,
      state: 'waiting' as const,
    };

    setGameState(newState);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'ゲーム状態のリセットに失敗しました' },
      { status: 500 }
    );
  }
}

