import { Intent } from './types';

export class IntentAnalyzer {
  private intents: Map<string, any> = new Map();

  constructor() {
    this.initializeIntents();
  }

  private initializeIntents() {
    // Appointment booking intents
    this.intents.set('book_appointment', {
      keywords: ['موعد', 'حجز', 'تحديد', 'appointment', 'book', 'schedule'],
      patterns: [
        /أريد حجز موعد/,
        /أريد تحديد موعد/,
        /book appointment/,
        /schedule appointment/,
        /موعد مع طبيب/
      ],
      actionType: 'create_appointment',
      priority: 1
    });

    // Payment intents
    this.intents.set('payment_inquiry', {
      keywords: ['دفع', 'فاتورة', 'payment', 'bill', 'invoice'],
      patterns: [
        /كم المبلغ المطلوب/,
        /أين أدفع/,
        /payment amount/,
        /how to pay/
      ],
      actionType: 'payment_info',
      priority: 2
    });

    // Insurance intents
    this.intents.set('insurance_inquiry', {
      keywords: ['تأمين', 'مطالبة', 'insurance', 'claim'],
      patterns: [
        /حالة المطالبة/,
        /insurance claim/,
        /تأمين صحي/
      ],
      actionType: 'insurance_info',
      priority: 2
    });

    // Reminder intents
    this.intents.set('set_reminder', {
      keywords: ['تذكير', 'reminder', 'تذكيرني'],
      patterns: [
        /تذكيرني/,
        /set reminder/,
        /remind me/
      ],
      actionType: 'send_reminder',
      priority: 3
    });

    // General inquiry intents
    this.intents.set('general_inquiry', {
      keywords: ['معلومات', 'سؤال', 'help', 'info', 'question'],
      patterns: [
        /معلومات عن/,
        /أريد معرفة/,
        /help me/,
        /what is/
      ],
      actionType: 'general_info',
      priority: 4
    });

    // Greeting intents
    this.intents.set('greeting', {
      keywords: ['مرحبا', 'أهلا', 'hello', 'hi', 'good morning', 'good afternoon'],
      patterns: [
        /مرحبا/,
        /أهلا/,
        /hello/,
        /hi/,
        /good morning/,
        /good afternoon/
      ],
      actionType: 'greeting',
      priority: 5
    });
  }

  async analyzeIntent(message: string): Promise<Intent> {
    const normalizedMessage = message.toLowerCase().trim();
    let bestMatch = { type: 'unknown', confidence: 0, entities: {} };

    for (const [intentType, intentData] of this.intents) {
      let confidence = 0;
      const entities: Record<string, any> = {};

      // Check keyword matches
      for (const keyword of intentData.keywords) {
        if (normalizedMessage.includes(keyword.toLowerCase())) {
          confidence += 0.3;
        }
      }

      // Check pattern matches
      for (const pattern of intentData.patterns) {
        if (pattern.test(normalizedMessage)) {
          confidence += 0.5;
          break;
        }
      }

      // Extract entities based on intent type
      if (intentType === 'book_appointment') {
        entities.doctor = this.extractDoctor(normalizedMessage);
        entities.time = this.extractTime(normalizedMessage);
        entities.date = this.extractDate(normalizedMessage);
      } else if (intentType === 'payment_inquiry') {
        entities.amount = this.extractAmount(normalizedMessage);
        entities.method = this.extractPaymentMethod(normalizedMessage);
      }

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          type: intentType,
          confidence: Math.min(confidence, 1),
          entities,
          actionType: intentData.actionType
        };
      }
    }

    return bestMatch;
  }

  private extractDoctor(message: string): string | null {
    const doctorPatterns = [
      /طبيب (.*?)(?:\s|$)/,
      /doctor (.*?)(?:\s|$)/,
      /د\. (.*?)(?:\s|$)/
    ];

    for (const pattern of doctorPatterns) {
      const match = message.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }

  private extractTime(message: string): string | null {
    const timePatterns = [
      /(\d{1,2}):(\d{2})/,
      /(\d{1,2}) صباحا/,
      /(\d{1,2}) مساء/,
      /(\d{1,2}) am/,
      /(\d{1,2}) pm/
    ];

    for (const pattern of timePatterns) {
      const match = message.match(pattern);
      if (match) return match[0].trim();
    }

    return null;
  }

  private extractDate(message: string): string | null {
    const datePatterns = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{1,2})-(\d{1,2})-(\d{4})/,
      /اليوم/,
      /غدا/,
      /today/,
      /tomorrow/
    ];

    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) {
        if (match[0] === 'اليوم' || match[0] === 'today') {
          return new Date().toISOString().split('T')[0];
        } else if (match[0] === 'غدا' || match[0] === 'tomorrow') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.toISOString().split('T')[0];
        }
        return match[0].trim();
      }
    }

    return null;
  }

  private extractAmount(message: string): number | null {
    const amountPattern = /(\d+(?:\.\d{2})?)\s*ريال/;
    const match = message.match(amountPattern);
    return match ? parseFloat(match[1]) : null;
  }

  private extractPaymentMethod(message: string): string | null {
    const methods = ['نقدا', 'بطاقة', 'تحويل', 'cash', 'card', 'transfer'];
    for (const method of methods) {
      if (message.includes(method)) {
        return method;
      }
    }
    return null;
  }
}