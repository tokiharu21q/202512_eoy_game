'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RoundResult, Participant } from '@/lib/types';

// 各回の結果発表画面（進行側）
export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const round = parseInt(params.round as string, 10);
  const [roundResults, setRoundResults] = useState<RoundResult | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results?round=${round}`);
        if (response.ok) {
          const data = await response.json();
          setRoundResults(data.roundResults);
          setParticipants(data.participants);
        }
      } catch (error) {
        console.error('結果の取得に失敗しました', error);
      }
    };

    fetchResults();
  }, [round]);

  const handleIntermediateRanking = () => {
    router.push('/ranking/intermediate');
  };

  const handleFinalRanking = () => {
    router.push('/ranking/final');
  };

  const handleBack = async () => {
    // ゲーム状態をwaitingに戻す（次の回戦の準備）
    try {
      await fetch('/api/game/reset', {
        method: 'POST',
      });
    } catch (error) {
      console.error('ゲーム状態のリセットに失敗しました', error);
    }
    router.push('/control');
  };

  if (!roundResults) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>結果を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold">{round}回戦の結果</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">カード別選択状況</h2>
          <div className="space-y-4">
            {roundResults.cardResults.map((result) => (
              <div
                key={result.cardId}
                className="rounded-lg border border-gray-300 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold">カード {result.cardId}: </span>
                    <span className="text-xl">{result.cardValue}pt</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg">選択人数: {result.selectCount}人</div>
                    <div className="text-lg">獲得pt: {result.points.toFixed(2)}pt</div>
                  </div>
                </div>
                {result.participants.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    選択者: {result.participants.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">参加者別獲得pt</h2>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between rounded-lg border border-gray-300 p-3"
              >
                <div>
                  <span className="font-bold">{participant.name}</span>
                  <span className="ml-2 text-sm text-gray-600">
                    ({participant.affiliation})
                  </span>
                </div>
                <div className="text-lg font-bold">
                  {participant.totalPoints.toFixed(2)}pt
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {round === 3 && (
            <button
              onClick={handleIntermediateRanking}
              className="rounded-md bg-blue-600 px-6 py-3 text-lg font-bold text-white hover:bg-blue-700"
            >
              中間順位発表
            </button>
          )}
          {round === 5 && (
            <button
              onClick={handleFinalRanking}
              className="rounded-md bg-purple-600 px-6 py-3 text-lg font-bold text-white hover:bg-purple-700"
            >
              最終順位発表
            </button>
          )}
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

