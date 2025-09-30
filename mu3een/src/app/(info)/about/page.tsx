export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container-app px-4 py-12">
        <div className="card card-pad shadow-soft">
          <h1 className="text-2xl font-bold mb-4">عن مركز الهمم</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            نسعى لتمكين ذوي الإعاقة وتيسير الوصول إلى الخدمات عبر منصة موحّدة تدعم RTL/LTR.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="p-4 border border-[var(--brand-border)] rounded-lg">
              <h3 className="font-semibold mb-2">رؤيتنا</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">مجتمع أكثر شمولية وعدلاً للجميع.</p>
            </div>
            <div className="p-4 border border-[var(--brand-border)] rounded-lg">
              <h3 className="font-semibold mb-2">رسالتنا</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">تقديم حلول تواصل وتأهيل متقدمة وسهلة الاستخدام.</p>
            </div>
            <div className="p-4 border border-[var(--brand-border)] rounded-lg">
              <h3 className="font-semibold mb-2">قيمنا</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">الكرامة، التمكين، الشراكة، الابتكار.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

