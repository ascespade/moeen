export default function ConversationsPage() {
  return (
    <main className="p-6 grid gap-4 grid-cols-1 lg:grid-cols-[320px_1fr_320px]">
      <aside className="rounded-xl border p-4">فلاتر وبحث</aside>
      <section className="rounded-xl border p-4 min-h-[60dvh]">لوحة الرسائل</section>
      <aside className="rounded-xl border p-4">بيانات العميل</aside>
    </main>
  );
}

