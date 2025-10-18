
// Slack Integration System for Hemam Center
export interface SlackMessage {
  id: string;
  channel: string;
  user: string;
  text: string;
  timestamp: string;
  thread_ts?: string;
  blocks?: any[];
  attachments?: any[];
}

export interface SlackChannel {
  id: string;
  name: string;
  type: "public" | "private" | "im" | "mpim";
  purpose?: string;
  members: string[];
  is_archived: boolean;
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  email?: string;
  phone?: string;
  is_bot: boolean;
  is_admin: boolean;
  profile: {
    title?: string;
    phone?: string;
    image_original?: string;
  };
}

export interface SlackAppointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  channel_id: string;
  thread_ts?: string;
  created_at: string;
}

export interface SlackNotification {
  type:
    | "appointment_reminder"
    | "appointment_confirmed"
    | "appointment_cancelled"
    | "patient_message"
    | "doctor_response"
    | "emergency_alert";
  recipient: string;
  message: string;
  data?: any;
  priority: "low" | "medium" | "high" | "urgent";
}

export class SlackIntegration {
  private botToken: string;
  private appToken: string;
  private channels: Map<string, SlackChannel> = new Map();
  private users: Map<string, SlackUser> = new Map();
  private appointments: Map<string, SlackAppointment> = new Map();

  constructor() {
    this.botToken = process.env.SLACK_BOT_TOKEN || "";
    this.appToken = process.env.SLACK_APP_TOKEN || "";
  }

  // Initialize Slack connection
  async initialize(): Promise<boolean> {
    try {
      // Test bot token
      const botTest = await this.makeSlackRequest("auth.test");
      if (!botTest.ok) {
        return false;
      }

      // Load channels and users
      await this.loadChannels();
      await this.loadUsers();

      return true;
    } catch (error) {
      return false;
    }
  }

  // Load channels
  private async loadChannels(): Promise<void> {
    try {
      const response = await this.makeSlackRequest("conversations.list", {
        types: "public_channel,private_channel,mpim,im",
        limit: 1000,
      });

      if (response.ok && response.channels) {
        response.channels.forEach((channel: any) => {
          this.channels.set(channel.id, {
            id: channel.id,
            name: channel.name,
            type: channel.is_im
              ? "im"
              : channel.is_mpim
                ? "mpim"
                : channel.is_private
                  ? "private"
                  : "public",
            purpose: channel.purpose?.value,
            members: channel.members || [],
            is_archived: channel.is_archived || false,
          });
        });
      }
    } catch (error) {}
  }

  // Load users
  private async loadUsers(): Promise<void> {
    try {
      const response = await this.makeSlackRequest("users.list", {
        limit: 1000,
      });

      if (response.ok && response.members) {
        response.members.forEach((user: any) => {
          this.users.set(user.id, {
            id: user.id,
            name: user.name,
            real_name: user.real_name,
            email: user.profile?.email,
            phone: user.profile?.phone,
            is_bot: user.is_bot || false,
            is_admin: user.is_admin || false,
            profile: {
              title: user.profile?.title,
              phone: user.profile?.phone,
              image_original: user.profile?.image_original,
            },
          });
        });
      }
    } catch (error) {}
  }

  // Send message to Slack
  async sendMessage(
    channel: string,
    text: string,
    options: {
      thread_ts?: string;
      blocks?: any[];
      attachments?: any[];
      username?: string;
      icon_emoji?: string;
    } = {},
  ): Promise<string | null> {
    try {
      const response = await this.makeSlackRequest("chat.postMessage", {
        channel,
        text,
        ...options,
      });

      if (response.ok) {
        return response.ts;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // Send appointment notification
  async sendAppointmentNotification(
    appointmentId: string,
    type: "created" | "confirmed" | "cancelled" | "reminder",
    appointment: any,
    doctor: any,
    patient: any,
  ): Promise<void> {
    try {
      const channel = this.getAppointmentChannel(doctor.id);
      if (!channel) {
        return;
      }

      let message = "";
      let blocks: any[] = [];

      switch (type) {
        case "created":
          message = `📅 موعد جديد تم حجزه`;
          blocks = this.createAppointmentBlocks(
            appointment,
            doctor,
            patient,
            "new",
          );
          break;
        case "confirmed":
          message = `✅ تم تأكيد الموعد`;
          blocks = this.createAppointmentBlocks(
            appointment,
            doctor,
            patient,
            "confirmed",
          );
          break;
        case "cancelled":
          message = `❌ تم إلغاء الموعد`;
          blocks = this.createAppointmentBlocks(
            appointment,
            doctor,
            patient,
            "cancelled",
          );
          break;
        case "reminder":
          message = `⏰ تذكير بالموعد`;
          blocks = this.createAppointmentBlocks(
            appointment,
            doctor,
            patient,
            "reminder",
          );
          break;
      }

      await this.sendMessage(channel, message, { blocks });
    } catch (error) {}
  }

  // Send patient message to doctor
  async sendPatientMessage(
    patientId: string,
    doctorId: string,
    message: string,
    channel: "whatsapp" | "website",
  ): Promise<void> {
    try {
      const doctorChannel = this.getAppointmentChannel(doctorId);
      if (!doctorChannel) {
        return;
      }

      const blocks = [
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*رسالة من المريض عبر ${channel === "whatsapp" ? "واتساب" : "الموقع"}*\n\n${message}`,
          },
        },
          type: "context",
          elements: [
              type: "mrkdwn",
              text: `المريض: ${patientId} | القناة: ${channel}`,
            },
          ],
        },
      ];

      await this.sendMessage(doctorChannel, `رسالة من المريض`, { blocks });
    } catch (error) {}
  }

  // Send doctor response to patient
  async sendDoctorResponse(
    patientId: string,
    doctorId: string,
    response: string,
    originalMessageId?: string,
  ): Promise<void> {
    try {
      // This would integrate with WhatsApp or website chatbot
      // For now, we'll just log it
      // In a real implementation, this would:
      // 1. Send via WhatsApp API if the conversation started there
      // 2. Send via website chatbot if the conversation started there
      // 3. Update the conversation thread in Slack
    } catch (error) {}
  }

  // Create appointment blocks for Slack
  private createAppointmentBlocks(
    appointment: any,
    doctor: any,
    patient: any,
    status: string,
  ): any[] {
    const statusEmoji = {
      new: "🆕",
      confirmed: "✅",
      cancelled: "❌",
      reminder: "⏰",
    };

    const statusText = {
      new: "موعد جديد",
      confirmed: "تم التأكيد",
      cancelled: "تم الإلغاء",
      reminder: "تذكير",
    };

    return [
        type: "header",
        text: {
          type: "plain_text",
          text: `${statusEmoji[status]} ${statusText[status]}`,
        },
      },
        type: "section",
        fields: [
            type: "mrkdwn",
            text: `*المريض:*\n${patient.first_name} ${patient.last_name}`,
          },
            type: "mrkdwn",
            text: `*الطبيب:*\nد. ${doctor.first_name} ${doctor.last_name}`,
          },
            type: "mrkdwn",
            text: `*التاريخ:*\n${new Date(appointment.appointment_date).toLocaleDateString("ar-SA")}`,
          },
            type: "mrkdwn",
            text: `*الوقت:*\n${appointment.appointment_time}`,
          },
            type: "mrkdwn",
            text: `*التخصص:*\n${doctor.specialty}`,
          },
            type: "mrkdwn",
            text: `*الحالة:*\n${appointment.status}`,
          },
        ],
      },
        type: "actions",
        elements: [
            type: "button",
            text: {
              type: "plain_text",
              text: "عرض التفاصيل",
            },
            action_id: "view_appointment",
            value: appointment.id,
          },
            type: "button",
            text: {
              type: "plain_text",
              text: "رد على المريض",
            },
            action_id: "reply_to_patient",
            value: `${appointment.id}_${patient.id}`,
          },
        ],
      },
    ];
  }

  // Get or create appointment channel for doctor
  private getAppointmentChannel(doctorId: string): string | null {
    // In a real implementation, this would:
    // 1. Check if doctor has a dedicated channel
    // 2. Create one if it doesn't exist
    // 3. Return the channel ID

    // For now, return a general appointments channel
    return process.env.SLACK_APPOINTMENTS_CHANNEL || "general";
  }

  // Create doctor channel
  async createDoctorChannel(
    doctorId: string,
    doctorName: string,
  ): Promise<string | null> {
    try {
      const channelName = `doctor-${doctorId}`;
      const response = await this.makeSlackRequest("conversations.create", {
        name: channelName,
        is_private: true,
      });

      if (response.ok) {
        return response.channel.id;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // Handle Slack events
  async handleSlackEvent(event: any): Promise<void> {
    try {
      switch (event.type) {
        case "message":
          await this.handleMessage(event);
          break;
        case "app_mention":
          await this.handleAppMention(event);
          break;
        case "interactive_message":
          await this.handleInteractiveMessage(event);
          break;
        default:
      }
    } catch (error) {}
  }

  // Handle incoming messages
  private async handleMessage(event: any): Promise<void> {
    // Skip bot messages and messages without text
    if (event.bot_id || !event.text) return;

    // Check if this is a doctor responding to a patient
    const threadTs = event.thread_ts || event.ts;
    const isInThread = event.thread_ts;

    if (isInThread) {
      // This is a response in a thread - likely a doctor responding
      await this.handleDoctorResponse(event);
    }
  }

  // Handle app mentions
  private async handleAppMention(event: any): Promise<void> {
    // Handle when the bot is mentioned
  }

  // Handle interactive messages (button clicks, etc.)
  private async handleInteractiveMessage(event: any): Promise<void> {
    const action = event.actions[0];

    switch (action.action_id) {
      case "view_appointment":
        await this.handleViewAppointment(action.value);
        break;
      case "reply_to_patient":
        await this.handleReplyToPatient(action.value);
        break;
    }
  }

  // Handle doctor response
  private async handleDoctorResponse(event: any): Promise<void> {
    // Extract appointment and patient info from thread context
    // Send response back to patient via appropriate channel
  }

  // Handle view appointment action
  private async handleViewAppointment(appointmentId: string): Promise<void> {
    // Show detailed appointment information
  }

  // Handle reply to patient action
  private async handleReplyToPatient(value: string): Promise<void> {
    // Open a dialog or thread for doctor to respond
  }

  // Make Slack API request
  private async makeSlackRequest(
    method: string,
    params: any = {},
  ): Promise<any> {
    const url = `https://slack.com/api/${method}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    return await response.json();
  }

  // Get channel by name
  getChannelByName(name: string): SlackChannel | undefined {
    return Array.from(this.channels.values()).find(
      (channel) => channel.name === name,
    );
  }

  // Get user by name
  getUserByName(name: string): SlackUser | undefined {
    return Array.from(this.users.values()).find((user) => user.name === name);
  }

  // Get all channels
  getAllChannels(): SlackChannel[] {
    return Array.from(this.channels.values());
  }

  // Get all users
  getAllUsers(): SlackUser[] {
    return Array.from(this.users.values());
  }

  // Send emergency alert
  async sendEmergencyAlert(
    message: string,
    channel: string = "general",
  ): Promise<void> {
    const blocks = [
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 تنبيه طارئ",
        },
      },
        type: "section",
        text: {
          type: "mrkdwn",
          text: message,
        },
      },
    ];

    await this.sendMessage(channel, "تنبيه طارئ", { blocks });
  }

  // Send daily summary
  async sendDailySummary(channel: string = "general"): Promise<void> {
    // This would generate a daily summary of appointments, messages, etc.
    const message = "📊 ملخص يومي للمواعيد والرسائل";
    await this.sendMessage(channel, message);
  }
}
