'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  duration: number; // 秒数
  onComplete: () => void;
  startTime?: number; // 開始時刻（ミリ秒）
}

// カウントダウンコンポーネント
export default function Countdown({ duration, onComplete, startTime }: CountdownProps) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    if (startTime === undefined) {
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const newRemaining = Math.max(0, duration - elapsed);
      setRemaining(newRemaining);

      if (newRemaining === 0) {
        onComplete();
      }
    };

    // 初回更新
    updateCountdown();

    // 100msごとに更新（滑らかな表示のため）
    const interval = setInterval(updateCountdown, 100);

    return () => clearInterval(interval);
  }, [duration, startTime, onComplete]);

  return (
    <div className="flex items-center justify-center">
      <div className="text-8xl font-bold text-blue-600">{remaining}</div>
    </div>
  );
}

