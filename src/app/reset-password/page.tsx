"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      setErrors({ general: "حدث خطأ أثناء إعادة تعيين كلمة المرور. حاول مرة أخرى." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            تم تغيير كلمة المرور!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
          </p>
          <Link
            href={ROUTES.LOGIN}
            className="btn-brand px-6 py-3 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors inline-block"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.jpg"
              alt="مُعين"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold text-brand">مُعين</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            إعادة تعيين كلمة المرور
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            أدخل كلمة المرور الجديدة
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أدخل كلمة المرور الجديدة"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                يجب أن تكون كلمة المرور 6 أحرف على الأقل
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">متطلبات كلمة المرور:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• يجب أن تكون 6 أحرف على الأقل</li>
                <li>• يُفضل أن تحتوي على أرقام ورموز</li>
                <li>• تجنب استخدام كلمات مرور سهلة التخمين</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-brand py-3 rounded-lg text-white font-semibold hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الحفظ...
                </div>
              ) : (
                "تغيير كلمة المرور"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              تذكرت كلمة المرور؟{" "}
              <Link
                href={ROUTES.LOGIN}
                className="text-[var(--brand-primary)] hover:underline font-semibold"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}