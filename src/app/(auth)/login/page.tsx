"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      localStorage.setItem("muayin_user", JSON.stringify({
        email: user.email,
        role: user.role,
        name: user.role === "admin" ? "مدير النظام" : 
              user.role === "doctor" ? "د. أحمد محمد" :
              user.role === "staff" ? "موظف الدعم" : "مستخدم تجريبي"
      }));
      
      // توجيه إلى الصفحة الرئيسية
      router.push("/");
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">مُعين</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">المساعد الذكي لمركز الهمم</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@alhemamcenter.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            تسجيل الدخول
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">بيانات الدخول التجريبية:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>مدير:</strong> admin@alhemamcenter.com / admin123</p>
            <p><strong>طبيب:</strong> doctor@alhemamcenter.com / doctor123</p>
            <p><strong>موظف:</strong> staff@alhemamcenter.com / staff123</p>
            <p><strong>تجريبي:</strong> demo@alhemamcenter.com / demo123</p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>مركز الهمم - نظام مُعين</p>
          <p className="mt-1">نظام ذكي للرعاية الصحية</p>
        </div>
      </div>
    </div>
  );
}