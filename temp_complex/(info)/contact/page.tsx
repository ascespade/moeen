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
      icon: <Mail className="w-6 h-6" />,
      title: "البريد الإلكتروني",
      value: "info@mu3een.com",
      link: "mailto:info@mu3een.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "الهاتف",
      value: "+966 50 123 4567",
      link: "tel:+966501234567",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      link: "#",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "ساعات العمل",
      value: "الأحد - الخميس: 8:00 - 17:00",
      link: "#",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Image
              src="/logo.jpg"
              alt="Hemam Logo"
              width={64}
              height={64}
              className="mx-auto rounded mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              تم إرسال رسالتك
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                رسالتك في الطريق
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                تم استلام رسالتك بنجاح وسنقوم بالرد عليك خلال 24 ساعة.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
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
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
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
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-[var(--brand-primary)]"
              >
                الرئيسية
              </Link>
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-400 hover:text-[var(--brand-primary)]"
              >
                من نحن
              </Link>
              <Link
                href="/contact"
                className="text-[var(--brand-primary)] font-medium"
              >
                تواصل
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">تواصل معنا</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            نحن هنا لمساعدتك في أي وقت
          </p>
          <p className="text-lg opacity-80 max-w-3xl mx-auto">
            يسعدنا تواصلك معنا. سواء كنت تريد المساعدة أو لديك اقتراحات أو
            استفسارات، نحن هنا للاستماع إليك.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[var(--brand-primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-[var(--brand-primary)]">{info.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <a
                  href={info.link}
                  className="text-gray-600 dark:text-gray-400 hover:text-[var(--brand-primary)] transition-colors"
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
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                أرسل لنا رسالة
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن. نحن نقدر تواصلك
                معنا ونعمل على تقديم أفضل خدمة ممكنة.
              </p>

              <form onSubmit={submit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-[var(--brand-primary)] text-white py-3 px-6 rounded-lg hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                معلومات التواصل
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-[var(--brand-primary)] mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {info.title}
                      </h4>
                      <a
                        href={info.link}
                        className="text-gray-600 dark:text-gray-400 hover:text-[var(--brand-primary)] transition-colors"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-[var(--brand-primary)] bg-opacity-10 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  أوقات الاستجابة
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  نحن نرد على جميع الرسائل خلال 24 ساعة في أيام العمل.
                  للاستفسارات العاجلة، يرجى الاتصال بنا مباشرة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
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
              <h3 className="font-semibold mb-4">روابط سريعة</h3>
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
              <h3 className="font-semibold mb-4">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400">
                <p>البريد الإلكتروني: info@mu3een.com</p>
                <p>الهاتف: +966 50 123 4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 مُعين. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
