"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: string;
  description: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Demo users data
  const demoUsers: DemoUser[] = [
    {
      email: 'admin@alhemamcenter.com',
      password: 'admin123',
      name: 'مدير النظام',
      role: 'مدير',
      description: 'صلاحيات كاملة'
    },
    {
      email: 'manager@alhemamcenter.com',
      password: 'manager123',
      name: 'مدير الفريق',
      role: 'مدير فريق',
      description: 'إدارة الفريق والعمليات'
    },
    {
      email: 'agent@alhemamcenter.com',
      password: 'agent123',
      name: 'وكيل خدمة العملاء',
      role: 'وكيل',
      description: 'خدمة العملاء'
    },
    {
      email: 'demo@alhemamcenter.com',
      password: 'demo123',
      name: 'مستخدم تجريبي',
      role: 'تجريبي',
      description: 'عرض تجريبي'
    }
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 [LOGIN] Starting login process...');
    console.log('📧 [LOGIN] Email:', formData.email);
    console.log('🔑 [LOGIN] Password:', formData.password);
    
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      console.log('🌐 [LOGIN] Making API call to /api/auth/login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      });

      console.log('📡 [LOGIN] Response status:', response.status);
      console.log('📡 [LOGIN] Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📦 [LOGIN] Response data:', data);

      if (response.ok && data.success) {
        console.log('✅ [LOGIN] Login successful!');
        setSuccess('تم تسجيل الدخول بنجاح!');
        
        // Save user data and token
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          token: data.token,
          rememberMe: formData.rememberMe
        };
        
        console.log('💾 [LOGIN] Saving user data to localStorage:', userData);
        localStorage.setItem("muayin_user", JSON.stringify(userData));
        
        // Redirect based on role
        console.log('🎯 [LOGIN] User role:', data.user.role);
        setIsLoading(false);
        
        if (data.user.role === 'demo') {
          console.log('🔄 [LOGIN] Redirecting to /demo...');
          window.location.href = "/demo";
        } else {
          console.log('🔄 [LOGIN] Redirecting to /admin/dashboard...');
          window.location.href = "/admin/dashboard";
        }
      } else {
        console.log('❌ [LOGIN] Login failed:', data.error);
        setIsLoading(false);
        setError(data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (error) {
      console.log('💥 [LOGIN] Login error:', error);
      setIsLoading(false);
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      console.error('Login error:', error);
    }
  };

  // Handle demo login
  const handleDemoLogin = async (demoUser: DemoUser) => {
    console.log('🚀 [DEMO] Starting demo login...');
    console.log('👤 [DEMO] Demo user:', demoUser);
    
    setFormData({
      email: demoUser.email,
      password: demoUser.password,
      rememberMe: false
    });
    
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      console.log('🌐 [DEMO] Making API call to /api/auth/login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: demoUser.email,
          password: demoUser.password,
          rememberMe: false
        }),
      });

      console.log('📡 [DEMO] Response status:', response.status);
      console.log('📡 [DEMO] Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📦 [DEMO] Response data:', data);

      if (response.ok && data.success) {
        console.log('✅ [DEMO] Demo login successful!');
        setSuccess(`مرحباً ${demoUser.name}!`);
        
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          token: data.token,
          rememberMe: false
        };
        
        console.log('💾 [DEMO] Saving user data to localStorage:', userData);
        localStorage.setItem("muayin_user", JSON.stringify(userData));
        
        console.log('🎯 [DEMO] User role:', data.user.role);
        setIsLoading(false);
        
        if (data.user.role === 'demo') {
          console.log('🔄 [DEMO] Redirecting to /demo...');
          window.location.href = "/demo";
        } else {
          console.log('🔄 [DEMO] Redirecting to /admin/dashboard...');
          window.location.href = "/admin/dashboard";
        }
      } else {
        console.log('❌ [DEMO] Demo login failed:', data.error);
        setIsLoading(false);
        setError(data.error || "فشل في تسجيل الدخول التجريبي");
      }
    } catch (error) {
      console.log('💥 [DEMO] Demo login error:', error);
      setIsLoading(false);
      setError("حدث خطأ في الاتصال");
      console.error('Demo login error:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle demo credential click
  const handleDemoCredentialClick = (email: string, password: string) => {
    console.log('🖱️ [CREDENTIAL] Demo credential clicked:', { email, password });
    setFormData({
      email,
      password,
      rememberMe: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Image
              src="/logo.svg"
              alt="مركز الهمم"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك</h1>
          <p className="text-lg text-gray-600">نظام مُعين - المساعد الذكي لمركز الهمم</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 pr-10 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="أدخل كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="mr-2 block text-sm text-gray-700">
                تذكرني
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        {/* Demo Users Section */}
        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">حسابات تجريبية</h3>
          <div className="space-y-2">
            {demoUsers.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-white rounded border cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                onClick={() => handleDemoCredentialClick(user.email, user.password)}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">{user.email}</div>
                  <div className="text-xs text-emerald-600 font-medium">{user.role}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => handleDemoLogin(demoUsers[0])}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              🚀 دخول تجريبي سريع
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Image
              src="/logo.svg"
              alt="مركز الهمم"
              width={20}
              height={20}
              className="rounded-full"
              style={{ width: "auto", height: "auto" }}
            />
            <span>© 2024 مركز الهمم - جميع الحقوق محفوظة</span>
          </div>
        </div>
      </div>
    </div>
  );
}