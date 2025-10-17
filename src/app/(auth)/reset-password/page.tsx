"use client";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (error) {
      setErrors({
        general: "حدث خطأ أثناء إعادة تعيين كلمة المرور. حاول مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-4">
        <div className="card w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✅
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            تم تغيير كلمة المرور!
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة
            المرور الجديدة.
          </p>
          <Link
            href={ROUTES.LOGIN}
            className="btn-brand inline-block rounded-lg px-6 py-3 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-surface)] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Image
              src="/logo.png"
              alt="مُعين"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <h1 className="text-brand text-3xl font-bold">مُعين</h1>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            إعادة تعيين كلمة المرور
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            أدخل كلمة المرور الجديدة
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          {errors.general && (
            <div className="mb-6 rounded-lg border border-red-200 bg-surface p-4 text-red-700">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أدخل كلمة المرور الجديدة"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-brand-error">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                يجب أن تكون كلمة المرور 6 أحرف على الأقل
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)] ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-brand-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="rounded-lg border border-blue-200 bg-surface p-4">
              <h4 className="mb-2 text-sm font-semibold text-blue-800">
                متطلبات كلمة المرور:
              </h4>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>• يجب أن تكون 6 أحرف على الأقل</li>
                <li>• يُفضل أن تحتوي على أرقام ورموز</li>
                <li>• تجنب استخدام كلمات مرور سهلة التخمين</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-brand w-full rounded-lg py-3 font-semibold text-white transition-colors hover:bg-[var(--brand-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
                className="font-semibold text-[var(--brand-primary)] hover:underline"
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
