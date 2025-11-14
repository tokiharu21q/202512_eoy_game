import { NextRequest, NextResponse } from 'next/server';
import { addParticipant, getAllParticipants } from '@/lib/serverState';
import { Participant } from '@/lib/types';
import { randomUUID } from 'crypto';

// 参加者登録API（POST）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, affiliation, motivation } = body;

    if (!name || !affiliation || !motivation) {
      return NextResponse.json(
        { error: '名前、所属、意気込みは必須です' },
        { status: 400 }
      );
    }

    // 参加者IDを生成
    const id = randomUUID();

    // 参加者情報を作成
    const participant: Participant = {
      id,
      name,
      affiliation,
      motivation,
      totalPoints: 0,
    };

    // 参加者を追加
    addParticipant(participant);

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: '参加者登録に失敗しました' },
      { status: 500 }
    );
  }
}

// 参加者一覧取得API（GET）
export async function GET() {
  try {
    const participants = getAllParticipants();
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json(
      { error: '参加者一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}

