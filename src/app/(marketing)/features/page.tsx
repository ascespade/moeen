export default function FeaturesPage() {
  const features = [
    { title: "دردشة موحّدة", desc: "إدارة كل القنوات من واجهة واحدة" },
    { title: "تقارير لحظية", desc: "لوحات ذكية ومؤشرات أداء" },
    { title: "تلقائية وذكاء", desc: "قوالب وتدفقات بمساعدة AI" },
  ];
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">المميزات</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="rounded-xl border border-brand-border p-5 bg-[var(--panel)]">
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

