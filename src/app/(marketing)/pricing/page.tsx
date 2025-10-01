export default function PricingPage() {
  const tiers = [
    { name: "أساسي", price: "مجاني", features: ["قناة واحدة", "محادثات محدودة"] },
    { name: "محترف", price: "$29", features: ["3 قنوات", "تقارير أساسية"] },
    { name: "مؤسسات", price: "مخصص", features: ["قنوات غير محدودة", "دعم مخصص"] },
  ];
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">الأسعار</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-xl border border-brand-border p-5 bg-[var(--panel)]">
            <div className="text-xl font-semibold mb-2">{t.name}</div>
            <div className="text-2xl font-bold mb-4">{t.price}</div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {t.features.map((f) => (<li key={f}>• {f}</li>))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

