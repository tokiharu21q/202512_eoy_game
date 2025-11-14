import { NextRequest, NextResponse } from 'next/server';
import { getGameState, setGameState } from '@/lib/serverState';
import { GameStateInfo } from '@/lib/types';

// ゲーム開始API（POST）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { round } = body;

    if (!round || round < 1 || round > 5) {
      return NextResponse.json(
        { error: '回戦数は1〜5の範囲で指定してください' },
        { status: 400 }
      );
    }

    const currentState = getGameState();

    // 前の回戦が終了していない場合はエラー
    if (currentState.state !== 'waiting' && currentState.state !== 'finished') {
      return NextResponse.json(
        { error: '前の回戦が終了していません' },
        { status: 400 }
      );
    }

    // ゲーム状態を更新
    const startTime = Date.now();
    const endTime = startTime + 3000 + 20000; // 3秒（カウントダウン）+ 20秒（ゲーム時間）

    const newState: GameStateInfo = {
      state: 'countdown',
      round,
      startTime,
      endTime,
    };

    setGameState(newState);

    return NextResponse.json({ success: true, startTime, endTime });
  } catch (error) {
    return NextResponse.json(
      { error: 'ゲーム開始に失敗しました' },
      { status: 500 }
    );
  }
}

