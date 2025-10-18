// AI Assistant System for Hemam Center
export interface AssistantPersona {
  name: string;
  personality: {
    tone: 'empathetic' | 'professional' | 'encouraging';
    language: 'simple' | 'medical' | 'family-friendly';
    responseStyle: 'warm' | 'clinical' | 'motivational';
  };
  capabilities: string[];
  limitations: string[];
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  userType:
    | 'new_beneficiary'
    | 'existing_patient'
    | 'family_member'
    | 'medical_staff';
  currentFlow: string;
  previousInteractions: Interaction[];
  emergencyLevel: 'normal' | 'urgent' | 'crisis';
}

export interface Interaction {
  timestamp: Date;
  message: string;
  response: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'crisis';
  actionTaken: string;
}

export interface CrisisKeywords {
  selfHarm: string[];
  emergency: string[];
  danger: string[];
  urgent: string[];
}

export class HemamAssistant {
  private readonly persona: AssistantPersona;
  private crisisKeywords: CrisisKeywords;
  private emergencyContacts: {
    crisis: string;
    medical: string;
    admin: string;
  };

  constructor() {
    this.persona = {
      name: 'مُعين',
      personality: {
        tone: 'empathetic',
        language: 'simple',
        responseStyle: 'warm',
      },
      capabilities: [
        'إدارة المواعيد',
        'توفير المعلومات العامة',
        'التواصل مع الفريق الطبي',
        'الدعم النفسي الأولي',
        'تنسيق الخدمات',
      ],
      limitations: [
        'لا يمكنه التشخيص الطبي',
        'لا يقدم نصائح طبية متخصصة',
        'يحتاج لتحويل الحالات الطارئة',
      ],
    };

    this.crisisKeywords = {
      selfHarm: [
        'إيذاء نفسي',
        'أذى نفسي',
        'أريد أن أموت',
        'انتحار',
        'قتل نفسي',
      ],
      emergency: ['طارئ', 'عاجل', 'مستشفى', 'إسعاف', 'خطر'],
      danger: ['خطر', 'مهدد', 'تهديد', 'خوف شديد', 'ذعر'],
      urgent: ['فوراً', 'الآن', 'سريع', 'عاجل', 'مستعجل'],
    };

    this.emergencyContacts = {
      crisis: '997', // Saudi emergency number
      medical: '+966501234567', // Center's emergency line
      admin: '+966501234568', // Admin emergency line
    };
  }

  public getPersona(): AssistantPersona {
    return this.persona;
  }

  // Analyze message for crisis indicators
  analyzeCrisisLevel(message: string): 'normal' | 'urgent' | 'crisis' {
    const lowerMessage = message.toLowerCase();

    // Check for crisis keywords
    for (const keyword of this.crisisKeywords.selfHarm) {
      if (lowerMessage.includes(keyword)) {
        return 'crisis';
      }
    }

    for (const keyword of this.crisisKeywords.emergency) {
      if (lowerMessage.includes(keyword)) {
        return 'urgent';
      }
    }

    for (const keyword of this.crisisKeywords.danger) {
      if (lowerMessage.includes(keyword)) {
        return 'urgent';
      }
    }

    return 'normal';
  }

  // Generate empathetic response
  generateEmpatheticResponse(
    context: ConversationContext,
    userMessage: string
  ): string {
    const crisisLevel = this.analyzeCrisisLevel(userMessage);

    if (crisisLevel === 'crisis') {
      return this.handleCrisisResponse();
    }

    if (crisisLevel === 'urgent') {
      return this.handleUrgentResponse();
    }

    // Normal empathetic response
    const empatheticStarters = [
      'نحن هنا لمساعدتك',
      'أتفهم تماماً ما تمر به',
      'شكراً لمشاركتنا، معاً سنجد الدعم المناسب',
      'أنت لست وحدك، نحن معك',
      'نقدر ثقتك فينا',
    ];

    const randomStarter =
      empatheticStarters[Math.floor(Math.random() * empatheticStarters.length)];

    return `${randomStarter}. ${this.generateContextualResponse(context, userMessage)}`;
  }

  // Handle crisis situations
  private handleCrisisResponse(): string {
    return `أرى أنك قد تحتاج لمساعدة عاجلة. يرجى الاتصال فوراً بالرقم ${this.emergencyContacts.crisis} أو ${this.emergencyContacts.medical}. نحن هنا لمساعدتك في هذه اللحظة الصعبة.`;
  }

  // Handle urgent situations
  private handleUrgentResponse(): string {
    return `أفهم أن هذا أمر عاجل. يمكنني مساعدتك في التواصل مع فريقنا الطبي فوراً. هل تود أن أتصل بك الآن؟`;
  }

  // Generate contextual response based on conversation flow
  private generateContextualResponse(
    context: ConversationContext,
    userMessage: string
  ): string {
    switch (context.currentFlow) {
      case 'new_beneficiary':
        return this.handleNewBeneficiaryFlow(userMessage);
      case 'appointment_booking':
        return this.handleAppointmentFlow(userMessage);
      case 'general_inquiry':
        return this.handleGeneralInquiry(userMessage);
      case 'family_support':
        return this.handleFamilySupportFlow(userMessage);
      default:
        return this.handleDefaultFlow(userMessage);
    }
  }

  // New beneficiary onboarding flow
  private handleNewBeneficiaryFlow(_message: string): string {
    return `أهلاً بك في مركز الهمم، أنا مُعين، مساعدك الرقمي. نحن هنا لتقديم الدعم لكل فرد. كيف يمكننا خدمتك اليوم؟ يمكنك اختيار:
1️⃣ استفسار جديد
2️⃣ حجز تقييم أولي  
3️⃣ معلومات عن خدماتنا`;
  }

  // Appointment booking flow
  private handleAppointmentFlow(_message: string): string {
    return `هل هذا موعد جديد أم متابعة؟ يمكنني مساعدتك في:
1️⃣ حجز موعد جديد
2️⃣ إعادة جدولة موعد
3️⃣ تأكيد موعد موجود
4️⃣ إلغاء موعد`;
  }

  // General inquiry handling
  private handleGeneralInquiry(_message: string): string {
    return `يمكنني مساعدتك في:
1️⃣ معلومات عن المركز
2️⃣ الخدمات المتاحة
3️⃣ الفعاليات والورش
4️⃣ التواصل مع الفريق الطبي`;
  }

  // Family support flow
  private handleFamilySupportFlow(_message: string): string {
    return `نحن نقدر دوركم كعائلة في رحلة الرعاية. يمكنني مساعدتكم في:
1️⃣ تنسيق المواعيد
2️⃣ الحصول على التحديثات
3️⃣ المواد التعليمية
4️⃣ التواصل مع الطبيب`;
  }

  // Default flow
  private handleDefaultFlow(_message: string): string {
    return `كيف يمكنني مساعدتك اليوم؟ يمكنك اختيار:
1️⃣ إدارة المواعيد
2️⃣ التواصل مع طبيبك
3️⃣ معلومات عن المركز
4️⃣ الدعم النفسي`;
  }

  // Generate motivational message
  generateMotivationalMessage(patientName: string, milestone?: string): string {
    const motivationalMessages = [
      `صباح الخير يا ${patientName}، نتمنى لك أسبوعاً مليئاً بالهمة والإنجاز! تذكر أن كل خطوة، مهما كانت صغيرة، هي تقدم نحو هدفك. فريق مركز الهمم كله يدعمك.`,
      `يا ${patientName}، نحن فخورون بإصرارك وهمتك العالية. إلى الأمام دائماً!`,
      `${patientName}، تذكر أن التحديات تصنع الأبطال، وأنت من الأبطال!`,
      `يا بطل ${patientName}، كل يوم هو فرصة جديدة للتقدم والنجاح!`,
    ];

    if (milestone) {
      return `تهانينا الحارة يا بطل! لقد أكملت بنجاح ${milestone}. نحن في مركز الهمم فخورون جداً بإصرارك وهمتك العالية. إلى الأمام دائماً!`;
    }

    const idx = Math.floor(Math.random() * motivationalMessages.length);
    const selected = motivationalMessages[idx];
    const fallback: string = 'نحن معك وكل خطوة تُحدث فرقاً — استمر!';
    return selected ?? fallback;
  }

  // Generate proactive care message
  generateProactiveCareMessage(
    patientName: string,
    exerciseName: string
  ): string {
    return `يا ${patientName}، اليوم لديك تمرين ${exerciseName} في خطتك. هل أنت مستعد؟ يمكنك الرد بـ:
👍 نعم، أتممته
💬 أحتاج مساعدة
⏰ سأقوم به لاحقاً`;
  }

  // Generate family notification
  generateFamilyNotification(
    patientName: string,
    notificationType: 'appointment' | 'update' | 'reminder',
    details: string
  ): string {
    switch (notificationType) {
      case 'appointment':
        return `تذكير: لدى ${patientName} موعد غداً الساعة ${details}.`;
      case 'update':
        return `تم تحديث جدول جلسات ${patientName} لهذا الأسبوع: ${details}`;
      case 'reminder':
        return `تذكير: ${details} لـ ${patientName}`;
      default:
        return `تحديث: ${details} لـ ${patientName}`;
    }
  }

  // Generate accessibility-friendly response
  generateAccessibleResponse(options: string[]): string {
    let response = 'يمكنك اختيار:';
    options.forEach((option, index) => {
      response += `\n${index + 1}️⃣ ${option}`;
    });
    response += '\n\nيمكنك الكتابة أو إرسال رسالة صوتية بطلبك.';
    return response;
  }
}
