"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="text-center max-w-lg">
        <h1 className="text-2xl font-semibold mb-2">حدث خطأ غير متوقع</h1>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <button className="h-10 rounded-md border px-4" onClick={() => reset()}>إعادة المحاولة</button>
      </div>
    </main>
  );
}

