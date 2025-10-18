type Props = { title: string; value: string; hint?: string };

export default function KpiCard({ title, value, hint }: Props) {
  return (
    <div className="rounded-xl border p-4 bg-white/60 dark:bg-white/5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {hint ? <div className="text-xs text-gray-400 mt-1">{hint}</div> : null}
    </div>
  );
