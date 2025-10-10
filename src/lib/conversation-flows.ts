// Conversation Flow Management System
export interface FlowStep {
  id: string;
  type: "question" | "information" | "action" | "redirect";
  content: string;
  options?: string[];
  nextStep?: string;
  conditions?: FlowCondition[];
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
  }

  // Get flow by ID
  getFlow(flowId: string): ConversationFlow | undefined {
    return this.flows.get(flowId);
  }

  // Get flow by entry point
  getFlowByEntryPoint(entryPoint: string): ConversationFlow | undefined {
    for (const flow of Array.from(this.flows.values())) {
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
