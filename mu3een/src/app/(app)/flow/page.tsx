export default function FlowBuilderPage() {
  return (
    <main className="p-6 grid gap-4 lg:grid-cols-[280px_1fr_320px]">
      <aside className="rounded-xl border p-4 grid gap-3">
        <div className="font-medium">العُقد</div>
        <div className="grid gap-2">
          {['إرسال رسالة','سؤال','استدعاء API','تحويل لبشري','شرط IF/ELSE'].map((n) => (
            <button key={n} className="h-9 rounded-md border px-3 text-start">{n}</button>
          ))}
        </div>
      </aside>
      <section className="rounded-xl border min-h-[60dvh] p-4">
        <div className="text-gray-500">لوحة عمل: اسحب العقد ووصلها (تصميم بصري)</div>
      </section>
      <aside className="rounded-xl border p-4">
        <div className="font-medium mb-2">خصائص العنصر</div>
        <div className="text-sm text-gray-500">حدد عقدة لتحرير الخصائص</div>
      </aside>
    </main>
  );
}

