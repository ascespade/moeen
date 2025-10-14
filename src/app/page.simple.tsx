export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">مركز الهمم</h1>
            <nav className="flex gap-4">
              <a href="/login" className="text-gray-700 hover:text-blue-600">
                تسجيل الدخول
              </a>
              <a
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                احجز موعد
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            مركز الهمم للرعاية الصحية
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            نقدم رعاية صحية شاملة ومتخصصة مع أحدث التقنيات
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
              احجز موعد الآن
            </a>
            <a
              href="#services"
              className="border border-gray-300 px-8 py-3 rounded-lg"
            >
              اكتشف خدماتنا
            </a>
          </div>
        </div>

        <section id="services" className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-8">خدماتنا</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">العلاج الطبيعي</h4>
              <p className="text-gray-600">برامج علاج طبيعي متخصصة</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">العلاج النفسي</h4>
              <p className="text-gray-600">جلسات علاج نفسي متخصصة</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">العلاج الوظيفي</h4>
              <p className="text-gray-600">تحسين المهارات الوظيفية</p>
            </div>
          </div>
        </section>

        <section className="mt-16 text-center">
          <h3 className="text-3xl font-bold mb-4">تواصل معنا</h3>
          <p className="text-gray-600 mb-4">+966 50 123 4567</p>
          <p className="text-gray-600">جدة، المملكة العربية السعودية</p>
        </section>
      </main>
    </div>
  );
}
