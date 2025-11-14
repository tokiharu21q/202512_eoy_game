// ゲーム終了画面（参加者側）
export default function EndPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold">ゲーム終了</h1>
        <p className="text-xl">ご参加ありがとうございました！</p>

        <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
          <div>
            <h2 className="mb-2 text-2xl font-bold">GitHubリポジトリ</h2>
            {/* ダミーURL - 実際のURLに置き換えてください */}
            <a
              href="https://github.com/example/202512_eoy_game"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://github.com/example/202512_eoy_game
            </a>
            <p className="mt-1 text-sm text-gray-500">※ ダミーURLです</p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold">制作ログ</h2>
            {/* ダミーURL - 実際のURLに置き換えてください */}
            <a
              href="https://zenn.dev/example/articles/202512_eoy_game"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://zenn.dev/example/articles/202512_eoy_game
            </a>
            <p className="mt-1 text-sm text-gray-500">※ ダミーURLです</p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold">開発後記</h2>
            <p className="text-left">
              このゲームアプリは、忘年会の景品大会をより楽しむために開発されました。
              個人開発やグループでの課外活動など、グループ独自の取り組みを作る仲間を募っています。
              例えば、定期情報共有会の開催など、一緒に活動できる仲間を探しています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

