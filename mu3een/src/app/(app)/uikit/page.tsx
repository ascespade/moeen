export default function UIKitPage() {
  return (
    <main className="p-6 grid gap-6">
      <h1 className="text-2xl font-semibold">UI Kit</h1>

      <section className="grid gap-3">
        <div className="font-medium">Buttons</div>
        <div className="flex flex-wrap gap-2">
          <button className="h-10 px-4 rounded-md btn-brand">Primary</button>
          <button className="h-10 px-4 rounded-md border">Secondary</button>
          <button className="h-10 px-4 rounded-md border text-brand">Ghost</button>
          <button className="h-10 px-4 rounded-md border bg-amber-50 text-amber-800">Accent</button>
          <button className="h-10 px-4 rounded-md border bg-red-50 text-red-700">Destructive</button>
        </div>
      </section>

      <section className="grid gap-3">
        <div className="font-medium">Inputs</div>
        <div className="grid sm:grid-cols-2 gap-2">
          <input className="h-10 rounded-md border px-3" placeholder="Text field" />
          <select className="h-10 rounded-md border px-3">
            <option>Option</option>
          </select>
          <textarea className="rounded-md border p-3" rows={3} placeholder="Textarea" />
        </div>
      </section>

      <section className="grid gap-3">
        <div className="font-medium">Cards & Badges</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border p-4">
            <div className="text-sm text-gray-500">عنوان</div>
            <div className="text-lg font-semibold">بطاقة بعناصر
              <span className="ms-2 badge-accent rounded-full px-2 py-0.5 text-xs">Accent</span>
            </div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="text-sm text-gray-500">عنوان</div>
            <div className="text-lg font-semibold">بطاقة أخرى</div>
          </div>
        </div>
      </section>
    </main>
  );
}