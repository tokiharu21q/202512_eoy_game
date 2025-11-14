import { NextRequest, NextResponse } from 'next/server';
import { getSelectionsByRound, getGameState, getAllParticipants, setRoundResult, getAllRoundResults } from '@/lib/serverState';
import { calculateRoundResults, updateParticipantPoints } from '@/lib/gameLogic';

// 結果取得API（GET）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roundParam = searchParams.get('round');

    if (!roundParam) {
      return NextResponse.json(
        { error: '回戦数を指定してください' },
        { status: 400 }
      );
    }

    const round = parseInt(roundParam, 10);
    if (isNaN(round) || round < 1 || round > 5) {
      return NextResponse.json(
        { error: '回戦数は1〜5の範囲で指定してください' },
        { status: 400 }
      );
    }

    const gameState = getGameState();
    if (!gameState.endTime) {
      return NextResponse.json(
        { error: 'ゲームが開始されていません' },
        { status: 400 }
      );
    }

    // 選択情報を取得
    const selections = getSelectionsByRound(round);

    // 結果を計算
    const roundResults = calculateRoundResults(round, selections, gameState.endTime);

    // 結果をキャッシュに保存
    setRoundResult(round, roundResults);

    // 全回戦の結果を取得して参加者の得点を更新
    const participants = getAllParticipants();
    const allRoundResults = getAllRoundResults();
    const updatedParticipants = updateParticipantPoints(participants, allRoundResults);

    return NextResponse.json({
      roundResults,
      participants: updatedParticipants,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '結果の取得に失敗しました' },
      { status: 500 }
    );
  }
}

