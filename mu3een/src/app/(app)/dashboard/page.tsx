import KpiCard from "@/components/dashboard/KpiCard";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">لوحة المؤشرات</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="إجمالي المحادثات" value="1,248" hint="+8% هذا الأسبوع" />
        <KpiCard title="النشطة الآن" value="37" hint="Realtime" />
        <KpiCard title="متوسط زمن الرد" value="2m 13s" hint="-12%" />
        <KpiCard title="تكلفة اليوم" value="$12.40" hint="LLM + واتساب" />
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div className="rounded-xl border p-4 h-64">Chart A</div>
        <div className="rounded-xl border p-4 h-64">Chart B</div>
      </div>
      <div className="rounded-xl border p-4">Realtime Stream</div>
    </main>
  );
}

