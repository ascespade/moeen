/**
 * Moeen Chatbot Core System
 * نظام المساعد معين الأساسي
 * 
 * Core personality and interaction system for Moeen chatbot
 */

export interface MoeenPersonality {
  name: string;
  personalityType: 'professional_friendly' | 'warm_caring' | 'professional_formal';
  tone: 'warm_caring' | 'professional' | 'casual';
  language: 'ar' | 'en';
  responseStyle: string;
}

export interface MoeenContext {
  conversationId: string;
  userId?: string;
  userType?: 'patient' | 'doctor' | 'staff' | 'admin';
  sessionId: string;
  history: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }>;
  currentIntent?: string;
  entities?: Record<string, unknown>;
  appointmentContext?: {
    type?: string;
    date?: Date;
    time?: string;
    doctor?: string;
  };
}

export class MoeenChatbot {
  private _personality: MoeenPersonality;

  constructor() {
    this.personality = {
      name: 'معين',
      personalityType: 'professional_friendly',
      tone: 'warm_caring',
      language: 'ar',
      responseStyle: 'أنا مساعد ودود ومهتم. أقدم المساعدة والمعلومات بطريقة واضحة ومفيدة. أساعد المرضى في حجز المواعيد والاستفسارات. أكون متعاطفاً ومهتماً بصحة المرضى وراحتهم.',
    };
  }

  /**
   * Get system prompt for Moeen
   * الحصول على تعليمات النظام لمعين
   */
  getSystemPrompt(context?: MoeenContext): string {
    const basePrompt = `
أنت مساعد ذكي ودود اسمه معين يعمل في مركز الرعاية الصحية.

**المهام:**
- حجز المواعيد للمرضى
- الإجابة على الاستفسارات الصحية العامة
- توجيه المرضى للخدمات المناسبة
- مساعدة الأطباء في إدارة الجدول
- تذكير المرضى بمواعيدهم القادمة

**المبادئ الأساسية:**
1. كن ودوداً ومتعاطفاً مع المرضى
2. قدم معلومات دقيقة ومفيدة
3. احترم الخصوصية والسرية الطبية
4. كن واضحاً في التواصل
5. ساعد في حل المشاكل بسرعة

**القواعد المهمة:**
- لا تقم بتشخيص الأمراض
- لا تقدم استشارات طبية مباشرة
- احترم خصوصية المعلومات
- كن مهذباً في جميع الأوقات
- لا تشارك معلومات حساسة

**القيود:**
- لا تستخدم لغة غير مهنية
- لا تعطي معلومات طبية خطيرة
- لا تتعامل مع حالات الطوارئ
- استخدم لغة واضحة ومفهومة
`;

    if (context?.userType) {
      const userTypeContext = this.getUserTypeContext(context.userType);
      return `${basePrompt}\n\n${userTypeContext}`;
    }

    return basePrompt;
  }

  /**
   * Get context-specific prompts based on user type
   * الحصول على تعليمات حسب نوع المستخدم
   */
  private getUserTypeContext(userType: string): string {
    const contexts: Record<string, string> = {
      patient: `
**سياق خاص للمريض:**
- ساعد في حجز المواعيد بسهولة
- وفر معلومات عن الخدمات المتاحة
- أجب عن استفسارات بسيطة
- أذكر بمواعيدهم القادمة
- قدم معلومات عن الإجراءات
`,
      doctor: `
**سياق خاص للطبيب:**
- ساعد في إدارة الجدول
- قدم معلومات عن المرضى
- ساعد في جدولة المواعيد
- قدم تقارير سريعة
`,
      staff: `
**سياق خاص للموظفين:**
- ساعد في إدارة المهام
- قدم معلومات عن النظام
- ساعد في التواصل مع المرضى
- قدم تقارير إدارية سريعة
`,
    };

    return contexts[userType] || '';
  }

  /**
   * Detect intent from user message
   * اكتشاف القصد من رسالة المستخدم
   */
  async detectIntent(message: string, _context: MoeenContext): Promise<string> {
    const lowerMessage = message.toLowerCase();

    // Appointment booking intents
    if (
      lowerMessage.includes('حجز') ||
      lowerMessage.includes('موعد') ||
      lowerMessage.includes('ميعاد')
    ) {
      return 'book_appointment';
    }

    // Reschedule intent
    if (
      lowerMessage.includes('تأجيل') ||
      lowerMessage.includes('إعادة جدولة') ||
      lowerMessage.includes('تغيير')
    ) {
      return 'reschedule_appointment';
    }

    // Cancel intent
    if (
      lowerMessage.includes('إلغاء') ||
      lowerMessage.includes('الغاء') ||
      lowerMessage.includes('إلغ')
    ) {
      return 'cancel_appointment';
    }

    // Information request
    if (
      lowerMessage.includes('معلومات') ||
      lowerMessage.includes('استفسار') ||
      lowerMessage.includes('سؤال') ||
      lowerMessage.includes('؟')
    ) {
      return 'information_request';
    }

    // Greeting
    if (
      lowerMessage.includes('مرحبا') ||
      lowerMessage.includes('السلام عليكم') ||
      lowerMessage.includes('اهلا')
    ) {
      return 'greeting';
    }

    return 'general_chat';
  }

  /**
   * Extract entities from message
   * استخراج الكيانات من الرسالة
   */
  extractEntities(message: string): Record<string, unknown> {
    const entities: Record<string, unknown> = {};

    // Date patterns
    const datePatterns = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{1,2})-(\d{1,2})-(\d{4})/,
      /(اليوم|غدا|بعد غد|الأسبوع)/,
    ];

    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) {
        entities.date = match[0];
        break;
      }
    }

    // Time patterns
    const timePatterns = [
      /(\d{1,2}):(\d{2})/,
      /(صباح|ظهر|مساء|ليل|صباحا|مساءا)/,
    ];

    for (const pattern of timePatterns) {
      const match = message.match(pattern);
      if (match) {
        entities.time = match[0];
        break;
      }
    }

    return entities;
  }

  /**
   * Generate response based on intent and context
   * توليد رد بناءً على القصد والسياق
   */
  async generateResponse(
    message: string,
    context: MoeenContext
  ): Promise<string> {
    const intent = await this.detectIntent(message, context);
    const entities = this.extractEntities(message);

    switch (intent) {
      case 'greeting':
        return this.handleGreeting(context);
      case 'book_appointment':
        return this.handleBookAppointment(entities, context);
      case 'reschedule_appointment':
        return this.handleRescheduleAppointment(entities, context);
      case 'cancel_appointment':
        return this.handleCancelAppointment(context);
      case 'information_request':
        return this.handleInformationRequest(message, context);
      default:
        return this.handleGeneralChat(message, context);
    }
  }

  private handleGreeting(_context: MoeenContext): string {
    const greetings = [
      'مرحباً! أنا معين المساعد الذكي. كيف يمكنني مساعدتك اليوم؟',
      'أهلاً وسهلاً! أنا معين جاهز لمساعدتك. ما الذي تحتاج إليه؟',
      'مرحباً بك! أنا معين المساعد. كيف يمكنني أن أساعدك؟',
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private handleBookAppointment(
    entities: Record<string, unknown>,
    _context: MoeenContext
  ): string {
    if (!entities.date || !entities.time) {
      return 'حسناً، سأساعدك في حجز الموعد. يرجى إخباري بالتاريخ والوقت المفضلين لديك حتى أتمكن من حجز الموعد المناسب.';
    }

    return `تم حجز الموعد بنجاح في ${entities.date} الساعة ${entities.time}. سيتم إرسال تأكيد بالموعد عبر البريد الإلكتروني.`;
  }

  private handleRescheduleAppointment(
    _entities: Record<string, unknown>,
    _context: MoeenContext
  ): string {
    return 'حسناً، سأساعدك في إعادة الجدولة. يرجى إخباري برقم الموعد الحالي والتاريخ والوقت الجديدين المفضلين لديك.';
  }

  private handleCancelAppointment(_context: MoeenContext): string {
    return 'حسناً، سأساعدك في إلغاء الموعد. يرجى إخباري برقم الموعد المراد إلغاؤه وسأقوم بإلغائه فوراً.';
  }

  private handleInformationRequest(
    _message: string,
    _context: MoeenContext
  ): string {
    return 'سأسعد بمساعدتك. يرجى إخباري بالموضوع الذي تريد معلومات عنه وسأقدم لك المعلومات المتاحة.';
  }

  private handleGeneralChat(
    _message: string,
    _context: MoeenContext
  ): string {
    return 'أفهم. أنا هنا لمساعدتك. يمكنني مساعدتك في حجز المواعيد أو الإجابة على استفساراتك أو أي شيء آخر تحتاج إليه.';
  }
}

export const moeenChatbot = new MoeenChatbot();
