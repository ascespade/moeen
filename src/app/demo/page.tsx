"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquare, Bot, Users, Settings } from "lucide-react";

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState("chat");

  const demos = [
    {
      id: "chat",
      title: "محادثة تجريبية",
      icon: MessageSquare,
      description: "جرب المحادثة مع المساعد الذكي"
    },
    {
      id: "ai",
      title: "الذكاء الاصطناعي",
      icon: Bot,
      description: "اكتشف قدرات الذكاء الاصطناعي"
    },
    {
      id: "users",
      title: "إدارة المستخدمين",
      icon: Users,
      description: "شاهد كيفية إدارة المستخدمين"
    },
    {
      id: "settings",
      title: "الإعدادات",
      icon: Settings,
      description: "تعرف على خيارات النظام"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="مركز الهمم"
                width={32}
                height={32}
                className="mr-3"
              />
              <h1 className="text-xl font-bold text-gray-900">نظام مُعين - تجريبي</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                وضع تجريبي
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            مرحباً بك في النظام التجريبي
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            استكشف ميزات نظام مُعين الذكي لمركز الهمم. جرب المحادثات، الذكاء الاصطناعي، وإدارة المستخدمين.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <div
                key={demo.id}
                className={`p-6 bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all duration-200 ${
                  activeDemo === demo.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                }`}
                onClick={() => setActiveDemo(demo.id)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${
                    activeDemo === demo.id ? "bg-emerald-500" : "bg-gray-100"
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      activeDemo === demo.id ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    {demo.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {demo.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Demo Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {activeDemo === "chat" && (
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                محادثة تجريبية
              </h3>
              <p className="text-gray-600 mb-6">
                جرب المحادثة مع المساعد الذكي لمركز الهمم
              </p>
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-right">
                  <div className="bg-emerald-500 text-white p-3 rounded-lg mb-3 inline-block">
                    مرحباً! أنا مُعين، المساعد الذكي لمركز الهمم. كيف يمكنني مساعدتك اليوم؟
                  </div>
                  <div className="bg-white border p-3 rounded-lg inline-block">
                    أريد معرفة المزيد عن خدمات المركز
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === "ai" && (
            <div className="text-center">
              <Bot className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                الذكاء الاصطناعي
              </h3>
              <p className="text-gray-600 mb-6">
                اكتشف قدرات الذكاء الاصطناعي المتقدمة
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">تحليل النصوص</h4>
                  <p className="text-blue-700 text-sm">فهم وتحليل النصوص الطبية</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">الترجمة</h4>
                  <p className="text-green-700 text-sm">ترجمة فورية للغات متعددة</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">التوصيات</h4>
                  <p className="text-purple-700 text-sm">توصيات ذكية مخصصة</p>
                </div>
              </div>
            </div>
          )}

          {activeDemo === "users" && (
            <div className="text-center">
              <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                إدارة المستخدمين
              </h3>
              <p className="text-gray-600 mb-6">
                شاهد كيفية إدارة المستخدمين والأدوار
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">الأدوار</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">مدير</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">طبيب</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">موظف</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">25</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">الإحصائيات</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">إجمالي المستخدمين</span>
                      <span className="font-semibold">40</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">نشط اليوم</span>
                      <span className="font-semibold text-green-600">28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">جديد هذا الأسبوع</span>
                      <span className="font-semibold text-blue-600">5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === "settings" && (
            <div className="text-center">
              <Settings className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                الإعدادات
              </h3>
              <p className="text-gray-600 mb-6">
                تعرف على خيارات النظام والإعدادات المتاحة
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">إعدادات النظام</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">اللغة</span>
                      <span className="text-gray-900">العربية</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">المنطقة الزمنية</span>
                      <span className="text-gray-900">GMT+3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">الإشعارات</span>
                      <span className="text-green-600">مفعلة</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">الأمان</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">المصادقة</span>
                      <span className="text-green-600">مفعلة</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">التشفير</span>
                      <span className="text-green-600">AES-256</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">النسخ الاحتياطي</span>
                      <span className="text-green-600">يومي</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = "/login"}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
          >
            تسجيل الدخول الكامل
          </button>
        </div>
      </main>
    </div>
  );
}
