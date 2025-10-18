import logger from "@/lib/monitoring/logger";

}
interface EmailTemplate {
  subject: string;
  html: string;
  text: string;

}
interface EmailData {
  to: string;
  template: string;
  data: Record<string, any>;
  language?: "ar" | "en";

}

export class EmailNotificationService {
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    this.initializeTemplates();

  private initializeTemplates() {
    // Appointment confirmation template
    this.templates.set("appointment_confirmation", {
      subject: "تأكيد الموعد - مركز الحمام",
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>تأكيد الموعد</h2>
          <p>عزيزي/عزيزتي {{patientName}}،</p>
          <p>تم تأكيد موعدك بنجاح مع الدكتور {{doctorName}}.</p>
          <div style="background: #f5f5f5; padding: 15px; margin: 15px 0;">
            <h3>تفاصيل الموعد:</h3>
            <p><strong>التاريخ:</strong> {{appointmentDate}}</p>
            <p><strong>الوقت:</strong> {{appointmentTime}}</p>
            <p><strong>الطبيب:</strong> {{doctorName}}</p>
            <p><strong>التخصص:</strong> {{speciality}}</p>
          </div>
          <p>يرجى الحضور قبل الموعد بـ 15 دقيقة.</p>
          <p>شكراً لاختياركم مركز الحمام.</p>
        </div>
      `,
      text: `
        تأكيد الموعد
        عزيزي/عزيزتي {{patientName}}،
        تم تأكيد موعدك بنجاح مع الدكتور {{doctorName}}.
        
        تفاصيل الموعد:
        التاريخ: {{appointmentDate}}
        الوقت: {{appointmentTime}}
        الطبيب: {{doctorName}}
        التخصص: {{speciality}}
        
        يرجى الحضور قبل الموعد بـ 15 دقيقة.
        شكراً لاختياركم مركز الحمام.
      `,
    });

    // Payment confirmation template
    this.templates.set("payment_confirmation", {
      subject: "تأكيد الدفع - مركز الحمام",
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>تأكيد الدفع</h2>
          <p>عزيزي/عزيزتي {{patientName}}،</p>
          <p>تم استلام دفعتك بنجاح.</p>
          <div style="background: #f5f5f5; padding: 15px; margin: 15px 0;">
            <h3>تفاصيل الدفع:</h3>
            <p><strong>المبلغ:</strong> {{amount}} ريال سعودي</p>
            <p><strong>طريقة الدفع:</strong> {{paymentMethod}}</p>
            <p><strong>رقم المعاملة:</strong> {{transactionId}}</p>
            <p><strong>التاريخ:</strong> {{paymentDate}}</p>
          </div>
          <p>شكراً لاختياركم مركز الحمام.</p>
        </div>
      `,
      text: `
        تأكيد الدفع
        عزيزي/عزيزتي {{patientName}}،
        تم استلام دفعتك بنجاح.
        
        تفاصيل الدفع:
        المبلغ: {{amount}} ريال سعودي
        طريقة الدفع: {{paymentMethod}}
        رقم المعاملة: {{transactionId}}
        التاريخ: {{paymentDate}}
        
        شكراً لاختياركم مركز الحمام.
      `,
    });

    // Appointment reminder template
    this.templates.set("appointment_reminder", {
      subject: "تذكير بالموعد - مركز الحمام",
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <h2>تذكير بالموعد</h2>
          <p>عزيزي/عزيزتي {{patientName}}،</p>
          <p>نذكرك بموعدك غداً مع الدكتور {{doctorName}}.</p>
          <div style="background: #f5f5f5; padding: 15px; margin: 15px 0;">
            <h3>تفاصيل الموعد:</h3>
            <p><strong>التاريخ:</strong> {{appointmentDate}}</p>
            <p><strong>الوقت:</strong> {{appointmentTime}}</p>
            <p><strong>الطبيب:</strong> {{doctorName}}</p>
          </div>
          <p>يرجى الحضور قبل الموعد بـ 15 دقيقة.</p>
          <p>شكراً لاختياركم مركز الحمام.</p>
        </div>
      `,
      text: `
        تذكير بالموعد
        عزيزي/عزيزتي {{patientName}}،
        نذكرك بموعدك غداً مع الدكتور {{doctorName}}.
        
        تفاصيل الموعد:
        التاريخ: {{appointmentDate}}
        الوقت: {{appointmentTime}}
        الطبيب: {{doctorName}}
        
        يرجى الحضور قبل الموعد بـ 15 دقيقة.
        شكراً لاختياركم مركز الحمام.
      `,
    });

  async sendEmail(
    emailData: EmailData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const template = this.templates.get(emailData.template);
      if (!template) {
        return { success: false, error: "Template not found" };

      // Replace template variables
      let subject = template.subject;
      let html = template.html;
      let text = template.text;

      Object.entries(emailData.data).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        subject = subject.replace(regex, String(value));
        html = html.replace(regex, String(value));
        text = text.replace(regex, String(value));
      });

      // In production, this would integrate with an email service like SendGrid, AWS SES, etc.
      if (process.env.NODE_ENV === "development") {
        console.log("Email would be sent:", {
          to: emailData.to,
          subject,
          html,
          text,
        });
        return { success: true };

      // TODO: Implement actual email sending service
      // await emailService.send({
      //   to: emailData.to,
      //   subject,
      //   html,
      //   text
      // });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Email sending failed",
      };
    }

  async sendAppointmentConfirmation(data: {
    patientEmail: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    speciality: string;
  }) {
    return this.sendEmail({
      to: data.patientEmail,
      template: "appointment_confirmation",
      data,
      language: "ar",
    });

  async sendPaymentConfirmation(data: {
    patientEmail: string;
    patientName: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    paymentDate: string;
  }) {
    return this.sendEmail({
      to: data.patientEmail,
      template: "payment_confirmation",
      data,
      language: "ar",
    });

  async sendAppointmentReminder(data: {
    patientEmail: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
  }) {
    return this.sendEmail({
      to: data.patientEmail,
      template: "appointment_reminder",
      data,
      language: "ar",
    });
  }

export const emailService = new EmailNotificationService();
}}}}}}}}}}
