/**
 * SMS Notification Service
 * Handles SMS sending and templates
 */

export interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
}

export interface SMSData {
  to: string | string[];
  templateId?: string;
  message?: string;
  variables?: Record<string, any>;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class SMSService {
  private templates: Map<string, SMSTemplate> = new Map();

  registerTemplate(_template: SMSTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(_id: string): SMSTemplate | null {
    return this.templates.get(id) || null;
  }

  private replaceVariables(
    content: string,
    variables: Record<string, any>,
  ): string {
    let result = content;
    for (const [key, value] of Object.entries(variables)) {
      const __regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, String(value));
    }
    return result;
  }

  async sendSMS(_smsData: SMSData): Promise<SMSResponse> {
    try {
      let message = smsData.message;

      // Use template if provided
      if (smsData.templateId) {
        const __template = this.getTemplate(smsData.templateId);
        if (!template) {
          return {
            success: false,
            error: "SMS template not found",
          };
        }

        const __variables = smsData.variables || {};
        message = this.replaceVariables(template.message, variables);
      }

      if (!message) {
        return {
          success: false,
          error: "SMS message is required",
        };
      }

      // Simulate SMS sending (replace with actual SMS service)
      const __response = await fetch("https://api.smsservice.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SMS_API_KEY}`,
        },
        body: JSON.stringify({
          to: Array.isArray(smsData.to) ? smsData.to : [smsData.to],
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`SMS service error: ${response.statusText}`);
      }

      const __result = await response.json();
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      // // console.error("SMS sending error:", error);
      return {
        success: false,
        error: "Failed to send SMS",
      };
    }
  }

  async sendBulkSMS(_smsList: SMSData[]): Promise<SMSResponse[]> {
    const results: SMSResponse[] = [];

    for (const sms of smsList) {
      const __result = await this.sendSMS(sms);
      results.push(result);
    }

    return results;
  }
}

// Create global SMS service
export const __smsService = new SMSService();

// Register default templates
smsService.registerTemplate({
  id: "appointment_reminder",
  name: "Appointment Reminder",
  message:
    "تذكير: موعدك الطبي مع الدكتور {{doctorName}} غداً في {{time}}. يرجى الحضور قبل الموعد بـ 15 دقيقة.",
  variables: ["doctorName", "time"],
});

smsService.registerTemplate({
  id: "prescription_ready",
  name: "Prescription Ready",
  message:
    "وصفتك الطبية جاهزة ويمكنك استلامها من الصيدلية. صالحة لمدة {{validity}} أيام.",
  variables: ["validity"],
});

smsService.registerTemplate({
  id: "test_results",
  name: "Test Results",
  message: "نتائج فحوصاتك جاهزة. يرجى مراجعة الطبيب لاستلام النتائج.",
  variables: [],
});
