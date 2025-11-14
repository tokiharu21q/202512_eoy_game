'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Participant } from '@/lib/types';
import { calculateRankings } from '@/lib/gameLogic';

// 1位表彰画面（進行側）
export default function Award1stPage() {
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        // 5回戦の結果を取得して参加者の得点を更新
        const response = await fetch('/api/results?round=5');
        if (response.ok) {
          const data = await response.json();
          const ranked = calculateRankings(data.participants);
          if (ranked.length >= 1) {
            setParticipant(ranked[0]); // 1位
          }
        }
      } catch (error) {
        console.error('参加者情報の取得に失敗しました', error);
      }
    };

    fetchParticipants();
  }, []);

  const handleNext = () => {
    router.push('/credits');
  };

  if (!participant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-yellow-400">1位</h1>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold">{participant.name}</p>
              <p className="text-lg text-gray-600">{participant.affiliation}</p>
            </div>
            <div>
              <p className="text-xl">獲得pt: {participant.totalPoints.toFixed(2)}pt</p>
            </div>
            <div>
              <p className="text-lg">意気込み: {participant.motivation}</p>
            </div>
            <div>
              <p className="text-xl font-bold">獲得景品名: （景品名を入力）</p>
              {/* 景品画像は後で追加 */}
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={handleNext}
            className="rounded-md bg-blue-600 px-8 py-3 text-xl font-bold text-white hover:bg-blue-700"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}

