import { NextResponse } from 'next/server';
import { getParticipantCount } from '@/lib/serverState';

// 参加者人数取得API（GET）
export async function GET() {
  try {
    const count = getParticipantCount();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: '参加者人数の取得に失敗しました' },
      { status: 500 }
    );
  }
}

