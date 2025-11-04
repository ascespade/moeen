/**
 * Loading Component for Admin Pages
 * مكون التحميل الموحد لصفحات Admin
 * يظهر فقط في منطقة المحتوى، السايد بار والهيدر يبقوا ثابتين
 */

export default function AdminLoading() {
  return (
    <div className='flex items-center justify-center min-h-[400px]'>
      <div className='text-center'>
        <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto'></div>
        <p className='text-gray-600'>جاري التحميل...</p>
      </div>
    </div>
  );
}


