'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '@/components/Timer';
import Countdown from '@/components/Countdown';
import Card from '@/components/Card';
import { getCardsForRound } from '@/lib/gameData';
import { GameStateInfo } from '@/lib/types';

// ゲーム画面（参加者側）
export default function GamePage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameStateInfo | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [countdownComplete, setCountdownComplete] = useState(false);

  useEffect(() => {
    // 参加者IDを取得
    const id = localStorage.getItem('participantId');
    if (!id) {
      router.push('/register');
      return;
    }
    setParticipantId(id);
  }, [router]);

  useEffect(() => {
    if (!participantId) return;

    // ゲーム状態をポーリング（待機中のみ）
    const pollGameState = async () => {
      try {
        const response = await fetch('/api/game/state');
        if (response.ok) {
          const state: GameStateInfo = await response.json();
          setGameState(state);

          // ゲーム開始を検知
          if (state.state === 'countdown' && state.startTime) {
            setCountdownComplete(false);
          }

          // ゲーム終了を検知
          if (state.state === 'finished') {
            // 次の回戦の準備
            setSelectedCardId(null);
            setCountdownComplete(false);
          }
        }
      } catch (error) {
        console.error('ゲーム状態の取得に失敗しました', error);
      }
    };

    // 待機中のみポーリング
    if (!gameState || gameState.state === 'waiting') {
      pollGameState();
      const interval = setInterval(pollGameState, 1000);
      return () => clearInterval(interval);
    }
  }, [participantId, gameState]);

  const handleCardClick = async (cardId: number) => {
    if (!participantId || !gameState || gameState.state !== 'playing') {
      return;
    }

    setSelectedCardId(cardId);

    // サーバーに選択情報を送信
    try {
      await fetch('/api/game/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          cardId,
          round: gameState.round,
        }),
      });
    } catch (error) {
      console.error('カード選択の送信に失敗しました', error);
    }
  };

  const handleCountdownComplete = () => {
    setCountdownComplete(true);
    // ゲーム状態をplayingに更新（クライアント側のみ）
    if (gameState) {
      setGameState({ ...gameState, state: 'playing' });
    }
  };

  const handleTimerComplete = () => {
    // ゲーム状態をfinishedに更新（クライアント側のみ）
    if (gameState) {
      setGameState({ ...gameState, state: 'finished' });
    }
  };

  if (!gameState || !participantId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl">ゲーム開始までお待ちください</p>
        </div>
      </div>
    );
  }

  const cards = getCardsForRound(gameState.round);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">{gameState.round}回戦</h2>
      </div>

      {gameState.state === 'waiting' && (
        <div className="text-center">
          <p className="text-xl">ゲーム開始までお待ちください</p>
        </div>
      )}

      {gameState.state === 'countdown' && gameState.startTime && (
        <div className="text-center">
          <Countdown
            duration={3}
            startTime={gameState.startTime}
            onComplete={handleCountdownComplete}
          />
        </div>
      )}

      {gameState.state === 'playing' && gameState.startTime && countdownComplete && (
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <Timer
              duration={20}
              startTime={gameState.startTime + 3000}
              onComplete={handleTimerComplete}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                isSelected={selectedCardId === card.id}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
        </div>
      )}

      {gameState.state === 'finished' && (
        <div className="text-center">
          <p className="text-xl">この回戦は終了しました</p>
        </div>
      )}
    </div>
  );
}

