import Link from 'next/link';

// ホーム画面（参加者側）
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="mb-8 text-6xl font-bold">忘年会景品大会</h1>
        <p className="mb-12 text-2xl">ゲームに参加して景品を獲得しよう！</p>
        <Link
          href="/register"
          className="inline-block rounded-full bg-white px-12 py-4 text-xl font-bold text-blue-600 transition-all hover:scale-105 hover:shadow-lg"
        >
          Play
        </Link>
      </div>
    </div>
  );
}
