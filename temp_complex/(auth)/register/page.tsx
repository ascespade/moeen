"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "beneficiary" as "beneficiary" | "volunteer" | "donor",
    agree: false,
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-6 text-2xl font-bold">إنشاء حساب</h1>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm">الاسم الكامل</label>
            <input
              name="fullName"
              required
              className="w-full rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            <label className="block text-sm mb-1">الاسم الكامل</label>
            <input
              name="fullName"
              required
              className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)] bg-white"
              onChange={onChange}
              placeholder="مثال: أحمد محمد"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">البريد الإلكتروني</label>
              <label className="block text-sm mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)] bg-white"
                onChange={onChange}
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">رقم الجوال</label>
              <input
                type="tel"
                name="phone"
                className="w-full rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              <label className="block text-sm mb-1">رقم الجوال</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)] bg-white"
                onChange={onChange}
                placeholder="05xxxxxxxx"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">كلمة المرور</label>
              <label className="block text-sm mb-1">كلمة المرور</label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)] bg-white"
                onChange={onChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">تأكيد ك��مة المرور</label>
              <label className="block text-sm mb-1">تأكيد ك��مة المرور</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)] bg-white"
                onChange={onChange}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm">الدور</label>
            <select
              name="role"
              className="w-full rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            <label className="block text-sm mb-1">الدور</label>
            <select
              name="role"
              className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)] bg-white"
              onChange={onChange}
              defaultValue={formData.role}
            >
              <option value="beneficiary">مستفيد</option>
              <option value="volunteer">متطوع</option>
              <option value="donor">متبرع</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="agree"
              required
              onChange={onChange}
              className="shrink-0 rounded border-[var(--brand-border)] text-[var(--brand-primary)] focus:ring-[var(--focus-ring)]"
            />
            <span className="text-sm">أوافق على الشروط والسياسة</span>
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-3 font-medium text-white hover:bg-[var(--brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)]"
          >
            {isLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
        <p className="text-center text-sm mt-4">
          لديك حساب؟{" "}
          <Link
            href="/login"
            className="text-[var(--brand-primary)] underline hover:text-[var(--brand-primary-hover)]"
          >
            سجّل دخول
          </Link>
        </p>
      </div>
    </div>
  );
}
