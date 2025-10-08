import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="bg-white dark:bg-gray-900 border-b border-brand">
        <div className="container-app py-10 text-center">
          <h1 className="text-4xl font-bold text-brand mb-2">مركز الهمم</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">للرعاية الصحية المتخصصة</p>
          <nav className="flex justify-center gap-3">
            <Link href={ROUTES.LOGIN} className="border border-brand px-4 py-2 rounded">
              تسجيل الدخول
            </Link>
            <Link href={ROUTES.REGISTER} className="btn-brand px-4 py-2 rounded">
              احجز موعد
            </Link>
          </nav>
        </div>
      </header>

      <main className="container-app py-12">
        <section style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>
            خدماتنا المتخصصة
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
                العلاج الطبيعي
              </h3>
              <p style={{ color: "#666" }}>
                برامج علاج طبيعي متخصصة مع متابعة ذكية
              </p>
            </div>
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
                العلاج النفسي
              </h3>
              <p style={{ color: "#666" }}>جلسات علاج نفسي مع دعم متخصص</p>
            </div>
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
                العلاج الوظيفي
              </h3>
              <p style={{ color: "#666" }}>تحسين المهارات الوظيفية والحياتية</p>
            </div>
          </div>
        </section>

        <section className="text-center bg-gray-100 dark:bg-gray-800 p-8 rounded">
          <h2 style={{ marginBottom: "20px" }}>تواصل معنا</h2>
          <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
            📞 +966 50 123 4567
          </p>
          <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
            📍 جدة، المملكة العربية السعودية
          </p>
          <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
            ✉️ info@alhemam.sa
          </p>
        </section>
      </main>
    </div>
  );
}
