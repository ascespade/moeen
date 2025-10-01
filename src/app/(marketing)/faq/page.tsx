export default function FAQPage() {
  const faqs = [
    { q: "هل تدعمون RTL؟", a: "نعم، دعم كامل للعربية مع تبديل تلقائي للاتجاه." },
    { q: "هل يوجد نسخة مجانية؟", a: "نعم، خطة أساسية مجانية للبدء السريع." },
    { q: "كيف أفعّل القنوات؟", a: "من صفحة القنوات داخل لوحة التحكم." },
  ];
  return (
    <div className="max-w-screen-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">الأسئلة الشائعة</h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <details key={i} className="rounded-lg border border-brand-border p-4 bg-[var(--panel)]">
            <summary className="font-semibold cursor-pointer">{f.q}</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

