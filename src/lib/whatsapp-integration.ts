// WhatsApp Integration System for Hemam Center
export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "audio" | "document";
  status: "sent" | "delivered" | "read" | "failed";
}

export interface WhatsAppContact {
  phone: string;
  name?: string;
  isPatient: boolean;
  isFamilyMember: boolean;
  patientId?: string;
  familyMemberId?: string;
  lastInteraction: Date;
  preferredLanguage: "ar" | "en";
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category:
    | "appointment"
    | "reminder"
    | "motivational"
    | "educational"
    | "crisis";
  content: string;
  variables: string[];
  approved: boolean;
}

export class WhatsAppIntegration {
  private contacts: Map<string, WhatsAppContact> = new Map();
  private templates: Map<string, WhatsAppTemplate> = new Map();
  private messageQueue: WhatsAppMessage[] = [];

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Appointment Templates
    this.templates.set("appointment_confirmation", {
      id: "appointment_confirmation",
      name: "تأكيد الموعد",
      category: "appointment",
      content:
        "مرحباً {{name}}، تم تأكيد موعدك في مركز الهمم بتاريخ {{date}} في الساعة {{time}}. ننتظرك!",
      variables: ["name", "date", "time"],
      approved: true,
    });

    this.templates.set("appointment_reminder", {
      id: "appointment_reminder",
      name: "تذكير الموعد",
      category: "reminder",
      content:
        "تذكير: لديك موعد غداً في مركز الهمم في الساعة {{time}}. نتمنى لك يوم سعيد!",
      variables: ["time"],
      approved: true,
    });

    // Motivational Templates
    this.templates.set("daily_motivation", {
      id: "daily_motivation",
      name: "التحفيز اليومي",
      category: "motivational",
      content:
        "صباح الخير {{name}}! نتمنى لك يوماً مليئاً بالهمة والإنجاز. تذكر أن كل خطوة هي تقدم نحو هدفك. فريق مركز الهمم معك دائماً!",
      variables: ["name"],
      approved: true,
    });

    this.templates.set("milestone_celebration", {
      id: "milestone_celebration",
      name: "احتفال بالإنجاز",
      category: "motivational",
      content:
        "تهانينا الحارة {{name}}! لقد أكملت بنجاح {{milestone}}. نحن في مركز الهمم فخورون جداً بإصرارك وهمتك العالية. إلى الأمام دائماً!",
      variables: ["name", "milestone"],
      approved: true,
    });

    // Educational Templates
    this.templates.set("exercise_reminder", {
      id: "exercise_reminder",
      name: "تذكير التمرين",
      category: "educational",
      content:
        "يا {{name}}، اليوم لديك تمرين {{exercise}} في خطتك. هل أنت مستعد؟ يمكنك الرد بـ: 👍 نعم، أتممته | 💬 أحتاج مساعدة | ⏰ سأقوم به لاحقاً",
      variables: ["name", "exercise"],
      approved: true,
    });

    // Crisis Templates
    this.templates.set("crisis_support", {
      id: "crisis_support",
      name: "دعم الأزمات",
      category: "crisis",
      content:
        "أرى أنك قد تحتاج لمساعدة عاجلة. يرجى الاتصال فوراً بالرقم 997 أو 911. نحن هنا لمساعدتك في هذه اللحظة الصعبة.",
      variables: [],
      approved: true,
    });
  }

  // Contact Management
  addContact(contact: WhatsAppContact): void {
    this.contacts.set(contact.phone, contact);
  }

  getContact(phone: string): WhatsAppContact | undefined {
    return this.contacts.get(phone);
  }

  updateContact(phone: string, updates: Partial<WhatsAppContact>): boolean {
    const contact = this.contacts.get(phone);
    if (!contact) return false;

    const updatedContact = { ...contact, ...updates };
    this.contacts.set(phone, updatedContact);
    return true;
  }

  // Message Sending
  async sendMessage(
    to: string,
    content: string,
    type: "text" | "image" | "audio" | "document" = "text",
  ): Promise<string> {
    const messageId = this.generateMessageId();
    const message: WhatsAppMessage = {
      id: messageId,
      from: "center_hemam",
      to,
      content,
      timestamp: new Date(),
      type,
      status: "sent",
    };

    this.messageQueue.push(message);

    // Simulate sending (in real implementation, this would call WhatsApp API)
    return messageId;
  }

  // Template Message Sending
  async sendTemplateMessage(
    templateId: string,
    to: string,
    variables: Record<string, string>,
  ): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let content = template.content;

    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    return this.sendMessage(to, content);
  }

  // Automated Messages
  async sendAppointmentReminder(
    patientPhone: string,
    appointmentTime: string,
  ): Promise<string> {
    return this.sendTemplateMessage("appointment_reminder", patientPhone, {
      time: appointmentTime,
    });
  }

  async sendMotivationalMessage(
    patientPhone: string,
    patientName: string,
  ): Promise<string> {
    return this.sendTemplateMessage("daily_motivation", patientPhone, {
      name: patientName,
    });
  }

  async sendMilestoneCelebration(
    patientPhone: string,
    patientName: string,
    milestone: string,
  ): Promise<string> {
    return this.sendTemplateMessage("milestone_celebration", patientPhone, {
      name: patientName,
      milestone,
    });
  }

  async sendExerciseReminder(
    patientPhone: string,
    patientName: string,
    exerciseName: string,
  ): Promise<string> {
    return this.sendTemplateMessage("exercise_reminder", patientPhone, {
      name: patientName,
      exercise: exerciseName,
    });
  }

  async sendCrisisSupport(patientPhone: string): Promise<string> {
    return this.sendTemplateMessage("crisis_support", patientPhone, {});
  }

  // Family Notifications
  async notifyFamilyMember(
    familyPhone: string,
    patientName: string,
    notificationType: string,
    details: string,
  ): Promise<string> {
    let content = "";

    switch (notificationType) {
      case "appointment":
        content = `تذكير: لدى ${patientName} موعد غداً الساعة ${details}.`;
        break;
      case "update":
        content = `تم تحديث جدول جلسات ${patientName} لهذا الأسبوع: ${details}`;
        break;
      case "reminder":
        content = `تذكير: ${details} لـ ${patientName}`;
        break;
      default:
        content = `تحديث: ${details} لـ ${patientName}`;
    }

    return this.sendMessage(familyPhone, content);
  }

  // Message Processing
  async processIncomingMessage(
    from: string,
    content: string,
    messageType: string,
  ): Promise<string> {
    const contact = this.getContact(from);

    // Update last interaction
    if (contact) {
      this.updateContact(from, { lastInteraction: new Date() });
    }

    // Process based on message type
    if (messageType === "text") {
      return this.processTextMessage(from, content);
    } else if (messageType === "audio") {
      return this.processAudioMessage(from);
    } else if (messageType === "image") {
      return this.processImageMessage(from);
    }

    return "شكراً لك على رسالتك. سنقوم بالرد عليك قريباً.";
  }

  private async processTextMessage(
    from: string,
    content: string,
  ): Promise<string> {
    const lowerContent = content.toLowerCase();

    // Crisis detection
    if (this.detectCrisisKeywords(lowerContent)) {
      await this.sendCrisisSupport(from);
      return "تم إرسال معلومات الدعم العاجل. يرجى التواصل مع الأرقام المذكورة فوراً.";
    }

    // Appointment related
    if (lowerContent.includes("موعد") || lowerContent.includes("حجز")) {
      return "يمكنني مساعدتك في حجز موعد. هل تود حجز موعد جديد أم إعادة جدولة موعد موجود؟";
    }

    // General inquiry
    if (lowerContent.includes("معلومات") || lowerContent.includes("خدمات")) {
      return "مرحباً بك في مركز الهمم! يمكنني مساعدتك في:\n1️⃣ معلومات عن المركز\n2️⃣ الخدمات المتاحة\n3️⃣ الفعاليات والورش\n4️⃣ التواصل مع الفريق الطبي";
    }

    // Support request
    if (lowerContent.includes("مساعدة") || lowerContent.includes("دعم")) {
      return "نحن هنا لمساعدتك! كيف يمكنني دعمك اليوم؟";
    }

    // Default response
    return "شكراً لك على رسالتك. يمكنني مساعدتك في حجز المواعيد، تقديم المعلومات، أو التواصل مع الفريق الطبي. ما الذي تحتاجه؟";
  }

  private async processAudioMessage(_from: string): Promise<string> {
    // In real implementation, this would use speech-to-text
    return "شكراً لك على الرسالة الصوتية. يرجى إرسال رسالة نصية لمساعدتي في فهم طلبك بشكل أفضل.";
  }

  private async processImageMessage(_from: string): Promise<string> {
    return "شكراً لك على الصورة. يرجى إرسال رسالة نصية لمساعدتي في فهم ما تحتاجه.";
  }

  // Crisis Detection
  private detectCrisisKeywords(content: string): boolean {
    const crisisKeywords = [
      "إيذاء نفسي",
      "أذى نفسي",
      "أريد أن أموت",
      "انتحار",
      "قتل نفسي",
      "طارئ",
      "عاجل",
      "مستشفى",
      "إسعاف",
      "خطر",
      "خوف شديد",
      "ذعر",
      "مهدد",
      "تهديد",
    ];

    return crisisKeywords.some((keyword) => content.includes(keyword));
  }

  // Message Status Tracking
  updateMessageStatus(
    messageId: string,
    status: "delivered" | "read" | "failed",
  ): boolean {
    const message = this.messageQueue.find((m) => m.id === messageId);
    if (!message) return false;

    message.status = status;
    return true;
  }

  // Analytics and Reporting
  getMessageStats(): {
    totalMessages: number;
    sentMessages: number;
    deliveredMessages: number;
    readMessages: number;
    failedMessages: number;
  } {
    const totalMessages = this.messageQueue.length;
    const sentMessages = this.messageQueue.filter(
      (m) => m.status === "sent",
    ).length;
    const deliveredMessages = this.messageQueue.filter(
      (m) => m.status === "delivered",
    ).length;
    const readMessages = this.messageQueue.filter(
      (m) => m.status === "read",
    ).length;
    const failedMessages = this.messageQueue.filter(
      (m) => m.status === "failed",
    ).length;

    return {
      totalMessages,
      sentMessages,
      deliveredMessages,
      readMessages,
      failedMessages,
    };
  }

  // Template Management
  addTemplate(template: WhatsAppTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(templateId: string): WhatsAppTemplate | undefined {
    return this.templates.get(templateId);
  }

  getAllTemplates(): WhatsAppTemplate[] {
    return Array.from(this.templates.values());
  }

  // Utility Functions
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Accessibility Features
  generateAccessibleResponse(options: string[]): string {
    let response = "يمكنك اختيار:";
    options.forEach((option, index) => {
      response += `\n${index + 1}️⃣ ${option}`;
    });
    response += "\n\nيمكنك الكتابة أو إرسال رسالة صوتية بطلبك.";
    return response;
  }

  // Multi-language Support
  generateMultilingualResponse(
    arabicText: string,
    englishText: string,
    preferredLanguage: "ar" | "en",
  ): string {
    if (preferredLanguage === "ar") {
      return arabicText;
    } else {
      return englishText;
    }
  }
}
