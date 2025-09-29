import KpiCard from "@/components/dashboard/KpiCard";
import { ChartsA, ChartsB, ChartsPie } from "@/components/dashboard/Charts";
import { Skeleton, ChartSkeleton } from "@/components/common/Skeleton";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">لوحة المؤشرات</h1>
      {loading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="إجمالي المحادثات" value="1,248" hint="+8% هذا الأسبوع" />
          <KpiCard title="النشطة الآن" value="37" hint="Realtime" />
          <KpiCard title="متوسط زمن الرد" value="2m 13s" hint="-12%" />
          <KpiCard title="تكلفة اليوم" value="$12.40" hint="LLM + واتساب" />
        </div>
      )}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div className="rounded-xl border p-4">{loading ? <ChartSkeleton /> : <ChartsA />}</div>
        <div className="rounded-xl border p-4">{loading ? <ChartSkeleton /> : <ChartsB />}</div>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div className="rounded-xl border p-4">{loading ? <ChartSkeleton /> : <ChartsPie />}</div>
        <div className="rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">محادثات حرجة حديثة</div>
            <button className="h-9 rounded-md border px-3">عرض الكل</button>
          </div>
          {loading ? (
            <div className="grid gap-2">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-12" />))}</div>
          ) : (
            <ul className="grid gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="rounded-md border p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                    <div>
                      <div className="text-sm font-medium">محادثة #{i + 1}</div>
                      <div className="text-xs text-gray-500">تطلب تدخّل بشري</div>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600">فتح</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

