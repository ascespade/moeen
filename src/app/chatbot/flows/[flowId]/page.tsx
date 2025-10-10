"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface Node {
  id: string;
  type: "start" | "message" | "condition" | "action" | "end";
  position: { x: number; y: number };
  data: {
    label: string;
    content?: string;
    condition?: string;
    action?: string;
  };
}

interface Connection {
  id: string;
  source: string;
  target: string;
}

const mockFlow = {
  id: "1",
  name: "استقبال المرضى",
  description: "تدفق ترحيب واستقبال المرضى الجدد",
  status: "published",
  nodes: [
    {
      id: "start",
      type: "start",
      position: { x: 100, y: 100 },
      data: { label: "بداية المحادثة" }
    },
    {
      id: "welcome",
      type: "message",
      position: { x: 300, y: 100 },
      data: {
        label: "رسالة ترحيب",
        content: "مرحباً بك في مركز الهمم للرعاية الصحية المتخصصة! كيف يمكنني مساعدتك اليوم؟"
      }
    },
    {
      id: "menu",
      type: "message",
      position: { x: 500, y: 100 },
      data: {
        label: "قائمة الخيارات",
        content: "يرجى اختيار إحدى الخدمات التالية:\n1️⃣ حجز موعد\n2️⃣ استفسار عن الخدمات\n3️⃣ التواصل معنا\n4️⃣ معلومات الاتصال"
      }
    },
    {
      id: "condition1",
      type: "condition",
      position: { x: 700, y: 50 },
      data: {
        label: "هل يريد حجز موعد؟",
        condition: "user_input == '1'"
      }
    },
    {
      id: "appointment",
      type: "action",
      position: { x: 900, y: 50 },
      data: {
        label: "حجز موعد",
        action: "redirect_to_appointment"
      }
    },
    {
      id: "services",
      type: "message",
      position: { x: 700, y: 200 },
      data: {
        label: "معلومات الخدمات",
        content: "نقدم خدمات متخصصة في:\n• العلاج الطبيعي\n• العلاج النفسي\n• العلاج الوظيفي\n• الاستشارات الطبية"
      }
    },
    {
      id: "end",
      type: "end",
      position: { x: 1100, y: 100 },
      data: { label: "نهاية المحادثة" }
    }
  ] as Node[],
  connections: [
    { id: "c1", source: "start", target: "welcome" },
    { id: "c2", source: "welcome", target: "menu" },
    { id: "c3", source: "menu", target: "condition1" },
    { id: "c4", source: "condition1", target: "appointment" },
    { id: "c5", source: "condition1", target: "services" },
    { id: "c6", source: "appointment", target: "end" },
    { id: "c7", source: "services", target: "end" }
  ] as Connection[]
};

export default function FlowBuilderPage({ params }: { params: { flowId: string } }) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const getNodeColor = (type: Node["type"]) => {
    switch (type) {
      case "start":
        return "bg-green-500";
      case "message":
        return "bg-blue-500";
      case "condition":
        return "bg-yellow-500";
      case "action":
        return "bg-purple-500";
      case "end":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getNodeIcon = (type: Node["type"]) => {
    switch (type) {
      case "start":
        return "▶️";
      case "message":
        return "💬";
      case "condition":
        return "❓";
      case "action":
        return "⚡";
      case "end":
        return "🏁";
      default:
        return "🔹";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES.CHATBOT.FLOWS}
                className="text-gray-400 hover:text-gray-600"
              >
                ← العودة
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mockFlow.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  محرر التدفق - {mockFlow.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTestModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                اختبار
              </button>
              <button
                onClick={() => setShowPublishModal(true)}
                className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                نشر التدفق
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ccc" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Nodes */}
            <div className="relative z-10">
              {mockFlow.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute w-48 p-4 rounded-lg shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                    selectedNode?.id === node.id ? "ring-2 ring-[var(--brand-primary)]" : ""
                  }`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    backgroundColor: selectedNode?.id === node.id ? "white" : "white"
                  }}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getNodeIcon(node.type)}</span>
                    <span className="font-semibold text-sm">{node.data.label}</span>
                  </div>
                  {node.data.content && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
                      {node.data.content}
                    </p>
                  )}
                  {node.data.condition && (
                    <p className="text-xs text-yellow-600 font-mono">
                      {node.data.condition}
                    </p>
                  )}
                  {node.data.action && (
                    <p className="text-xs text-purple-600 font-mono">
                      {node.data.action}
                    </p>
                  )}
                </div>
              ))}

              {/* Connections */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
                {mockFlow.connections.map((connection) => {
                  const sourceNode = mockFlow.nodes.find(n => n.id === connection.source);
                  const targetNode = mockFlow.nodes.find(n => n.id === connection.target);
                  
                  if (!sourceNode || !targetNode) return null;

                  const startX = sourceNode.position.x + 96; // Center of node
                  const startY = sourceNode.position.y + 40;
                  const endX = targetNode.position.x + 96;
                  const endY = targetNode.position.y + 40;

                  return (
                    <g key={connection.id}>
                      <path
                        d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${startY - 50} ${endX} ${endY}`}
                        stroke="#6b7280"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                    </g>
                  );
                })}
                
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6b7280"
                    />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>

          {/* Mini Map */}
          <div className="absolute bottom-4 right-4 w-48 h-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
              خريطة التدفق
            </div>
            <div className="relative w-full h-24 bg-gray-50 dark:bg-gray-700 rounded">
              {mockFlow.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute w-2 h-2 rounded-full ${getNodeColor(node.type)}`}
                  style={{
                    left: `${(node.position.x / 1200) * 100}%`,
                    top: `${(node.position.y / 600) * 100}%`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {selectedNode && (
          <div className="w-80 bg-white dark:bg-gray-900 border-l border-brand p-6">
            <h3 className="text-lg font-semibold mb-4">تحرير العقدة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نوع العقدة
                </label>
                <select
                  value={selectedNode.type}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                >
                  <option value="start">بداية</option>
                  <option value="message">رسالة</option>
                  <option value="condition">شرط</option>
                  <option value="action">إجراء</option>
                  <option value="end">نهاية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  التسمية
                </label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                />
              </div>

              {selectedNode.type === "message" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    محتوى الرسالة
                  </label>
                  <textarea
                    rows={4}
                    value={selectedNode.data.content || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    placeholder="أدخل نص الرسالة..."
                  />
                </div>
              )}

              {selectedNode.type === "condition" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الشرط
                  </label>
                  <input
                    type="text"
                    value={selectedNode.data.condition || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    placeholder="user_input == '1'"
                  />
                </div>
              )}

              {selectedNode.type === "action" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الإجراء
                  </label>
                  <select
                    value={selectedNode.data.action || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  >
                    <option value="">اختر إجراء</option>
                    <option value="redirect_to_appointment">حجز موعد</option>
                    <option value="redirect_to_services">عرض الخدمات</option>
                    <option value="redirect_to_contact">معلومات الاتصال</option>
                    <option value="end_conversation">إنهاء المحادثة</option>
                  </select>
                </div>
              )}

              <div className="pt-4">
                <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">نشر التدفق</h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                هل أنت متأكد من نشر هذا التدفق؟ سيصبح متاحاً للاستخدام فوراً.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ تأكد من اختبار التدفق قبل النشر للتأكد من عمله بشكل صحيح.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
                >
                  نشر التدفق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">اختبار التدفق</h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-[var(--brand-primary)] text-white rounded-lg p-3 max-w-xs">
                      مرحباً، أريد حجز موعد
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                      مرحباً بك في مركز الهمم للرعاية الصحية المتخصصة! كيف يمكنني مساعدتك اليوم؟
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                      يرجى اختيار إحدى الخدمات التالية:
                      1️⃣ حجز موعد
                      2️⃣ استفسار عن الخدمات
                      3️⃣ التواصل معنا
                      4️⃣ معلومات الاتصال
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[var(--brand-primary)] text-white rounded-lg p-3 max-w-xs">
                      1
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                      تم توجيهك إلى صفحة حجز المواعيد...
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب رسالة للاختبار..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                />
                <button className="btn-brand px-4 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
                  إرسال
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
                <button className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
                  إعادة تشغيل الاختبار
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}