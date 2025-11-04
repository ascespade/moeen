export default function FlowBuilderPage() {
  return (
    <ahref="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded" aria-label="?????? ??????? ???????">
  ?????? ??????? ???????
</a>

main className='min-h-screen bg-[var(--default-surface)]'>
      <div className='container-app py-6'>
        <div className='grid gap-4 lg:grid-cols-[280px_1fr_320px]'>
          <aside className='card p-4 grid gap-3'>
            <div className='font-medium text-[var(--foreground)]'>العُقد</div>
            <div className='grid gap-2'>
              {[
                'إرسال رسالة',
                'سؤال',
                'استدعاء API',
                'تحويل لبشري',
                'شرط IF/ELSE',
              ].map(n => (
                <button key={n} className='btn btn-outline btn-sm text-start' aria-label="{n}">
                  {n}
                </button>
              ))}
            </div>
          </aside>
          <section className='card min-h-[60dvh] p-4'>
            <div className='text-[var(--foreground)]/60'>
              لوحة عمل: اسحب العقد ووصلها (تصميم بصري)
            </section>
          </section>
          <aside className='card p-4'>
            <div className='font-medium mb-2 text-[var(--foreground)]'>
              خصائص العنصر
            </div>
            <div className='text-sm text-[var(--foreground)]/60'>
              حدد عقدة لتحرير الخصائص
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
