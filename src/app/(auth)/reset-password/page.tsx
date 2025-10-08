"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }

    if (formData.password.length < 8) {
      alert("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setIsLoading(true);
    
    // محاكاة إعادة تعيين كلمة المرور
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Image src="/logo.jpg" alt="Hemam Logo" width={64} height={64} className="mx-auto rounded mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              تم تغيير كلمة المرور
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بحسابك.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                تم بنجاح!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بحسابك الجديد.
              </p>
              <Link 
                href="/login"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image src="/logo.jpg" alt="Hemam Logo" width={64} height={64} className="mx-auto rounded mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            إعادة تعيين كلمة المرور
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            أدخل كلمة المرور الجديدة
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="أدخل كلمة المرور الجديدة"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                متطلبات كلمة المرور:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 8 أحرف على الأقل</li>
                <li>• تحتوي على حروف وأرقام</li>
                <li>• لا تحتوي على مسافات</li>
              </ul>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--brand-primary)] text-white py-2 px-4 rounded-lg hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href="/login"
              className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] text-sm"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
