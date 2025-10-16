export default function __GuidelinesPage() {
  return (
    <main className="p-6 grid gap-6">
      <h1 className="text-2xl font-semibold">UI Guidelines</h1>

      <section className="grid gap-3">
        <div className="font-medium">Brand Colors</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border p-3">
            <div className="h-10 rounded bg-brand mb-2" />
            <div className="text-sm">Primary</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="h-10 rounded bg-amber-500 mb-2" />
            <div className="text-sm">Accent</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="h-10 rounded bg-green-600 mb-2" />
            <div className="text-sm">Success</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="h-10 rounded bg-gray-600 mb-2" />
            <div className="text-sm">Neutral</div>
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        <div className="font-medium">Spacing</div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-4 bg-gray-200" />
          <div className="h-4 w-8 bg-gray-200" />
          <div className="h-4 w-12 bg-gray-200" />
          <div className="h-4 w-16 bg-gray-200" />
        </div>
        <div className="text-xs text-gray-500">
          Base 8px scale للهوامش والمسافات.
        </div>
      </section>

      <section className="grid gap-3">
        <div className="font-medium">Typography (Cairo)</div>
        <div className="grid gap-1">
          <div className="text-2xl font-semibold">عنوان كبير 24px</div>
          <div className="text-xl font-semibold">عنوان 20px</div>
          <div className="text-lg">نص كبير 18px</div>
          <div className="text-base">نص أساسي 16px</div>
          <div className="text-sm text-gray-500">ملاحظة 14px</div>
        </div>
      </section>

      <section className="grid gap-3">
        <div className="font-medium">Interaction States</div>
        <div className="flex flex-wrap gap-2">
          <button className="h-10 px-4 rounded-md btn-brand">Default</button>
          <button className="h-10 px-4 rounded-md btn-brand" disabled>
            Disabled
          </button>
          <button className="h-10 px-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500">
            Focus
          </button>
        </div>
      </section>
    </main>
  );
}
