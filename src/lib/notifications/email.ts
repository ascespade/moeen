/**
 * Email Notification Service
 * Handles email sending and templates
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  variables: string[];
}

export interface EmailData {
  to: string | string[];
  templateId?: string;
  subject?: string;
  html?: string;
  text?: string;
  variables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType: string;
  }>;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private templates: Map<string, EmailTemplate> = new Map();

  registerTemplate(_template: EmailTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(_id: string): EmailTemplate | null {
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

  async sendEmail(_emailData: EmailData): Promise<EmailResponse> {
    try {
      let subject = emailData.subject;
      let html = emailData.html;
      let text = emailData.text;

      // Use template if provided
      if (emailData.templateId) {
        const __template = this.getTemplate(emailData.templateId);
        if (!template) {
          return {
            success: false,
            error: "Email template not found",
          };
        }

        const __variables = emailData.variables || {};
        subject = this.replaceVariables(template.subject, variables);
        html = this.replaceVariables(template.html, variables);
        text = this.replaceVariables(template.text, variables);
      }

      if (!subject || (!html && !text)) {
        return {
          success: false,
          error: "Email subject and content are required",
        };
      }

      // Simulate email sending (replace with actual email service)
      const __response = await fetch("https://api.emailservice.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
        },
        body: JSON.stringify({
          to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
          subject,
          html,
          text,
          attachments: emailData.attachments,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email service error: ${response.statusText}`);
      }

      const __result = await response.json();
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      // // console.error("Email sending error:", error);
      return {
        success: false,
        error: "Failed to send email",
      };
    }
  }

  async sendBulkEmails(_emails: EmailData[]): Promise<EmailResponse[]> {
    const results: EmailResponse[] = [];

    for (const email of emails) {
      const __result = await this.sendEmail(email);
      results.push(result);
    }

    return results;
  }
}

// Create global email service
export const __emailService = new EmailService();

// Register default templates
emailService.registerTemplate({
  id: "appointment_confirmation",
  name: "Appointment Confirmation",
  subject: "تأكيد موعدك الطبي - {{patientName}}",
  html: `
    <div dir="rtl">
      <h2>تأكيد الموعد الطبي</h2>
      <p>عزيزي/عزيزتي {{patientName}}،</p>
      <p>تم تأكيد موعدك الطبي مع الدكتور {{doctorName}} في {{date}} في تمام الساعة {{time}}.</p>
      <p>يرجى الحضور قبل الموعد بـ 15 دقيقة.</p>
      <p>شكراً لثقتكم بنا.</p>
    </div>
  `,
  text: "تأكيد موعدك الطبي مع الدكتور {{doctorName}} في {{date}} في تمام الساعة {{time}}.",
  variables: ["patientName", "doctorName", "date", "time"],
});

emailService.registerTemplate({
  id: "prescription_ready",
  name: "Prescription Ready",
  subject: "وصفتك الطبية جاهزة - {{patientName}}",
  html: `
    <div dir="rtl">
      <h2>وصفتك الطبية جاهزة</h2>
      <p>عزيزي/عزيزتي {{patientName}}،</p>
      <p>وصفتك الطبية جاهزة ويمكنك استلامها من الصيدلية.</p>
      <p>الوصفة صالحة لمدة {{validity}} أيام.</p>
      <p>شكراً لثقتكم بنا.</p>
    </div>
  `,
  text: "وصفتك الطبية جاهزة ويمكنك استلامها من الصيدلية.",
  variables: ["patientName", "validity"],
});
