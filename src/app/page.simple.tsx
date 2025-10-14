import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-screen-xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">مركز الهمم</h1>
            <nav className="flex gap-4">
              <Link
                href={ROUTES.LOGIN}
                className="text-gray-700 hover:text-blue-600"
              >
                تسجيل الدخول
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                احجز موعد
              </Link>
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

      <main className="mx-auto max-w-screen-xl px-4 py-16">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            مركز الهمم للرعاية الصحية
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            نقدم رعاية صحية شاملة ومتخصصة مع أحدث التقنيات
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={ROUTES.REGISTER}
              className="rounded-lg bg-blue-600 px-8 py-3 text-white"
            >
              احجز موعد الآن
            </Link>
            <a
              href="#services"
              className="rounded-lg border border-gray-300 px-8 py-3"
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
          <h3 className="mb-8 text-center text-3xl font-bold">خدماتنا</h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-xl font-semibold">العلاج الطبيعي</h4>
              <p className="text-gray-600">برامج علاج طبيعي متخصصة</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-xl font-semibold">العلاج النفسي</h4>
              <p className="text-gray-600">جلسات علاج نفسي متخصصة</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="mb-2 text-xl font-semibold">العلاج الوظيفي</h4>
              <p className="text-gray-600">تحسين المهارات الوظيفية</p>
            </div>
          </div>
        </section>

        <section className="mt-16 text-center">
          <h3 className="mb-4 text-3xl font-bold">تواصل معنا</h3>
          <p className="mb-4 text-gray-600">+966 50 123 4567</p>
          <p className="text-gray-600">جدة، المملكة العربية السعودية</p>
        </section>
      </main>
    </div>
  );
}
