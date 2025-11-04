interface Props {
  params: { id: string };
}

export default function ContactDetailsPage({ params }: Props) {
  return (
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded" aria-label="?????? ??????? ???????">
  ?????? ??????? ???????
</a>

main className='container-app py-8'>
      <h1 className='text-default mb-4 text-2xl font-bold'>
        تفاصيل جهة الاتصال: {params.id}
      </h1>
      <div className='border-default rounded-xl border bg-white p-4 dark:bg-gray-900'>
        تفاصيل (UI فقط)
      </div>
    </main>
  );
}
