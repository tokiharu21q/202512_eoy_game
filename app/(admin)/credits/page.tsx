// スタッフロール画面（進行側）
export default function CreditsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="text-4xl font-bold">スタッフロール</h1>
        <div className="space-y-4 text-xl">
          <div>
            <p className="font-bold">原案：〇〇氏</p>
          </div>
          <div>
            <p className="font-bold">開発：■■氏</p>
          </div>
          <div>
            <p className="font-bold">SpecialThanks：本日ご参加の皆様方</p>
          </div>
        </div>
      </div>
    </div>
  );
}

