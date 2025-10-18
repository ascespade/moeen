import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants/routes";

"use client";

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

interface Connection {
  id: string;
  source: string;
  target: string;

const mockFlow = {
  id: "1",
  name: "استقبال المرضى",
  description: "تدفق ترحيب واستقبال المرضى الجدد",
  status: "published",
  nodes: [
      id: "start",
      type: "start",
      position: { x: 100, y: 100 },
      data: { label: "بداية المحادثة" },
    },
      id: "welcome",
      type: "message",
      position: { x: 300, y: 100 },
      data: {
        label: "رسالة ترحيب",
        content:
          "مرحباً بك في مركز الهمم للرعاية الصحية المتخصصة! كيف يمكنني مساعدتك اليوم؟",
      },
    },
      id: "menu",
      type: "message",
      position: { x: 500, y: 100 },
      data: {
        label: "قائمة الخيارات",
        content:
          "يرجى اختيار إحدى الخدمات التالية:\n1️⃣ حجز موعد\n2️⃣ استفسار عن الخدمات\n3️⃣ التواصل معنا\n4️⃣ معلومات الاتصال",
      },
    },
      id: "condition1",
      type: "condition",
      position: { x: 700, y: 50 },
      data: {
        label: "هل يريد حجز موعد؟",
        condition: "user_input == '1'",
      },
    },
      id: "appointment",
      type: "action",
      position: { x: 900, y: 50 },
      data: {
        label: "حجز موعد",
        action: "redirect_to_appointment",
      },
    },
      id: "services",
      type: "message",
      position: { x: 700, y: 200 },
      data: {
        label: "معلومات الخدمات",
        content:
          "نقدم خدمات متخصصة في:\n• العلاج الطبيعي\n• العلاج النفسي\n• العلاج الوظيفي\n• الاستشارات الطبية",
      },
    },
      id: "end",
      type: "end",
      position: { x: 1100, y: 100 },
      data: { label: "نهاية المحادثة" },
    },
  ] as Node[],
  connections: [
    { id: "c1", source: "start", target: "welcome" },
    { id: "c2", source: "welcome", target: "menu" },
    { id: "c3", source: "menu", target: "condition1" },
    { id: "c4", source: "condition1", target: "appointment" },
    { id: "c5", source: "condition1", target: "services" },
    { id: "c6", source: "appointment", target: "end" },
    { id: "c7", source: "services", target: "end" },
  ] as Connection[],
};

export default function FlowBuilderPage({
  params,
}: {
  params: { flowId: string };
}) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const getNodeColor = (type: Node["type"]) => {
    switch (type) {
      case "start":
        return "bg-brand-success";
      case "message":
        return "bg-brand-primary";
      case "condition":
        return "bg-brand-warning";
      case "action":
        return "bg-surface0";
      case "end":
        return "bg-brand-error";
      default:
        return "bg-surface0";
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
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
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
                className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
              >
                اختبار
              </button>
              <button
                onClick={() => setShowPublishModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                نشر التدفق
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Canvas */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 bg-surface dark:bg-gray-800">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="#ccc"
                      strokeWidth="1"
                    />
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
                  className={`absolute w-48 cursor-pointer rounded-lg p-4 shadow-lg transition-all hover:shadow-xl ${
                    selectedNode?.id === node.id
                      ? "ring-2 ring-[var(--brand-primary)]"
                      : ""
                  }`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    backgroundColor:
                      selectedNode?.id === node.id ? "white" : "white",
                  }}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">{getNodeIcon(node.type)}</span>
                    <span className="text-sm font-semibold">
                      {node.data.label}
                    </span>
                  </div>
                  {node.data.content && (
                    <p className="line-clamp-3 text-xs text-gray-600 dark:text-gray-300">
                      {node.data.content}
                    </p>
                  )}
                  {node.data.condition && (
                    <p className="font-mono text-xs text-yellow-600">
                      {node.data.condition}
                    </p>
                  )}
                  {node.data.action && (
                    <p className="font-mono text-xs text-purple-600">
                      {node.data.action}
                    </p>
                  )}
                </div>
              ))}

              {/* Connections */}
              <svg
                className="pointer-events-none absolute inset-0"
                style={{ zIndex: 5 }}
              >
                {mockFlow.connections.map((connection) => {
                  const sourceNode = mockFlow.nodes.find(
                    (n) => n.id === connection.source,
                  );
                  const targetNode = mockFlow.nodes.find(
                    (n) => n.id === connection.target,
                  );

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
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>

          {/* Mini Map */}
          <div className="absolute bottom-4 right-4 h-32 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
              خريطة التدفق
            </div>
            <div className="relative h-24 w-full rounded bg-surface dark:bg-gray-700">
              {mockFlow.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute h-2 w-2 rounded-full ${getNodeColor(node.type)}`}
                  style={{
                    left: `${(node.position.x / 1200) * 100}%`,
                    top: `${(node.position.y / 600) * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {selectedNode && (
          <div className="border-brand w-80 border-l bg-white p-6 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold">تحرير العقدة</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  نوع العقدة
                </label>
                <select
                  value={selectedNode.type}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                >
                  <option value="start">بداية</option>
                  <option value="message">رسالة</option>
                  <option value="condition">شرط</option>
                  <option value="action">إجراء</option>
                  <option value="end">نهاية</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  التسمية
                </label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </div>

              {selectedNode.type === "message" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    محتوى الرسالة
                  </label>
                  <textarea
                    rows={4}
                    value={selectedNode.data.content || ""}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="أدخل نص الرسالة..."
                  />
                </div>
              )}

              {selectedNode.type === "condition" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الشرط
                  </label>
                  <input
                    type="text"
                    value={selectedNode.data.condition || ""}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="user_input == '1'"
                  />
                </div>
              )}

              {selectedNode.type === "action" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الإجراء
                  </label>
                  <select
                    value={selectedNode.data.action || ""}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
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
                <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
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

              <div className="rounded-lg border border-yellow-200 bg-surface p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ تأكد من اختبار التدفق قبل النشر للتأكد من عمله بشكل صحيح.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">اختبار التدفق</h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="h-64 overflow-y-auto rounded-lg bg-surface p-4 dark:bg-gray-800">
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-xs rounded-lg bg-[var(--brand-primary)] p-3 text-white">
                      مرحباً، أريد حجز موعد
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-xs rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
                      مرحباً بك في مركز الهمم للرعاية الصحية المتخصصة! كيف
                      يمكنني مساعدتك اليوم؟
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-xs rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
                      يرجى اختيار إحدى الخدمات التالية: 1️⃣ حجز موعد 2️⃣ استفسار
                      عن الخدمات 3️⃣ التواصل معنا 4️⃣ معلومات الاتصال
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs rounded-lg bg-[var(--brand-primary)] p-3 text-white">
                      1
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-xs rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
                      تم توجيهك إلى صفحة حجز المواعيد...
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب رسالة للاختبار..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
                <button className="btn-brand rounded-lg px-4 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                  إرسال
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
                >
                  إغلاق
                </button>
                <button className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                  إعادة تشغيل الاختبار
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
