interface Props { params: { flowId: string } }

export default function FlowBuilderPage({ params }: Props) {
  return (
    <main className="container-app py-8">
      <h1 className="text-2xl font-bold text-brand mb-4">محرر التدفق: {params.flowId}</h1>
      <div className="rounded-xl border border-brand bg-white dark:bg-gray-900 p-4 h-96">Canvas Placeholder</div>
    </main>
  );
}


