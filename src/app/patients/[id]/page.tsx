interface Props { params: { id: string } }

export default function PatientDetailsPage({ params }: Props) {
  return (
    <main className="container-app py-8">
      <h1 className="text-2xl font-bold text-brand mb-4">ملف المريض: {params.id}</h1>
      <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">بيانات المريض (UI فقط)</div>
    </main>
  );
}


