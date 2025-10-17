import logger from '@/lib/monitoring/logger';
// Conversation Flow Management System

// Intent Analysis
export class IntentAnalyzer {
  static analyzeIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Medical intents
    if (lowerMessage.includes('appointment') || lowerMessage.includes('موعد')) {
      return 'appointment';
    }
    if (lowerMessage.includes('emergency') || lowerMessage.includes('طوارئ')) {
      return 'emergency';
    }
    if (lowerMessage.includes('prescription') || lowerMessage.includes('وصفة')) {
      return 'prescription';
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('دفع')) {
      return 'payment';
    }
    
    // General intents
    if (lowerMessage.includes('hello') || lowerMessage.includes('مرحبا')) {
      return 'greeting';
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('مساعدة')) {
      return 'help';
    }
    
    return 'general';
  }
}

// Action Executor
export class ActionExecutor {
  static async executeAction(action: string, data: any): Promise<any> {
    switch (action) {
      case 'create_appointment':
        // Implement appointment creation
        return { success: true, data: { id: Date.now() } };
      case 'send_notification':
        // Implement notification sending
        return { success: true, message: 'Notification sent' };
      case 'redirect':
        // Implement redirection
        return { success: true, redirect: data.redirect };
      default:
        return { success: false, error: 'Unknown action' };
    }
  }
}

export interface FlowStep {
  id: string;
  type: "question" | "information" | "action" | "redirect" | "slack_notify" | "whatsapp_send";
  content: string;
  options?: string[];
  nextStep?: string;
  conditions?: FlowCondition[];
  slackChannel?: string;
  whatsappTemplate?: string;
  notificationType?: 'appointment' | 'reminder' | 'emergency' | 'general';
}

export interface FlowCondition {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than";
  value: any;
  nextStep: string;
}

export interface ConversationFlow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  entryPoints: string[];
}

export class FlowManager {
  private flows: Map<string, ConversationFlow> = new Map();

  constructor() {
    this.initializeFlows();
  }

  private initializeFlows() {
    // New Beneficiary Flow
    this.flows.set("new_beneficiary", {
      id: "new_beneficiary",
      name: "المستفيد الجديد",
      description: "تسهيل عملية الانضمام وجمع المعلومات الأولية",
      entryPoints: ["new_user", "first_time", "تقييم أولي"],
      steps: [
        {
          id: "welcome",
          type: "information",
          content:
            "أهلاً بك في مركز الهمم، أنا مُعين، مساعدك الرقمي. نحن هنا لتقديم الدعم لكل فرد.",
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
        {
          id: "collect_info",
          type: "question",
          content:
            "شكراً لك. هل يمكنك مشاركة بعض المعلومات الأساسية؟ (العمر، نبذة بسيطة عن التحدي)",
          nextStep: "schedule_appointment",
        },
        {
          id: "schedule_appointment",
          type: "action",
          content:
            "بناءً على المعلومات، الخطوة المثالية هي حجز موعد تقييم أولي مع أحد المختصين لدينا. هل تود أن أبحث لك عن أقرب موعد؟",
          options: ["نعم، أحتاج موعد", "لاحقاً", "معلومات أكثر أولاً"],
          nextStep: "appointment_booking",
        },
      ],
    });

    // Appointment Management Flow
    this.flows.set("appointment_management", {
      id: "appointment_management",
      name: "إدارة المواعيد",
      description: "أتمتة كاملة لعملية الجدولة",
      entryPoints: ["موعد", "حجز", "جدولة"],
      steps: [
        {
          id: "appointment_type",
          type: "question",
          content: "هل هذا موعد جديد أم متابعة؟",
          options: ["موعد جديد", "متابعة", "إعادة جدولة"],
          nextStep: "check_schedule",
        },
        {
          id: "check_schedule",
          type: "action",
          content: "دعني أتحقق من المواعيد المتاحة...",
          nextStep: "show_availability",
        },
        {
          id: "show_availability",
          type: "information",
          content: "المواعيد المتاحة:",
          nextStep: "confirm_appointment",
        },
        {
          id: "confirm_appointment",
          type: "action",
          content: "هل تود تأكيد هذا الموعد؟",
          options: ["نعم، أؤكد", "لا، موعد آخر", "إلغاء"],
          nextStep: "send_confirmation",
        },
      ],
    });

    // Crisis Intervention Flow
    this.flows.set("crisis_intervention", {
      id: "crisis_intervention",
      name: "التدخل في الأزمات",
      description: "بروتوكول الطوارئ والأزمات",
      entryPoints: ["crisis", "emergency", "urgent"],
      steps: [
        {
          id: "crisis_detection",
          type: "action",
          content:
            "أرى أنك قد تحتاج لمساعدة عاجلة. يرجى الاتصال فوراً بالرقم 997 أو 911.",
          nextStep: "emergency_contacts",
        },
        {
          id: "emergency_contacts",
          type: "information",
          content:
            "أرقام الطوارئ: 997 (الطوارئ العامة) - 911 (الإسعاف) - مركز الهمم: +966501234567",
          nextStep: "follow_up",
        },
        {
          id: "follow_up",
          type: "action",
          content: "هل تريد مني التواصل مع فريقنا الطبي فوراً؟",
          options: ["نعم، اتصل بي", "لا، سأتصل بنفسي", "أحتاج مساعدة أخرى"],
          nextStep: "end",
        },
      ],
    });

    // Family Support Flow
    this.flows.set("family_support", {
      id: "family_support",
      name: "دعم الأسرة",
      description: "توسيع دائرة الدعم للعائلة",
      entryPoints: ["عائلة", "ولي أمر", "مقدم رعاية"],
      steps: [
        {
          id: "family_welcome",
          type: "information",
          content:
            "نحن نقدر دوركم كعائلة في رحلة الرعاية. كيف يمكنني مساعدتكم؟",
          nextStep: "family_options",
        },
        {
          id: "family_options",
          type: "question",
          content: "يمكنني مساعدتكم في:",
          options: [
            "تنسيق المواعيد",
            "الحصول على التحديثات",
            "المواد التعليمية",
            "التواصل مع الطبيب",
          ],
          nextStep: "family_action",
        },
        {
          id: "family_action",
          type: "action",
          content: "ممتاز! دعني أساعدكم في هذا الأمر.",
          nextStep: "end",
        },
      ],
    });

    // Continuous Support Flow
    this.flows.set("continuous_support", {
      id: "continuous_support",
      name: "الدعم المستمر",
      description: "جعل المساعد أداة تواصل موثوقة بين الجلسات",
      entryPoints: ["دعم", "متابعة", "تحديث"],
      steps: [
        {
          id: "support_check",
          type: "question",
          content: "كيف يمكنني دعمك اليوم؟",
          options: [
            "إرسال مواد داعمة",
            "تحديث عن التقدم",
            "استفسار عن الخدمات",
            "التواصل مع الطبيب",
          ],
          nextStep: "support_action",
        },
        {
          id: "support_action",
          type: "action",
          content: "بناءً على خطة طبيبك، هذا ما يمكنني تقديمه لك اليوم.",
          nextStep: "end",
        },
      ],
    });

    // Doctor Communication Flow
    this.flows.set("doctor_communication", {
      id: "doctor_communication",
      name: "التواصل مع الطبيب",
      description: "تسهيل التواصل بين المريض والطبيب عبر Slack",
      entryPoints: ["طبيب", "استشارة", "سؤال طبي", "تواصل مع الطبيب"],
      steps: [
        {
          id: "doctor_question",
          type: "question",
          content: "ما هو سؤالك أو استفسارك الطبي؟",
          nextStep: "collect_question",
        },
        {
          id: "collect_question",
          type: "action",
          content: "شكراً لك على سؤالك. سأقوم بإرساله للطبيب المختص وستحصل على رد قريباً.",
          nextStep: "notify_doctor",
        },
        {
          id: "notify_doctor",
          type: "slack_notify",
          content: "تم إرسال استفسار المريض للطبيب عبر Slack",
          slackChannel: "general",
          notificationType: "general",
          nextStep: "end",
        },
      ],
    });

    // Emergency Flow with Slack Integration
    this.flows.set("emergency_slack", {
      id: "emergency_slack",
      name: "الطوارئ مع Slack",
      description: "نظام طوارئ متكامل مع إشعارات Slack",
      entryPoints: ["طارئ", "عاجل", "خطر", "إسعاف"],
      steps: [
        {
          id: "emergency_detection",
          type: "action",
          content: "🚨 تم اكتشاف حالة طوارئ! يرجى الاتصال فوراً بالرقم 997 أو 911.",
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
        {
          id: "emergency_contacts",
          type: "information",
          content: "أرقام الطوارئ: 997 (الطوارئ العامة) - 911 (الإسعاف) - مركز الهمم: +966501234567",
          nextStep: "follow_up",
        },
        {
          id: "follow_up",
          type: "action",
          content: "هل تريد مني التواصل مع فريقنا الطبي فوراً؟",
          options: ["نعم، اتصل بي", "لا، سأتصل بنفسي", "أحتاج مساعدة أخرى"],
          nextStep: "end",
        },
      ],
    });

    // Appointment with Slack Notifications
    this.flows.set("appointment_slack", {
      id: "appointment_slack",
      name: "حجز المواعيد مع Slack",
      description: "نظام حجز المواعيد مع إشعارات Slack للطاقم الطبي",
      entryPoints: ["موعد", "حجز", "جدولة", "appointment"],
      steps: [
        {
          id: "appointment_type",
          type: "question",
          content: "هل هذا موعد جديد أم متابعة؟",
          options: ["موعد جديد", "متابعة", "إعادة جدولة"],
          nextStep: "check_schedule",
        },
        {
          id: "check_schedule",
          type: "action",
          content: "دعني أتحقق من المواعيد المتاحة...",
          nextStep: "show_availability",
        },
        {
          id: "show_availability",
          type: "information",
          content: "المواعيد المتاحة:",
          nextStep: "confirm_appointment",
        },
        {
          id: "confirm_appointment",
          type: "action",
          content: "هل تود تأكيد هذا الموعد؟",
          options: ["نعم، أؤكد", "لا، موعد آخر", "إلغاء"],
          nextStep: "slack_notification",
        },
        {
          id: "slack_notification",
          type: "slack_notify",
          content: "تم حجز موعد جديد",
          slackChannel: "appointments",
          notificationType: "appointment",
          nextStep: "send_confirmation",
        },
        {
          id: "send_confirmation",
          type: "whatsapp_send",
          content: "تم إرسال رسالة تأكيد عبر واتساب",
          whatsappTemplate: "appointment_confirmation",
          nextStep: "end",
        },
      ],
    });
  }

  // Get flow by ID
  getFlow(flowId: string): ConversationFlow | undefined {
    return this.flows.get(flowId);
  }

  // Get flow by entry point
  getFlowByEntryPoint(entryPoint: string): ConversationFlow | undefined {
    for (const flow of this.flows.values()) {
      if (flow.entryPoints.includes(entryPoint)) {
        return flow;
      }
    }
    return undefined;
  }

  // Get next step in flow
  getNextStep(
    flowId: string,
    currentStepId: string,
    userResponse?: string,
  ): FlowStep | undefined {
    const flow = this.flows.get(flowId);
    if (!flow) return undefined;

    const currentStep = flow.steps.find((step) => step.id === currentStepId);
    if (!currentStep) return undefined;

    // Check conditions if they exist
    if (currentStep.conditions && userResponse) {
      for (const condition of currentStep.conditions) {
        if (this.evaluateCondition(condition, userResponse)) {
          return flow.steps.find((step) => step.id === condition.nextStep);
        }
      }
    }

    // Return next step based on nextStep property
    if (currentStep.nextStep) {
      return flow.steps.find((step) => step.id === currentStep.nextStep);
    }

    return undefined;
  }

  // Execute step action (Slack notifications, WhatsApp sending, etc.)
  async executeStepAction(
    step: FlowStep,
    context: any = {}
  ): Promise<boolean> {
    try {
      switch (step.type) {
        case 'slack_notify':
          await this.executeSlackNotification(step, context);
          break;
        case 'whatsapp_send':
          await this.executeWhatsAppSend(step, context);
          break;
        default:
          // No action needed for other step types
          break;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // Execute Slack notification
  private async executeSlackNotification(step: FlowStep, context: any): Promise<void> {
    try {
      const response = await fetch('/api/slack/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: step.notificationType || 'general',
          message: step.content,
          channel: step.slackChannel || 'general',
          priority: 'medium',
          ...context
        }),
      });

      if (!response.ok) {
        console.error('Failed to send message:', await response.text());
      }
    } catch (error) {
      }
  }

  // Execute WhatsApp send
  private async executeWhatsAppSend(step: FlowStep, context: any): Promise<void> {
    try {
      // This would integrate with the existing WhatsApp system
      } catch (error) {
      }
  }

  // Evaluate condition
  private evaluateCondition(
    condition: FlowCondition,
    userResponse: string,
  ): boolean {
    switch (condition.operator) {
      case "equals":
        return userResponse.toLowerCase() === condition.value.toLowerCase();
      case "contains":
        return userResponse
          .toLowerCase()
          .includes(condition.value.toLowerCase());
      case "greater_than":
        return parseFloat(userResponse) > parseFloat(condition.value);
      case "less_than":
        return parseFloat(userResponse) < parseFloat(condition.value);
      default:
        return false;
    }
  }

  // Get all available flows
  getAllFlows(): ConversationFlow[] {
    return Array.from(this.flows.values());
  }

  // Add new flow
  addFlow(flow: ConversationFlow): void {
    this.flows.set(flow.id, flow);
  }

  // Update existing flow
  updateFlow(flowId: string, flow: ConversationFlow): void {
    this.flows.set(flowId, flow);
  }

  // Delete flow
  deleteFlow(flowId: string): void {
    this.flows.delete(flowId);
  }
}
