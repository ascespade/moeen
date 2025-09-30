"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Icons removed for performance
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      // Set demo auth cookie
      document.cookie = "mu3een_demo_auth=true; path=/; max-age=86400";
      window.location.href = "/dashboard";
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
            <Image
              src="/hemam-logo.jpg"
              alt="Hemam Logo"
              width={48}
              height={48}
              className="rounded-lg"
              priority
              unoptimized
            />
            <span className="text-3xl font-bold text-brand-primary">مُعين</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            مرحباً بك مرة أخرى
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            سجل دخولك للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Login Form */}
        <div className="card card-pad shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "إخفاء" : "إظهار"}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                />
                <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">تذكرني</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-brand-primary hover:text-brand-primary-hover transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-brand py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-6 pt-6 border-t border-brand-border">
            <button
              onClick={() => {
                document.cookie = "mu3een_demo_auth=true; path=/; max-age=86400";
                window.location.href = "/dashboard";
              }}
              className="w-full py-3 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              ➡️ دخول تجريبي
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-brand-primary hover:text-brand-primary-hover font-medium transition-colors"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}