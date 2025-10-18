"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

  Trash2,
} from "lucide-react";

interface FlowStep {
  id: string;
  type:
    | "question"
    | "information"
    | "action"
    | "redirect"
    | "slack_notify"
    | "whatsapp_send";
  content: string;
  options?: string[];
  nextStep?: string;
  slackChannel?: string;
  whatsappTemplate?: string;
  notificationType?: "appointment" | "reminder" | "emergency" | "general";

interface ConversationFlow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  entryPoints: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

}

const FlowsManagementPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [flows, setFlows] = useState<ConversationFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlow, setSelectedFlow] = useState<ConversationFlow | null>(
    null,
  );
  const [showFlowEditor, setShowFlowEditor] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadFlows();
  }, [isAuthenticated, router]);

  const loadFlows = async () => {
    try {
      setLoading(true);
      // في التطبيق الحقيقي، سيتم جلب الـ flows من API
      const mockFlows: ConversationFlow[] = [
  {
        {
    id: "new_beneficiary",
          name: "المستفيد الجديد",
          description: "تسهيل عملية الانضمام وجمع المعلومات الأولية",
          entryPoints: ["new_user", "first_time", "تقييم أولي"],
          isActive: true,
          createdAt: "2024-01-15",
          updatedAt: "2024-01-15",
          steps: [
        },
              {
              id: "welcome",
              type: "information",
              content: "أهلاً بك في مركز الهمم، أنا مُعين، مساعدك الرقمي.",
              nextStep: "needs_assessment",
            },
              {
    id: "needs_assessment",
              type: "question",
              content:
                "لفهم كيفية مساعدتك بشكل أفضل، هل يمكنك اختيار الفئة الأقرب لاحتياجك؟",
              options: [
                "دعم نفسي",
                "دعم حركي وجسدي",
                "صعوبات تعلم",
                "استشارات أسرية",
                "غير ذلك",
              ],
              nextStep: "collect_info",
            },
          ],
        },
          {
    id: "appointment_slack",
          name: "حجز المواعيد مع Slack",
          description: "نظام حجز المواعيد مع إشعارات Slack للطاقم الطبي",
          entryPoints: ["موعد", "حجز", "جدولة", "appointment"],
          isActive: true,
          createdAt: "2024-01-15",
          updatedAt: "2024-01-15",
          steps: [
        },
              {
              id: "appointment_type",
              type: "question",
              content: "هل هذا موعد جديد أم متابعة؟",
              options: ["موعد جديد", "متابعة", "إعادة جدولة"],
              nextStep: "check_schedule",
            },
              {
    id: "slack_notification",
              type: "slack_notify",
              content: "تم حجز موعد جديد",
              slackChannel: "appointments",
              notificationType: "appointment",
              nextStep: "send_confirmation",
            },
          ],
        },
          {
    id: "emergency_slack",
          name: "الطوارئ مع Slack",
          description: "نظام طوارئ متكامل مع إشعارات Slack",
          entryPoints: ["طارئ", "عاجل", "خطر", "إسعاف"],
          isActive: true,
          createdAt: "2024-01-15",
          updatedAt: "2024-01-15",
          steps: [
        },
              {
              id: "emergency_detection",
              type: "action",
              content:
                "🚨 تم اكتشاف حالة طوارئ! يرجى الاتصال فوراً بالرقم 997 أو 911.",
              nextStep: "slack_alert",
            },
              {
    id: "slack_alert",
              type: "slack_notify",
              content: "تنبيه طارئ من المريض",
              slackChannel: "emergency",
              notificationType: "emergency",
              nextStep: "emergency_contacts",
            },
          ],
        },
      ];

      setFlows(mockFlows);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFlow = async (flowId: string) => {
    try {
      // في التطبيق الحقيقي، سيتم تحديث حالة الـ flow عبر API
      setFlows((prev) =>
        prev.map((flow) =>
          flow.id === flowId ? { ...flow, isActive: !flow.isActive } : flow,
        ),
      );
    } catch (error) {}
  };

  const handleEditFlow = (flow: ConversationFlow) => {
    setSelectedFlow(flow);
    setShowFlowEditor(true);
  };

  const handleDeleteFlow = async (flowId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الـ Flow؟")) return;

    try {
      // في التطبيق الحقيقي، سيتم حذف الـ flow عبر API
      setFlows((prev) => prev.filter((flow) => flow.id !== flowId));
    } catch (error) {}
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "question":
        return <MessageCircle className="w-4 h-4 text-brand-primary" />;
      case "information":
        return <Bot className="w-4 h-4 text-brand-success" />;
      case "action":
        return <Zap className="w-4 h-4 text-brand-warning" />;
      case "slack_notify":
        return <Settings className="w-4 h-4 text-purple-500" />;
      case "whatsapp_send":
        return <MessageCircle className="w-4 h-4 text-brand-success" />;
      default:
        return <ArrowRight className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredFlows = flows.filter(
    (flow) =>
      flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isAuthenticated) {
    return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              إدارة Flows الشات بوت
            </h1>
            <p className="text-gray-600 mt-2">
              إدارة سيناريوهات المحادثة والتفاعل
            </p>
          </div>
          <Button
            onClick={() => setShowFlowEditor(true)}
            className="bg-[var(--brand-primary)] hover:brightness-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            إنشاء Flow جديد
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="البحث في الـ Flows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Flows List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      ) : filteredFlows.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد Flows
            </h3>
            <p className="text-gray-600 mb-4">ابدأ بإنشاء أول Flow للشات بوت</p>
            <Button
              onClick={() => setShowFlowEditor(true)}
              className="bg-[var(--brand-primary)] hover:brightness-95"
            >
              إنشاء Flow جديد
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFlows.map((flow) => (
            <Card key={flow.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{flow.name}</CardTitle>
                    <p className="text-sm text-gray-600 mb-3">
                      {flow.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={flow.isActive ? "primary" : "outline"}>
                        {flow.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {flow.steps.length} خطوة
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p>نقاط الدخول: {flow.entryPoints.join(", ")}</p>
                      <p>آخر تحديث: {flow.updatedAt}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFlow(flow.id)}
                      className={
                        flow.isActive
                          ? "text-brand-error"
                          : "text-brand-success"
                    >
                      {flow.isActive ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditFlow(flow)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFlow(flow.id)}
                      className="text-brand-error hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    خطوات الـ Flow:
                  </h4>
                  {flow.steps.slice(0, 3).map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-gray-500">{index + 1}.</span>
                      {getStepIcon(step.type)}
                      <span className="text-gray-700 truncate">
                        {step.content}
                      </span>
                    </div>
                  ))}
                  {flow.steps.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{flow.steps.length - 3} خطوات أخرى
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Flow Editor Modal */}
      {showFlowEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {selectedFlow ? "تعديل Flow" : "إنشاء Flow جديد"}
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setShowFlowEditor(false);
                  setSelectedFlow(null);
                }}
              >
                إغلاق
              </Button>
            </div>

            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">محرر الـ Flows قيد التطوير</p>
              <p className="text-sm text-gray-500 mt-2">
                سيتم إضافة واجهة تحرير الـ Flows في الإصدار القادم
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowsManagementPage;
