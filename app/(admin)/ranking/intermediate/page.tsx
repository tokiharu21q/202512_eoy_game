'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Participant } from '@/lib/types';
import { calculateRankings } from '@/lib/gameLogic';

// 中間順位発表画面（進行側）
export default function IntermediateRankingPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        // 3回戦の結果を取得して参加者の得点を更新
        const response = await fetch('/api/results?round=3');
        if (response.ok) {
          const data = await response.json();
          const ranked = calculateRankings(data.participants);
          setParticipants(ranked);
        }
      } catch (error) {
        console.error('参加者情報の取得に失敗しました', error);
      }
    };

    fetchParticipants();
  }, []);

  const handleBack = () => {
    router.push('/control');
  };

  const getFontSize = (rank: number) => {
    if (rank === 1) return 'text-4xl';
    if (rank === 2) return 'text-3xl';
    if (rank === 3) return 'text-2xl';
    return 'text-xl';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">中間順位発表</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <div className="grid grid-cols-3 gap-4 border-b-2 border-gray-300 pb-2 font-bold">
            <div>順位</div>
            <div>名前</div>
            <div>得点</div>
          </div>
          {participants.map((participant, index) => {
            const rank = index + 1;
            return (
              <div
                key={participant.id}
                className={`grid grid-cols-3 gap-4 border-b border-gray-200 py-3 ${getFontSize(rank)}`}
              >
                <div className="font-bold">{rank}位</div>
                <div>{participant.name}</div>
                <div>{participant.totalPoints.toFixed(2)}pt</div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleBack}
            className="rounded-md bg-gray-600 px-6 py-3 text-lg font-bold text-white hover:bg-gray-700"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}

