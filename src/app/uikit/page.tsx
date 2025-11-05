export default function UIKitPage() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded" aria-label="انتقل للمحتوى الرئيسي">
        انتقل للمحتوى الرئيسي
      </a>
      <main className='min-h-screen bg-[var(--default-surface)]'>
      <div className='container-app py-6'>
        <div className='grid gap-6'>
          <h1 className='text-2xl font-semibold text-[var(--foreground)]'>
            UI Kit
          </h1>

          <section className='card p-6'>
            <div className='font-medium text-[var(--foreground)] mb-3'>
              Buttons
            </div>
            <div className='flex flex-wrap gap-2'>
              <button className='btn btn-default' aria-label="Primary">Primary</button>
              <button className='btn btn-info' aria-label="Secondary">Secondary</button>
              <button className='btn btn-outline' aria-label="Ghost">Ghost</button>
              <button
                className='btn btn-outline'
                style={{
                  backgroundColor: 'var(--default-warning)',
                  color: 'white',
                }}
               aria-label="Accent">
                Accent
              </button>
              <button
                className='btn btn-outline'
                style={{
                  backgroundColor: 'var(--default-error)',
                  color: 'white',
                }}
               aria-label="Destructive">
                Destructive
              </button>
            </div>
          </section>

          <section className='card p-6'>
            <div className='font-medium text-[var(--foreground)] mb-3'>
              Inputs
            </div>
            <div className='grid sm:grid-cols-2 gap-2'>
              <input className='form-input' placeholder='Text field' aria-label="Text field" />
              <select className='form-input'>
                <option>Option</option>
              </select>
              <textarea
                className='form-input'
                rows={3}
                placeholder='Textarea'
              />
            </div>
          </section>

          <section className='card p-6'>
            <div className='font-medium text-[var(--foreground)] mb-3'>
              Cards & Badges
            </div>
            <div className='grid sm:grid-cols-2 gap-3'>
              <div className='card p-4'>
                <div className='text-sm text-[var(--foreground)]/60'>عنوان</div>
                <div className='text-lg font-semibold text-[var(--foreground)]'>
                  بطاقة بعناصر
                  <span className='ms-2 badge badge-accent'>Accent</span>
                </div>
              </div>
              <div className='card p-4'>
                <div className='text-sm text-[var(--foreground)]/60'>عنوان</div>
                <div className='text-lg font-semibold text-[var(--foreground)]'>
                  بطاقة أخرى
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
    </>
  );
}
