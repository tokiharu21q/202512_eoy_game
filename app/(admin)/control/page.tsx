'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '@/components/Timer';
import Countdown from '@/components/Countdown';
import { GameStateInfo } from '@/lib/types';

// 進行用画面（進行側）
export default function ControlPage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameStateInfo | null>(null);
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [countdownComplete, setCountdownComplete] = useState(false);

  useEffect(() => {
    // ゲーム状態を取得
    const fetchGameState = async () => {
      try {
        const response = await fetch('/api/game/state');
        if (response.ok) {
          const state: GameStateInfo = await response.json();
          setGameState(state);

          if (state.state === 'countdown' && state.startTime) {
            setCountdownComplete(false);
          }
        }
      } catch (error) {
        console.error('ゲーム状態の取得に失敗しました', error);
      }
    };

    fetchGameState();
    const interval = setInterval(fetchGameState, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateCount = async () => {
    try {
      const response = await fetch('/api/participants/count');
      if (response.ok) {
        const data = await response.json();
        setParticipantCount(data.count);
      }
    } catch (error) {
      console.error('参加者人数の取得に失敗しました', error);
    }
  };

  const handleStartGame = async () => {
    if (!gameState) return;

    const nextRound = gameState.round + 1;
    if (nextRound > 5) {
      alert('全5回戦が終了しました');
      return;
    }

    try {
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ round: nextRound }),
      });

      if (response.ok) {
        const data = await response.json();
        setGameState({
          state: 'countdown',
          round: nextRound,
          startTime: data.startTime,
          endTime: data.endTime,
        });
        setCountdownComplete(false);
      }
    } catch (error) {
      console.error('ゲーム開始に失敗しました', error);
    }
  };

  const handleShowResults = async () => {
    if (!gameState) return;

    // ゲーム状態をfinishedに更新
    try {
      await fetch('/api/game/finish', {
        method: 'POST',
      });
    } catch (error) {
      console.error('ゲーム終了処理に失敗しました', error);
    }

    router.push(`/result/${gameState.round}`);
  };

  const handleCountdownComplete = () => {
    setCountdownComplete(true);
    if (gameState) {
      setGameState({ ...gameState, state: 'playing' });
    }
  };

  const handleTimerComplete = () => {
    if (gameState) {
      setGameState({ ...gameState, state: 'finished' });
    }
  };

  const currentRound = gameState?.round || 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{currentRound}回戦</h1>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-medium">待機人数:</span>
            <span className="text-2xl font-bold">{participantCount}人</span>
            <button
              onClick={handleUpdateCount}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              待機人数更新
            </button>
          </div>
        </div>

        {gameState?.state === 'waiting' && (
          <div className="text-center">
            <button
              onClick={handleStartGame}
              className="rounded-md bg-green-600 px-8 py-4 text-2xl font-bold text-white hover:bg-green-700"
            >
              ゲーム開始
            </button>
          </div>
        )}

        {gameState?.state === 'countdown' && gameState.startTime && (
          <div className="text-center">
            <Countdown
              duration={3}
              startTime={gameState.startTime}
              onComplete={handleCountdownComplete}
            />
          </div>
        )}

        {gameState?.state === 'playing' && gameState.startTime && countdownComplete && (
          <div className="text-center">
            <Timer
              duration={20}
              startTime={gameState.startTime + 3000}
              onComplete={handleTimerComplete}
            />
          </div>
        )}

        {gameState?.state === 'finished' && (
          <div className="text-center">
            <button
              onClick={handleShowResults}
              className="rounded-md bg-purple-600 px-8 py-4 text-2xl font-bold text-white hover:bg-purple-700"
            >
              得点発表
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

