export default function UIKitPage() {
  return (
    <main className='min-h-screen bg-[var(--brand-surface)]'>
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
              <button className='btn btn-brand'>Primary</button>
              <button className='btn btn-secondary'>Secondary</button>
              <button className='btn btn-outline'>Ghost</button>
              <button
                className='btn btn-outline'
                style={{
                  backgroundColor: 'var(--brand-warning)',
                  color: 'white',
                }}
              >
                Accent
              </button>
              <button
                className='btn btn-outline'
                style={{
                  backgroundColor: 'var(--brand-error)',
                  color: 'white',
                }}
              >
                Destructive
              </button>
            </div>
          </section>

          <section className='card p-6'>
            <div className='font-medium text-[var(--foreground)] mb-3'>
              Inputs
            </div>
            <div className='grid sm:grid-cols-2 gap-2'>
              <input className='form-input' placeholder='Text field' />
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
  );
}
