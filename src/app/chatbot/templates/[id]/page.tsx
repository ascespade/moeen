"use client";

import { useState } from "react";
import Link from "next/link";

export default function TemplateEditorPage({ params }: { params: { id: string } }) {
  const [template, setTemplate] = useState({
    id: "1",
    name: "ترحيب المرضى",
    description: "رسالة ترحيب للمرضى الجدد",
    content: "مرحباً {{اسم المريض}}، أهلاً وسهلاً بك في {{اسم المركز}}!",
    variables: ["اسم المريض", "اسم المركز"]
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '1.5rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/chatbot/templates" style={{ color: '#9ca3af' }}>
                ← العودة
              </Link>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--foreground)' }}>
                  {template.name}
                </h1>
                <p style={{ color: 'var(--secondary)' }}>
                  {template.description}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary">
                معاينة
              </button>
              <button className="btn btn-primary">
                حفظ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--foreground)' }}>
              محتوى القالب
            </h2>
            <textarea
              value={template.content}
              onChange={(e) => setTemplate(prev => ({ ...prev, content: e.target.value }))}
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              placeholder="اكتب محتوى القالب هنا..."
            />
          </div>

          <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--foreground)' }}>
              المتغيرات
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {template.variables.map((variable, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem'
                  }}
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}