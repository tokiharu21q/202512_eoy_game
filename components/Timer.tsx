'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  duration: number; // 秒数
  onComplete?: () => void;
  startTime?: number; // 開始時刻（ミリ秒）
}

// タイマーコンポーネント
export default function Timer({ duration, onComplete, startTime }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    if (startTime === undefined) {
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const newRemaining = Math.max(0, duration - elapsed);
      setRemaining(newRemaining);

      if (newRemaining === 0 && onComplete) {
        onComplete();
      }
    };

    // 初回更新
    updateTimer();

    // 1秒ごとに更新
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [duration, startTime, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="text-center">
      <div className="text-4xl font-bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}

