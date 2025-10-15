interface Props {
  params: { id: string };
}

export default function ContactDetailsPage({ params }: Props) {
  return (
    <main className="container-app py-8">
      <h1 className="text-brand mb-4 text-2xl font-bold">
        تفاصيل جهة الاتصال: {params.id}
      </h1>
      <div className="border-brand rounded-xl border bg-white p-4 dark:bg-gray-900">
        تفاصيل (UI فقط)
      </div>
    </main>
  );
}
