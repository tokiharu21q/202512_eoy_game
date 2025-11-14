'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 参加登録画面（参加者側）
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          affiliation,
          motivation,
        }),
      });

      if (!response.ok) {
        throw new Error('参加登録に失敗しました');
      }

      const data = await response.json();
      // 参加者IDをlocalStorageに保存
      localStorage.setItem('participantId', data.id);
      // ゲーム画面に遷移
      router.push('/game');
    } catch (error) {
      alert('参加登録に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">参加登録</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
              所属
            </label>
            <input
              type="text"
              id="affiliation"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              名前
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700">
              意気込み/狙う順位
            </label>
            <input
              type="text"
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? '登録中...' : 'Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}

