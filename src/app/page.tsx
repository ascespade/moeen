export default function Home() {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{ color: "#2563eb", fontSize: "2.5rem", margin: "0 0 10px 0" }}
        >
          مركز الهمم
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          للرعاية الصحية المتخصصة
        </p>
      </header>

      <nav style={{ textAlign: "center", marginBottom: "40px" }}>
        <a
          href="/login"
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            background: "#f3f4f6",
            color: "#374151",
            textDecoration: "none",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          تسجيل الدخول
        </a>
        <a
          href="/register"
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          احجز موعد
        </a>
      </nav>

      <main>
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

        <section
          style={{
            textAlign: "center",
            background: "#f3f4f6",
            padding: "30px",
            borderRadius: "8px",
          }}
        >
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
