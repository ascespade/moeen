"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // بيانات الدخول التجريبية
    const validCredentials = [
      { email: "admin@alhemamcenter.com", password: "admin123", role: "admin" },
      { email: "doctor@alhemamcenter.com", password: "doctor123", role: "doctor" },
      { email: "staff@alhemamcenter.com", password: "staff123", role: "staff" },
      { email: "demo@alhemamcenter.com", password: "demo123", role: "demo" }
    ];

    const user = validCredentials.find(
      cred => cred.email === formData.email && cred.password === formData.password
    );

    if (user) {
      // حفظ بيانات المستخدم في localStorage
      const userData = {
        email: user.email,
        role: user.role,
        name: user.role === "admin" ? "مدير النظام" : 
              user.role === "doctor" ? "د. أحمد محمد" :
              user.role === "staff" ? "موظف الدعم" : "مستخدم تجريبي",
        rememberMe: formData.rememberMe
      };
      
      localStorage.setItem("muayin_user", JSON.stringify(userData));
      
      // محاكاة تأخير للتحميل
      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 1000);
    } else {
      setIsLoading(false);
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    localStorage.setItem("muayin_user", JSON.stringify({
      email: "demo@alhemamcenter.com",
      role: "demo",
      name: "مستخدم تجريبي"
    }));
    
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Image
              src="/logo.jpg"
              alt="مركز الهمم"
              width={48}
              height={48}
              className="rounded-full object-cover"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك</h1>
          <p className="text-gray-600 text-lg">نظام مُعين - المساعد الذكي لمركز الهمم</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="admin@alhemamcenter.com"
                required
                disabled={isLoading}
              />
              <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-12"
                placeholder="أدخل كلمة المرور"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                disabled={isLoading}
              />
              <span className="mr-2 text-sm text-gray-600">تذكرني</span>
            </label>
            <button
              type="button"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              disabled={isLoading}
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري تسجيل الدخول...
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
        
        <div className="mt-6">
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 دخول تجريبي سريع
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">بيانات الدخول التجريبية</h3>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="font-medium text-emerald-700">مدير</span>
              <span className="text-gray-500">admin@alhemamcenter.com / admin123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="font-medium text-blue-700">طبيب</span>
              <span className="text-gray-500">doctor@alhemamcenter.com / doctor123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="font-medium text-purple-700">موظف</span>
              <span className="text-gray-500">staff@alhemamcenter.com / staff123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="font-medium text-orange-700">تجريبي</span>
              <span className="text-gray-500">demo@alhemamcenter.com / demo123</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Image
              src="/logo.jpg"
              alt="مركز الهمم"
              width={20}
              height={20}
              className="rounded-full"
              style={{ width: "auto", height: "auto" }}
            />
            <span>مركز الهمم - نظام مُعين</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">نظام ذكي للرعاية الصحية</p>
        </div>
      </div>
    </div>
  );
}