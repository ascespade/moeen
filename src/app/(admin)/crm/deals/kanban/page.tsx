export default function DealsKanbanPage() {
  return (
    <>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded'
        aria-label='انتقل للمحتوى الرئيسي'
      >
        انتقل للمحتوى الرئيسي
      </a>
      <main className='container-app py-8' id='main-content'>
        <h1 className='text-default mb-4 text-2xl font-bold'>
          لوحة الصفقات (Kanban)
        </h1>
        <div className='border-default h-96 rounded-xl border bg-white p-4 dark:bg-gray-900'>
          Kanban Placeholder
        </div>
      </main>
    </>
  );
}
