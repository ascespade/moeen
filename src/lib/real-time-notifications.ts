import nodemailer from 'nodemailer';
import { _Server } from 'socket.io';
// Real-time Notifications System
import { _Server } from 'socket.io';

export interface NotificationConfig {
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sms: {
    apiKey: string;
    apiSecret: string;
    from: string;
  };
}

export interface Notification {
  id: string;
  type: 'emergency' | 'appointment' | 'reminder' | 'crisis' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  recipient: string;
  title: string;
  message: string;
  data?: unknown;
  sent: boolean;
  createdAt: Date;
  sentAt?: Date;
}

export interface EmergencyAlert {
  patientId: string;
  patientName: string;
  crisisLevel: 'urgent' | 'crisis';
  message: string;
  timestamp: Date;
  location?: string;
}

export class RealTimeNotificationSystem {
  private io: Server;
  private emailTransporter: nodemailer.Transporter;
  private notifications: Map<string, Notification> = new Map();
  private emergencyContacts: Map<string, string[]> = new Map();

  constructor(_io: Server, config: NotificationConfig) {
    this.io = io;

    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: config.email.auth,
    });

    this.initializeEmergencyContacts();
    this.setupSocketHandlers();
  }

  private initializeEmergencyContacts() {
    // Medical team emergency contacts
    this.emergencyContacts.set('medical_team', [
      '+966501234567', // Head doctor
      '+966501234568', // Emergency coordinator
      '+966501234569', // Crisis intervention specialist
    ]);

    // Admin emergency contacts
    this.emergencyContacts.set('admin_team', [
      '+966501234570', // Center director
      '+966501234571', // IT emergency contact
    ]);
  }

  private setupSocketHandlers() {
    this.io.on('connection', socket => {
      // Join user to specific rooms
      socket.on('join-room', (_room: string) => {
        socket.join(room);
      });

      // Handle emergency alerts
      socket.on('emergency-alert', (_alert: EmergencyAlert) => {
        this.handleEmergencyAlert(alert);
      });

      // Handle notification preferences
      socket.on('notification-preferences', (_preferences: unknown) => {
        this.updateNotificationPreferences(socket.id, preferences);
      });

      socket.on('disconnect', () => {});
    });
  }

  // Emergency Alert System
  async handleEmergencyAlert(_alert: EmergencyAlert) {
    const __notificationId = this.generateNotificationId();

    const notification: Notification = {
      id: notificationId,
      type: 'emergency',
      priority: alert.crisisLevel === 'crisis' ? 'critical' : 'high',
      recipient: 'medical_team',
      title: `🚨 Emergency Alert - ${alert.patientName}`,
      message: alert.message,
      data: {
        patientId: alert.patientId,
        patientName: alert.patientName,
        crisisLevel: alert.crisisLevel,
        timestamp: alert.timestamp,
        location: alert.location,
      },
      sent: false,
      createdAt: new Date(),
    };

    this.notifications.set(notificationId, notification);

    // Send immediate notifications
    await this.sendEmergencyNotifications(notification);

    // Broadcast to connected medical team
    this.io.to('medical_team').emit('emergency-alert', {
      id: notificationId,
      alert,
      timestamp: new Date(),
    });

    return notificationId;
  }

  private async sendEmergencyNotifications(_notification: Notification) {
    const medicalTeamContacts =
      this.emergencyContacts.get('medical_team') || [];

    // Send SMS to medical team
    for (const contact of medicalTeamContacts) {
      await this.sendSMS(contact, notification.title, notification.message);
    }

    // Send email to medical team
    await this.sendEmail(
      'medical-team@alhemam.sa',
      notification.title,
      notification.message,
      notification.data
    );

    // Update notification status
    notification.sent = true;
    notification.sentAt = new Date();
  }

  // Appointment Notifications
  async sendAppointmentNotification(
    _patientId: string,
    appointmentData: unknown
  ) {
    const __notificationId = this.generateNotificationId();

    const notification: Notification = {
      id: notificationId,
      type: 'appointment',
      priority: 'medium',
      recipient: patientId,
      title: 'موعد جديد - مركز الهمم',
      message: `تم تأكيد موعدك بتاريخ ${appointmentData.date} في الساعة ${appointmentData.time}`,
      data: appointmentData,
      sent: false,
      createdAt: new Date(),
    };

    this.notifications.set(notificationId, notification);

    // Send to patient
    await this.sendSMS(
      appointmentData.patientPhone,
      notification.title,
      notification.message
    );

    // Notify medical team
    this.io.to('medical_team').emit('appointment-scheduled', {
      patientId,
      appointmentData,
      timestamp: new Date(),
    });

    notification.sent = true;
    notification.sentAt = new Date();

    return notificationId;
  }

  // Reminder Notifications
  async sendReminderNotification(_patientId: string, reminderData: unknown) {
    const __notificationId = this.generateNotificationId();

    const notification: Notification = {
      id: notificationId,
      type: 'reminder',
      priority: 'low',
      recipient: patientId,
      title: 'تذكير - مركز الهمم',
      message: reminderData.message,
      data: reminderData,
      sent: false,
      createdAt: new Date(),
    };

    this.notifications.set(notificationId, notification);

    // Send reminder
    await this.sendSMS(
      reminderData.phone,
      notification.title,
      notification.message
    );

    notification.sent = true;
    notification.sentAt = new Date();

    return notificationId;
  }

  // Crisis Intervention Notifications
  async sendCrisisNotification(_patientId: string, crisisData: unknown) {
    const __notificationId = this.generateNotificationId();

    const notification: Notification = {
      id: notificationId,
      type: 'crisis',
      priority: 'critical',
      recipient: 'crisis_team',
      title: '🚨 Crisis Intervention Required',
      message: `Patient ${crisisData.patientName} requires immediate crisis intervention`,
      data: crisisData,
      sent: false,
      createdAt: new Date(),
    };

    this.notifications.set(notificationId, notification);

    // Send to crisis team
    const __crisisTeamContacts =
      this.emergencyContacts.get('medical_team') || [];
    for (const contact of crisisTeamContacts) {
      await this.sendSMS(contact, notification.title, notification.message);
    }

    // Broadcast to crisis team room
    this.io.to('crisis_team').emit('crisis-intervention', {
      id: notificationId,
      patientId,
      crisisData,
      timestamp: new Date(),
    });

    notification.sent = true;
    notification.sentAt = new Date();

    return notificationId;
  }

  // SMS Sending
  private async sendSMS(_phoneNumber: string, title: string, message: string) {
    try {
      // In real implementation, integrate with SMS provider like Twilio
      return true;
    } catch (error) {
      return false;
    }
  }

  // Email Sending
  private async sendEmail(
    to: string,
    subject: string,
    text: string,
    data?: unknown
  ) {
    try {
      const __mailOptions = {
        from: 'noreply@alhemam.sa',
        to,
        subject,
        text,
        html: this.generateEmailHTML(subject, text, data),
      };

      await this.emailTransporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      return false;
    }
  }

  private generateEmailHTML(
    _subject: string,
    text: string,
    data?: unknown
  ): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F58220, #009688); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>مركز الهمم</h1>
            <h2>${subject}</h2>
          </div>
          <div class="content">
            <p>${text}</p>
            ${data ? `<p><strong>تفاصيل إضافية:</strong></p><pre>${JSON.stringify(data, null, 2)}</pre>` : ''}
          </div>
          <div class="footer">
            <p>مركز الهمم - الحلول الرقمية المتكاملة</p>
            <p>جدة، حي الصفا، شارع الأمير محمد بن عبدالعزيز</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Notification Management
  getNotification(_notificationId: string): Notification | undefined {
    return this.notifications.get(notificationId);
  }

  getAllNotifications(): Notification[] {
    return Array.from(this.notifications.values());
  }

  getNotificationsByType(_type: string): Notification[] {
    return Array.from(this.notifications.values()).filter(n => n.type === type);
  }

  getNotificationsByPriority(_priority: string): Notification[] {
    return Array.from(this.notifications.values()).filter(
      n => n.priority === priority
    );
  }

  // Analytics
  getNotificationStats() {
    const __notifications = Array.from(this.notifications.values());
    return {
      total: notifications.length,
      sent: notifications.filter(n => n.sent).length,
      pending: notifications.filter(n => !n.sent).length,
      byType: notifications.reduce(
        (acc, n) => {
          acc[n.type] = (acc[n.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      byPriority: notifications.reduce(
        (acc, n) => {
          acc[n.priority] = (acc[n.priority] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }

  // Utility Functions
  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateNotificationPreferences(
    _socketId: string,
    preferences: unknown
  ) {
    // Update user notification preferences
  }

  // Broadcast to specific room
  broadcastToRoom(_room: string, event: string, data: unknown) {
    this.io.to(room).emit(event, data);
  }

  // Broadcast to all connected clients
  broadcastToAll(_event: string, data: unknown) {
    this.io.emit(event, data);
  }
}
