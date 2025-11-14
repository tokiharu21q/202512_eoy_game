'use client';

import { Card as CardType } from '@/lib/types';

interface CardProps {
  card: CardType;
  isSelected: boolean;
  onClick: () => void;
}

// カードコンポーネント
export default function Card({ card, isSelected, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-lg border-2 p-6 transition-all duration-200
        ${isSelected 
          ? 'border-lime-400 bg-lime-50 scale-125 shadow-lg' 
          : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
        }
      `}
    >
      <div className="text-3xl font-bold">{card.value}</div>
    </button>
  );
}

