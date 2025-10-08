interface Props { params: { id: string } }

export default function TemplateEditorPage({ params }: Props) {
  return (
    <main className="container-app py-8">
      <h1 className="text-2xl font-bold text-brand mb-4">تحرير القالب: {params.id}</h1>
      <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4">نموذج القالب (UI فقط)</div>
    </main>
  );
}


