"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/I18nProvider";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Toast from "@/components/ui/toast";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useT();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Demo users for testing
  const demoUsers = [
    { email: "admin@alhemamcenter.com", password: "admin123", role: "admin", name: "مدير النظام" },
    { email: "manager@alhemamcenter.com", password: "manager123", role: "manager", name: "مدير الفريق" },
    { email: "agent@alhemamcenter.com", password: "agent123", role: "agent", name: "وكيل خدمة العملاء" },
    { email: "demo@alhemamcenter.com", password: "demo123", role: "user", name: "مستخدم تجريبي" },
  ];

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const user = localStorage.getItem("muayin_user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          console.log("User already logged in:", userData);
          if (userData.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/dashboard";
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("muayin_user");
          localStorage.removeItem("muayin_token");
        }
      }
    };

    // Check immediately
    checkAuth();

    // Also check on storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "muayin_user" && e.newValue) {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDemoLogin = (demoUser: typeof demoUsers[0]) => {
    setFormData({
      email: demoUser.email,
      password: demoUser.password,
      remember: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call with database integration
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data in localStorage
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          avatar: data.user.avatar,
        };

        localStorage.setItem("muayin_user", JSON.stringify(userData));
        localStorage.setItem("muayin_token", data.token);

        setToast({ message: "تم تسجيل الدخول بنجاح!", type: "success" });

        // Redirect based on role
        setTimeout(() => {
          if (userData.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      } else {
        setToast({ message: data.message || "خطأ في تسجيل الدخول", type: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setToast({ message: "خطأ في الاتصال بالخادم", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">م</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              مرحباً بك في مُعين
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              سجل دخولك للوصول إلى لوحة التحكم
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                  تذكرني
                </span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                نسيت كلمة المرور؟
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "تسجيل الدخول"}
            </Button>
          </form>

          {/* Demo Users Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
              حسابات تجريبية للاختبار
            </h3>
            <div className="space-y-2">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(user)}
                  className="w-full text-right p-2 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}