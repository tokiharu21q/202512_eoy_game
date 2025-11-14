import { NextRequest, NextResponse } from 'next/server';
import { addSelection, getParticipant } from '@/lib/serverState';
import { Selection } from '@/lib/types';

// カード選択API（POST）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId, cardId, round } = body;

    if (!participantId || !cardId || !round) {
      return NextResponse.json(
        { error: '参加者ID、カードID、回戦数は必須です' },
        { status: 400 }
      );
    }

    // 参加者の存在確認
    const participant = getParticipant(participantId);
    if (!participant) {
      return NextResponse.json(
        { error: '参加者が見つかりません' },
        { status: 404 }
      );
    }

    // サーバー側の受信時刻を記録
    const timestamp = Date.now();

    // 選択情報を作成
    const selection: Selection = {
      participantId,
      cardId,
      round,
      timestamp,
    };

    // 選択情報を追加
    addSelection(selection);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'カード選択に失敗しました' },
      { status: 500 }
    );
  }
}

