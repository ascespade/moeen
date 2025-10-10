"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // محاكاة إرسال الرسالة
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSending(false);
    setIsSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "البريد الإلكتروني",
      value: "info@mu3een.com",
      link: "mailto:info@mu3een.com",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "الهاتف",
      value: "+966 50 123 4567",
      link: "tel:+966501234567",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      link: "#",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "ساعات العمل",
      value: "الأحد - الخميس: 8:00 - 17:00",
      link: "#",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Image
              src="/logo.jpg"
              alt="Hemam Logo"
              width={64}
              height={64}
              className="mx-auto mb-4 rounded"
            />
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              تم إرسال رسالتك
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                رسالتك في الطريق
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                تم استلام رسالتك بنجاح وسنقوم بالرد عليك خلال 24 ساعة.
              </p>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Hemam Logo"
                width={40}
                height={40}
                className="rounded"
              />
              <span
                className="text-xl font-bold"
                style={{ color: "var(--brand-primary)" }}
              >
                مُعين
              </span>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className="text-gray-600 hover:text-[var(--brand-primary)] dark:text-gray-400"
              >
                الرئيسية
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-[var(--brand-primary)] dark:text-gray-400"
              >
                من نحن
              </Link>
              <Link
                href="/contact"
                className="font-medium text-[var(--brand-primary)]"
              >
                تواصل
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] py-20 text-white">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">تواصل معنا</h1>
          <p className="mb-8 text-xl opacity-90 md:text-2xl">
            نحن هنا لمساعدتك في أي وقت
          </p>
          <p className="mx-auto max-w-3xl text-lg opacity-80">
            يسعدنا تواصلك معنا. سواء كنت تريد المساعدة أو لديك اقتراحات أو
            استفسارات، نحن هنا للاستماع إليك.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary)] bg-opacity-10">
                  <div className="text-[var(--brand-primary)]">{info.icon}</div>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  {info.title}
                </h3>
                <a
                  href={info.link}
                  className="text-gray-600 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400"
                >
                  {info.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                أرسل لنا رسالة
              </h2>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن. نحن نقدر تواصلك
                معنا ونعمل على تقديم أفضل خدمة ممكنة.
              </p>

              <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="اسمك الكامل"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    الموضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="موضوع الرسالة"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="نص الرسالة"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-white transition-colors hover:bg-[var(--brand-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="rounded-xl bg-gray-100 p-8 dark:bg-gray-800">
              <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                معلومات التواصل
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 text-[var(--brand-primary)]">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900 dark:text-white">
                        {info.title}
                      </h4>
                      <a
                        href={info.link}
                        className="text-gray-600 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-lg bg-[var(--brand-primary)] bg-opacity-10 p-6">
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  أوقات الاستجابة
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  نحن نرد على جميع الرسائل خلال 24 ساعة في أيام العمل.
                  للاستفسارات العاجلة، يرجى الاتصال بنا مباشرة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="Hemam Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-xl font-bold">مُعين</span>
              </div>
              <p className="text-gray-400">
                منصة شاملة تجمع بين المحتاجين والمتطوعين والمتبرعين لبناء مجتمع
                أفضل.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">روابط سريعة</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white">
                  الرئيسية
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-400 hover:text-white"
                >
                  من نحن
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-400 hover:text-white"
                >
                  تواصل
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400">
                <p>البريد الإلكتروني: info@mu3een.com</p>
                <p>الهاتف: +966 50 123 4567</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 مُعين. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
