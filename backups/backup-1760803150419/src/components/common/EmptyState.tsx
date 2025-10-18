export default function EmptyState({
  title,
  description,
  cta,
}: {
  title: string;
  description?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-8 text-center text-gray-600">
      <div className="mx-auto h-12 w-12 rounded-full bg-surface mb-3" />
      <div className="text-lg font-medium">{title}</div>
      {description && (
        <div className="text-sm text-gray-500 mt-1">{description}</div>
      )}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
