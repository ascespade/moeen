"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Brain,
  MessageSquare,
  Calendar,
  Users,
  Shield,
  Heart,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Target,
  BookOpen,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function ProjectDocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "نظرة عامة", icon: BookOpen },
    { id: "ai-assistant", title: "المساعد الذكي", icon: Brain },
    { id: "conversation-flows", title: "مسارات المحادثة", icon: MessageSquare },
    { id: "integration", title: "التكاملات التقنية", icon: Zap },
    { id: "implementation", title: "خطة التنفيذ", icon: Target },
    { id: "benefits", title: "الفوائد المتوقعة", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b-4 border-orange-500 bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  نظام المساعد الذكي
                </h1>
                <p className="text-lg text-gray-600">
                  مركز الهمم - الحلول الرقمية المتكاملة
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">مشروع تطوير شامل</p>
              <p className="text-sm font-medium text-orange-600">2024</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-8 rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
            <nav className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                أقسام المشروع
              </h3>
              <ul className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`flex w-full items-center space-x-3 space-x-reverse rounded-lg p-3 transition-all ${
                          activeSection === section.id
                            ? "border-r-4 border-orange-500 bg-orange-100 text-orange-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                            ? "bg-orange-100 text-orange-700 border-r-4 border-orange-500"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {section.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
              {/* Overview Section */}
              {activeSection === "overview" && (
                <div className="p-8">
                  <div className="mb-8 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900">
                      نظام المساعد الذكي "مُعين"
                    </h2>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      نظام المساعد الذكي "مُعين"
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      نظام متكامل للدعم الرقمي في مركز الهمم، مصمم لتقديم رعاية
                      شخصية ومتطورة للمستفيدين وأسرهم والفريق الطبي
                    </p>
                  </div>

                  <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                      <div className="mb-4 flex items-center">
                        <Heart className="mr-3 h-8 w-8 text-blue-600" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <Heart className="w-8 h-8 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          الرؤية
                        </h3>
                      </div>
                      <p className="text-gray-700">
                        أن يكون المساعد الرقمي نقطة الاتصال الأولى والأكثر
                        موثوقية لمجتمع مركز الهمم، حيث يقدم دعمًا إداريًا
                        ونفسيًا أوليًا، ويسهل رحلة المستفيد من الاستفسار الأول
                        وحتى تلقي الرعاية.
                      </p>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-6">
                      <div className="mb-4 flex items-center">
                        <Target className="mr-3 h-8 w-8 text-orange-600" />
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                      <div className="flex items-center mb-4">
                        <Target className="w-8 h-8 text-orange-600 mr-3" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          الهدف
                        </h3>
                      </div>
                      <p className="text-gray-700">
                        تحسين كفاءة وتنسيق عمل الفريق الطبي، وتقديم دعم مستمر
                        ومطمئن لكل من يحتاجه، مع ضمان السرية والخصوصية المطلقة
                        في جميع التفاعلات.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      المبادئ الأساسية
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      المبادئ الأساسية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                          <Heart className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          التعاطف أولاً
                        </h4>
                        <p className="text-sm text-gray-600">
                          الردود المُصممة للراحة والطمأنينة
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                          <Shield className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          السرية المطلقة
                        </h4>
                        <p className="text-sm text-gray-600">
                          تشفير البيانات وعدم المشاركة
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                          <CheckCircle className="h-8 w-8 text-orange-600" />
                        </div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          الوضوح
                        </h4>
                        <p className="text-sm text-gray-600">
                          تجنب التشخيص والوضوح في الأدوار
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Assistant Section */}
              {activeSection === "ai-assistant" && (
                <div className="p-8">
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">
                    المساعد الذكي "مُعين"
                  </h2>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-xl font-semibold text-gray-900">
                        الشخصية والهوية
                      </h3>
                      <div className="space-y-4">
                        <div className="rounded-lg bg-blue-50 p-4">
                          <h4 className="mb-2 font-semibold text-blue-900">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    المساعد الذكي "مُعين"
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        الشخصية والهوية
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">
                            الاسم والشخصية
                          </h4>
                          <p className="text-gray-700">
                            "مُعين" - مساند رقمي متعاطف، نبرة هادئة ومطمئنة
                            وواضحة وصبورة
                          </p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4">
                          <h4 className="mb-2 font-semibold text-green-900">
                            القدرات
                          </h4>
                          <ul className="space-y-1 text-gray-700">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">
                            القدرات
                          </h4>
                          <ul className="text-gray-700 space-y-1">
                            <li>• إدارة المواعيد والتنسيق</li>
                            <li>• توفير المعلومات العامة</li>
                            <li>• التواصل مع الفريق الطبي</li>
                            <li>• الدعم النفسي الأولي</li>
                            <li>• تنسيق الخدمات</li>
                          </ul>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-4">
                          <h4 className="mb-2 font-semibold text-orange-900">
                            الحدود
                          </h4>
                          <ul className="space-y-1 text-gray-700">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-orange-900 mb-2">
                            الحدود
                          </h4>
                          <ul className="text-gray-700 space-y-1">
                            <li>• لا يمكنه التشخيص الطبي</li>
                            <li>• لا يقدم نصائح طبية متخصصة</li>
                            <li>• يحتاج لتحويل الحالات الطارئة</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-xl font-semibold text-gray-900">
                        نظام الأزمات
                      </h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-red-500 bg-red-50 p-4">
                          <h4 className="mb-2 font-semibold text-red-900">
                            رصد كلمات الخطر
                          </h4>
                          <p className="text-sm text-gray-700">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        نظام الأزمات
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                          <h4 className="font-semibold text-red-900 mb-2">
                            رصد كلمات الخطر
                          </h4>
                          <p className="text-gray-700 text-sm">
                            تدريب النموذج على رصد العبارات التي تدل على وجود خطر
                            مباشر
                          </p>
                        </div>
                        <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
                          <h4 className="mb-2 font-semibold text-yellow-900">
                            الإجراء الفوري
                          </h4>
                          <p className="text-sm text-gray-700">
                            عرض معلومات الطوارئ وإشعار فوري للفريق المختص
                          </p>
                        </div>
                        <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                          <h4 className="mb-2 font-semibold text-blue-900">
                            أرقام الطوارئ
                          </h4>
                          <p className="text-sm text-gray-700">
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                          <h4 className="font-semibold text-yellow-900 mb-2">
                            الإجراء الفوري
                          </h4>
                          <p className="text-gray-700 text-sm">
                            عرض معلومات الطوارئ وإشعار فوري للفريق المختص
                          </p>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">
                            أرقام الطوارئ
                          </h4>
                          <p className="text-gray-700 text-sm">
                            997 (الطوارئ العامة) - 911 (الإسعاف) - مركز الهمم:
                            +966501234567
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-orange-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      نظام الاستجابة التعاطفية
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          عبارات البداية المطمئنة
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                  <div className="mt-8 bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      نظام الاستجابة التعاطفية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          عبارات البداية المطمئنة
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• "نحن هنا لمساعدتك"</li>
                          <li>• "أتفهم تماماً ما تمر به"</li>
                          <li>• "شكراً لمشاركتنا، معاً سنجد الدعم المناسب"</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          اللغة الإيجابية
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          اللغة الإيجابية
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• استخدام "تحدي" بدلاً من "مشكلة"</li>
                          <li>• "حالة" بدلاً من "إعاقة"</li>
                          <li>• "احتياج خاص" بدلاً من "إعاقة"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation Flows Section */}
              {activeSection === "conversation-flows" && (
                <div className="p-8">
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    مسارات المحادثة الذكية
                  </h2>

                  <div className="space-y-8">
                    {/* New Beneficiary Flow */}
                    <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Users className="mr-2 h-6 w-6 text-blue-600" />
                        مسار المستفيد الجديد
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            الهدف
                          </h4>
                          <p className="text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            الهدف
                          </h4>
                          <p className="text-gray-700 text-sm">
                            تسهيل عملية الانضمام وجمع المعلومات الأولية بدقة
                            وحساسية
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            الخطوات
                          </h4>
                          <ol className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            الخطوات
                          </h4>
                          <ol className="text-gray-700 text-sm space-y-1">
                            <li>1. الترحيب والتعريف</li>
                            <li>2. فهم الاحتياج (بدون تشخيص)</li>
                            <li>3. جمع المعلومات الأولية</li>
                            <li>4. التوجيه الذكي</li>
                            <li>5. إنشاء ملف مبدئي</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Management Flow */}
                    <div className="rounded-xl bg-gradient-to-r from-green-50 to-green-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Calendar className="mr-2 h-6 w-6 text-green-600" />
                        مسار إدارة المواعيد
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            الهدف
                          </h4>
                          <p className="text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            الهدف
                          </h4>
                          <p className="text-gray-700 text-sm">
                            أتمتة كاملة لعملية الجدولة وتقليل العبء الإداري عن
                            الأطباء
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            المميزات
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            المميزات
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• حجز موعد ذكي</li>
                            <li>• التنسيق مع جدول الطبيب</li>
                            <li>• إرسال ملف تحضير الجلسة</li>
                            <li>• تذكير وإعادة تأكيد ذكي</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Continuous Support Flow */}
                    <div className="rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Heart className="mr-2 h-6 w-6 text-orange-600" />
                        مسار الدعم المستمر
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            الهدف
                          </h4>
                          <p className="text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            الهدف
                          </h4>
                          <p className="text-gray-700 text-sm">
                            جعل المساعد أداة تواصل موثوقة بين الجلسات
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            الخدمات
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            الخدمات
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• إرسال مواد داعمة</li>
                            <li>• تلقي التحديثات من المستفيد</li>
                            <li>• الاستعلام عن الخدمات والفعاليات</li>
                            <li>• التنسيق مع الفريق الطبي</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integration Section */}
              {activeSection === "integration" && (
                <div className="p-8">
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">
                    التكاملات التقنية المتقدمة
                  </h2>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    التكاملات التقنية المتقدمة
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* EHR/CRM System */}
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Shield className="mr-2 h-6 w-6 text-blue-600" />
                        نظام السجلات الطبية الإلكترونية
                      </h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            إدارة المرضى
                          </h4>
                          <p className="text-sm text-gray-700">
                            إنشاء وتحديث ملفات المستفيدين بشكل آمن
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            تتبع الجلسات
                          </h4>
                          <p className="text-sm text-gray-700">
                            تسجيل ومتابعة جميع الجلسات والتمارين
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            دعم الأسرة
                          </h4>
                          <p className="text-sm text-gray-700">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            إدارة المرضى
                          </h4>
                          <p className="text-gray-700 text-sm">
                            إنشاء وتحديث ملفات المستفيدين بشكل آمن
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            تتبع الجلسات
                          </h4>
                          <p className="text-gray-700 text-sm">
                            تسجيل ومتابعة جميع الجلسات والتمارين
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            دعم الأسرة
                          </h4>
                          <p className="text-gray-700 text-sm">
                            إدارة معلومات أفراد الأسرة والإشعارات
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Calendar API */}
                    <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Calendar className="mr-2 h-6 w-6 text-green-600" />
                        واجهة برمجة تطبيقات التقويم
                      </h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            إدارة الجداول
                          </h4>
                          <p className="text-sm text-gray-700">
                            إدارة جداول الأطباء المعقدة والمواعيد المتكررة
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            الحجز الذكي
                          </h4>
                          <p className="text-sm text-gray-700">
                            عرض المواعيد المتاحة والتنسيق التلقائي
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            الإشعارات
                          </h4>
                          <p className="text-sm text-gray-700">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            إدارة الجداول
                          </h4>
                          <p className="text-gray-700 text-sm">
                            إدارة جداول الأطباء المعقدة والمواعيد المتكررة
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            الحجز الذكي
                          </h4>
                          <p className="text-gray-700 text-sm">
                            عرض المواعيد المتاحة والتنسيق التلقائي
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            الإشعارات
                          </h4>
                          <p className="text-gray-700 text-sm">
                            تذكيرات تلقائية وإعادة تأكيد المواعيد
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Communication Automation */}
                    <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <MessageSquare className="mr-2 h-6 w-6 text-orange-600" />
                        منصة أتمتة التسويق والتواصل
                      </h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            الرسائل المجدولة
                          </h4>
                          <p className="text-sm text-gray-700">
                            إرسال رسائل ومواد مخصصة بشكل مجدول
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            الرسائل التحفيزية
                          </h4>
                          <p className="text-sm text-gray-700">
                            رسائل تشجيعية دورية ومخصصة
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            إشعارات الأسرة
                          </h4>
                          <p className="text-sm text-gray-700">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            الرسائل المجدولة
                          </h4>
                          <p className="text-gray-700 text-sm">
                            إرسال رسائل ومواد مخصصة بشكل مجدول
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            الرسائل التحفيزية
                          </h4>
                          <p className="text-gray-700 text-sm">
                            رسائل تشجيعية دورية ومخصصة
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            إشعارات الأسرة
                          </h4>
                          <p className="text-gray-700 text-sm">
                            تحديثات غير طبية لأفراد الأسرة
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Doctors Dashboard */}
                    <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Users className="mr-2 h-6 w-6 text-purple-600" />
                        لوحة تحكم الطاقم الطبي
                      </h3>
                      <div className="space-y-3">
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            إدارة المواعيد
                          </h4>
                          <p className="text-sm text-gray-700">
                            تحديث المواعيد المتاحة وإدارة الجدول
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            قوالب الرسائل
                          </h4>
                          <p className="text-sm text-gray-700">
                            إعداد قوالب رسائل ومواد للشات بوت
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <h4 className="mb-1 font-semibold text-gray-900">
                            مراجعة المحادثات
                          </h4>
                          <p className="text-sm text-gray-700">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            إدارة المواعيد
                          </h4>
                          <p className="text-gray-700 text-sm">
                            تحديث المواعيد المتاحة وإدارة الجدول
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            قوالب الرسائل
                          </h4>
                          <p className="text-gray-700 text-sm">
                            إعداد قوالب رسائل ومواد للشات بوت
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            مراجعة المحادثات
                          </h4>
                          <p className="text-gray-700 text-sm">
                            مراجعة سجلات محادثات المستفيدين
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Implementation Section */}
              {activeSection === "implementation" && (
                <div className="p-8">
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    خطة التنفيذ والجدول الزمني
                  </h2>

                  <div className="space-y-8">
                    {/* Phase 1 */}
                    <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Clock className="mr-2 h-6 w-6 text-blue-600" />
                        المرحلة الأولى (4-6 أسابيع)
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            التطوير الأساسي
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            التطوير الأساسي
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• تطوير نظام المساعد الذكي الأساسي</li>
                            <li>• إنشاء مسارات المحادثة الأساسية</li>
                            <li>• تطوير نظام الأزمات والطوارئ</li>
                            <li>• تكامل واتساب الأساسي</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            الاختبار الأولي
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            الاختبار الأولي
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• اختبار المسارات الأساسية</li>
                            <li>• اختبار نظام الأزمات</li>
                            <li>• اختبار التكامل مع واتساب</li>
                            <li>• جمع الملاحظات الأولية</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="rounded-xl bg-gradient-to-r from-green-50 to-green-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Calendar className="mr-2 h-6 w-6 text-green-600" />
                        المرحلة الثانية (6-8 أسابيع)
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            التكاملات المتقدمة
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            التكاملات المتقدمة
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• تطوير نظام السجلات الطبية</li>
                            <li>• تطوير واجهة التقويم المتقدمة</li>
                            <li>• تطوير نظام أتمتة التواصل</li>
                            <li>• تطوير لوحة تحكم الأطباء</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            التحسينات
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            التحسينات
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• تحسين الذكاء الاصطناعي</li>
                            <li>• إضافة المزيد من المسارات</li>
                            <li>• تحسين واجهة المستخدم</li>
                            <li>• اختبارات شاملة</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Zap className="mr-2 h-6 w-6 text-orange-600" />
                        المرحلة الثالثة (4-6 أسابيع)
                      </h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            التحسينات المتقدمة
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            التحسينات المتقدمة
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• تطوير الميزات المتقدمة</li>
                            <li>• تحسين الأداء والأمان</li>
                            <li>• إضافة المزيد من التكاملات</li>
                            <li>• تطوير التقارير والتحليلات</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            النشر والتدريب
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            النشر والتدريب
                          </h4>
                          <ul className="text-gray-700 text-sm space-y-1">
                            <li>• النشر في البيئة الإنتاجية</li>
                            <li>• تدريب الفريق الطبي</li>
                            <li>• تدريب المستفيدين</li>
                            <li>• المتابعة والدعم</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      الاحتياجات التقنية
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-white p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">
                          البنية التحتية
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                  <div className="mt-8 bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      الاحتياجات التقنية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          البنية التحتية
                        </h4>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li>• خادم سحابي آمن</li>
                          <li>• قاعدة بيانات محمية</li>
                          <li>• نظام النسخ الاحتياطي</li>
                        </ul>
                      </div>
                      <div className="rounded-lg bg-white p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">
                          التطوير
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          التطوير
                        </h4>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li>• فريق تطوير متخصص</li>
                          <li>• خبراء الذكاء الاصطناعي</li>
                          <li>• خبراء الأمان السيبراني</li>
                        </ul>
                      </div>
                      <div className="rounded-lg bg-white p-4">
                        <h4 className="mb-2 font-semibold text-gray-900">
                          الدعم
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          الدعم
                        </h4>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li>• فريق دعم فني</li>
                          <li>• تدريب مستمر</li>
                          <li>• صيانة دورية</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              {activeSection === "benefits" && (
                <div className="p-8">
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">
                    الفوائد المتوقعة والأهمية
                  </h2>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    الفوائد المتوقعة والأهمية
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Benefits for Patients */}
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Heart className="mr-2 h-6 w-6 text-blue-600" />
                        للمستفيدين وأسرهم
                      </h3>
                      <div className="space-y-4">
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            تحسين تجربة الرعاية
                          </h4>
                          <p className="text-sm text-gray-700">
                            دعم مستمر ومتاح 24/7، مع استجابة فورية للاستفسارات
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            سهولة الوصول للخدمات
                          </h4>
                          <p className="text-sm text-gray-700">
                            حجز المواعيد وإدارة الجدول بسهولة من خلال واتساب
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            الدعم النفسي
                          </h4>
                          <p className="text-sm text-gray-700">
                            رسائل تحفيزية ودعم نفسي أولي متاح في أي وقت
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            مشاركة الأسرة
                          </h4>
                          <p className="text-sm text-gray-700">
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            تحسين تجربة الرعاية
                          </h4>
                          <p className="text-gray-700 text-sm">
                            دعم مستمر ومتاح 24/7، مع استجابة فورية للاستفسارات
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            سهولة الوصول للخدمات
                          </h4>
                          <p className="text-gray-700 text-sm">
                            حجز المواعيد وإدارة الجدول بسهولة من خلال واتساب
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            الدعم النفسي
                          </h4>
                          <p className="text-gray-700 text-sm">
                            رسائل تحفيزية ودعم نفسي أولي متاح في أي وقت
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            مشاركة الأسرة
                          </h4>
                          <p className="text-gray-700 text-sm">
                            إشراك أفراد الأسرة في رحلة الرعاية بشكل منظم
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Benefits for Medical Team */}
                    <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6">
                      <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                        <Users className="mr-2 h-6 w-6 text-green-600" />
                        للفريق الطبي
                      </h3>
                      <div className="space-y-4">
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            تحسين الكفاءة
                          </h4>
                          <p className="text-sm text-gray-700">
                            تقليل العبء الإداري والتركيز على الرعاية الطبية
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            إدارة أفضل للمواعيد
                          </h4>
                          <p className="text-sm text-gray-700">
                            أتمتة كاملة لعملية الجدولة والتنسيق
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            معلومات شاملة
                          </h4>
                          <p className="text-sm text-gray-700">
                            ملفات تحضير الجلسات والتحديثات التلقائية
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-4">
                          <h4 className="mb-2 font-semibold text-gray-900">
                            التواصل المحسن
                          </h4>
                          <p className="text-sm text-gray-700">
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            تحسين الكفاءة
                          </h4>
                          <p className="text-gray-700 text-sm">
                            تقليل العبء الإداري والتركيز على الرعاية الطبية
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            إدارة أفضل للمواعيد
                          </h4>
                          <p className="text-gray-700 text-sm">
                            أتمتة كاملة لعملية الجدولة والتنسيق
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            معلومات شاملة
                          </h4>
                          <p className="text-gray-700 text-sm">
                            ملفات تحضير الجلسات والتحديثات التلقائية
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            التواصل المحسن
                          </h4>
                          <p className="text-gray-700 text-sm">
                            قنوات تواصل فعالة مع المستفيدين وأسرهم
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      الأهمية الاستراتيجية
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      الأهمية الاستراتيجية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                          <Target className="h-8 w-8 text-orange-600" />
                        </div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          التميز التنافسي
                        </h4>
                        <p className="text-sm text-gray-700">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          التميز التنافسي
                        </h4>
                        <p className="text-gray-700 text-sm">
                          تطوير تقني متقدم يضع مركز الهمم في المقدمة
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                          <Heart className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          تحسين جودة الرعاية
                        </h4>
                        <p className="text-sm text-gray-700">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          تحسين جودة الرعاية
                        </h4>
                        <p className="text-gray-700 text-sm">
                          دعم مستمر ومتاح يرفع مستوى الخدمة
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                          <Zap className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="mb-2 font-semibold text-gray-900">
                          الابتكار التقني
                        </h4>
                        <p className="text-sm text-gray-700">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          الابتكار التقني
                        </h4>
                        <p className="text-gray-700 text-sm">
                          استخدام أحدث التقنيات في مجال الرعاية الصحية
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-gray-900 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">مركز الهمم</h3>
              <p className="text-sm text-gray-300">
              <h3 className="text-lg font-semibold mb-4">مركز الهمم</h3>
              <p className="text-gray-300 text-sm">
                مركز متخصص في رعاية ذوي الاحتياجات الخاصة، يقدم خدمات شاملة
                ومتطورة لتحسين جودة الحياة.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">معلومات التواصل</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>جدة، حي الصفا، شارع الأمير محمد بن عبدالعزيز</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>0126173693</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>info@alhemam.sa</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">المشروع</h3>
              <p className="text-sm text-gray-300">
              <h3 className="text-lg font-semibold mb-4">المشروع</h3>
              <p className="text-gray-300 text-sm">
                نظام المساعد الذكي "مُعين" - تطوير شامل لتقديم رعاية رقمية
                متطورة ومتاحة للجميع.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 مركز الهمم - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
