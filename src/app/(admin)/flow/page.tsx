"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Save, Eye, ArrowLeft, Edit3, Settings, Search, Plus, ZoomIn, ZoomOut, Bot, MessageSquare, Timer, SplitSquareHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useT } from "@/components/providers/I18nProvider";

type NodeType = "trigger" | "action" | "condition" | "delay" | "ai";

type FlowNode = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  label: string;
};

export default function FlowPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { t } = useT();
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: "n1", type: "trigger", x: 80, y: 120, label: "عند وصول رسالة" },
    { id: "n2", type: "condition", x: 320, y: 120, label: "إذا تحتوي على 'طلب'" },
    { id: "n3", type: "action", x: 560, y: 220, label: "إرسال تأكيد" },
  ]);
  const [zoom, setZoom] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const onNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    dragOffset.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    setDraggingId(id);
    setSelectedNodeId(id);
  };

  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - dragOffset.current.dx) / zoom;
    const y = (e.clientY - rect.top - dragOffset.current.dy) / zoom;
    setNodes((prev) => prev.map((n) => (n.id === draggingId ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n)));
  };

  const onCanvasMouseUp = () => {
    setDraggingId(null);
  };

  const templates = [
    {
      id: "welcome",
      name: "تدفق الترحيب",
      description: "ترحيب بالعملاء الجدد وتوجيههم",
      icon: "👋",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "support",
      name: "دعم العملاء",
      description: "معالجة استفسارات وطلبات الدعم",
      icon: "🛠️",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "sales",
      name: "مبيعات",
      description: "توجيه العملاء نحو الشراء",
      icon: "💰",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "feedback",
      name: "جمع التقييمات",
      description: "طلب تقييم الخدمة من العملاء",
      icon: "⭐",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const flows = [
    {
      id: 1,
      name: "ترحيب العملاء الجدد",
      status: "نشط",
      messages: 156,
      lastUsed: "منذ ساعتين",
      icon: "👋"
    },
    {
      id: 2,
      name: "دعم فني",
      status: "معلق",
      messages: 89,
      lastUsed: "منذ يوم",
      icon: "🛠️"
    },
    {
      id: 3,
      name: "استفسارات المبيعات",
      status: "نشط",
      messages: 234,
      lastUsed: "منذ 30 دقيقة",
      icon: "💰"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Intro */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/hemam-logo.jpg"
                alt="Hemam Logo"
                width={40}
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{t('nav.flow','منشئ التدفق')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('flow.subtitle','إنشاء وإدارة تدفقات المحادثة')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 transition-colors inline-flex items-center gap-2"
                style={{ color: "var(--brand-primary)" }}
              >
                <ArrowLeft className="h-4 w-4" /> العودة للوحة التحكم
              </Link>
              <Button className="px-6" variant="primary">
                <Edit3 className="h-4 w-4" /> {t('flow.new','تدفق جديد')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('flow.templates','القوالب الجاهزة')}</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-md border-2 cursor-pointer transition-all ${selectedTemplate === template.id
                      ? "border-[var(--brand-primary)] bg-[color:var(--brand-primary)]/10"
                      : "border-gray-200 dark:border-gray-800 hover:border-[var(--brand-primary)]/60"
                      }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center text-white text-xl`} style={{ background: "var(--brand-primary)" }}>
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Flow Builder */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('nav.flow','منشئ التدفق')}</h3>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="inline-flex items-center gap-2"><Eye className="h-4 w-4" /> {t('ui.preview','معاينة')}</Button>
                  <Button className="inline-flex items-center gap-2"><Save className="h-4 w-4" /> {t('ui.save','حفظ')}</Button>
                </div>
              </div>

              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-md border" style={{ background: "color-mix(in oklab, var(--brand-primary) 12%, transparent)", borderColor: "color-mix(in oklab, var(--brand_primary) 35%, transparent)" }}>
                    <h4 className="font-medium mb-2" style={{ color: "var(--brand-primary)" }}>
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {templates.find(t => t.id === selectedTemplate)?.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <span className="text-2xl">👋</span>
                        <span className="font-medium">رسالة الترحيب</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        مرحباً! كيف يمكنني مساعدتك اليوم؟
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <span className="text-2xl">🤖</span>
                        <span className="font-medium">رد تلقائي</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        سأقوم بتوجيهك للشخص المناسب...
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <span className="text-2xl">👤</span>
                        <span className="font-medium">تحويل للفريق</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        سأقوم بتوصيلك مع أحد أعضاء فريقنا...
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔄</div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    اختر قالب لبدء إنشاء التدفق
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    اختر أحد القوالب الجاهزة لتبدأ في إنشاء تدفق المحادثة الخاص بك
                  </p>
                </div>
              )}
              {/* Canvas */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Button variant="secondary" onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="inline-flex items-center gap-1"><ZoomIn className="h-4 w-4" /> تكبير</Button>
                  <Button variant="secondary" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} className="inline-flex items-center gap-1"><ZoomOut className="h-4 w-4" /> تصغير</Button>
                  <Button variant="secondary" className="inline-flex items-center gap-1"><Plus className="h-4 w-4" /> إضافة عقدة</Button>
                </div>
                <div
                  className="relative h-[420px] overflow-hidden rounded-lg border border-brand-border bg-[var(--panel)]"
                  ref={canvasRef}
                  onMouseMove={onCanvasMouseMove}
                  onMouseUp={onCanvasMouseUp}
                >
                  <svg className="absolute inset-0 w-full h-full" style={{ backgroundSize: "20px 20px", backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)" }} />
                  <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
                    {/* Connections (simple bezier mock) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path d="M 120 160 C 180 160, 220 160, 320 160" stroke="#22c55e" strokeWidth="2" fill="none" />
                      <path d="M 360 160 C 420 220, 480 240, 600 260" stroke="#22c55e" strokeWidth="2" fill="none" />
                    </svg>

                    {/* Nodes */}
                    {nodes.map((node) => (
                      <div
                        key={node.id}
                        onMouseDown={(e) => onNodeMouseDown(e, node.id)}
                        className={"absolute select-none cursor-grab active:cursor-grabbing"}
                        style={{ left: node.x, top: node.y }}
                      >
                        <div className={`rounded-lg border px-3 py-2 shadow-sm bg-white dark:bg-gray-900 ${selectedNodeId === node.id ? "ring-2 ring-[var(--focus-ring)]" : ""}`}>
                          <div className="flex items-center gap-2">
                            {node.type === "trigger" && <MessageSquare className="h-4 w-4 text-emerald-500" />}
                            {node.type === "action" && <Bot className="h-4 w-4 text-blue-500" />}
                            {node.type === "condition" && <SplitSquareHorizontal className="h-4 w-4 text-amber-500" />}
                            {node.type === "delay" && <Timer className="h-4 w-4 text-purple-500" />}
                            {node.type === "ai" && <Bot className="h-4 w-4 text-pink-500" />}
                            <span className="text-sm font-medium">{node.label}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Existing Flows */}
        <div className="mt-8">
          <Card>
            <CardContent>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">التدفقات الموجودة</h3>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button variant="secondary" className="inline-flex items-center gap-2"><Search className="h-4 w-4" /> بحث</Button>
                <Button variant="secondary" className="inline-flex items-center gap-2"><Settings className="h-4 w-4" /> إعدادات</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flows.map((flow) => (
                <div key={flow.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-md hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{flow.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{flow.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${flow.status === 'نشط'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                        {flow.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>الرسائل:</span>
                      <span className="font-medium">{flow.messages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>آخر استخدام:</span>
                      <span className="font-medium">{flow.lastUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button className="flex-1 inline-flex items-center gap-2 text-sm"><Edit3 className="h-4 w-4" /> تحرير</Button>
                    <Button variant="secondary" className="inline-flex items-center gap-2"><Settings className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
