
// WhatsApp Business API Integration
export interface WhatsAppMessage {
  to: string;
  type: "text" | "template" | "image" | "document" | "audio" | "video";
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: "body";
      parameters: Array<{
        type: "text";
        text: string;
      }>;
    }>;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    filename: string;
    caption?: string;
  };

export interface WhatsAppTemplate {
  name: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DISABLED";
  category: "AUTHENTICATION" | "MARKETING" | "UTILITY";
  language: string;
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
    text?: string;
    buttons?: Array<{
      type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;

export interface WhatsAppWebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: {
            body: string;
          };
          image?: {
            id: string;
            mime_type: string;
            sha256: string;
          };
          audio?: {
            id: string;
            mime_type: string;
            sha256: string;
          };
          document?: {
            id: string;
            mime_type: string;
            sha256: string;
            filename: string;
          };
        }>;
        statuses?: Array<{
          id: string;
          status: "sent" | "delivered" | "read" | "failed";
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;

export class WhatsAppBusinessAPI {
  private accessToken: string;
  private phoneNumberId: string;
  private businessAccountId: string;
  private apiVersion: string;
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
    this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "";
    this.apiVersion = "v18.0";
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

  // Send Text Message
  async sendTextMessage(
    to: string,
    message: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: {
              body: message,
            },
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: data.messages[0].id,
        };
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to send message",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

  // Send Template Message
  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = "ar",
    {
    parameters: string[] = [],
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const messageData: any = {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
        },
      };

      // Add parameters if provided
      if (parameters.length > 0) {
        messageData.template.components = [
      },
            {
            type: "body",
            parameters: parameters.map((param) => ({
              type: "text",
              text: param,
            })),
          },
        ];

      const response = await fetch(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: data.messages[0].id,
        };
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to send template message",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

  // Send Image Message
  async sendImageMessage(
    to: string,
    imageUrl: string,
    caption?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "image",
            image: {
              link: imageUrl,
              caption: caption,
            },
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: data.messages[0].id,
        };
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to send image message",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

  // Send Document Message
  async sendDocumentMessage(
    to: string,
    documentUrl: string,
    filename: string,
    caption?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "document",
            document: {
              link: documentUrl,
              filename: filename,
              caption: caption,
            },
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: data.messages[0].id,
        };
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to send document message",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

  // Get Message Status
  async getMessageStatus(
    messageId: string,
  ): Promise<{ status: string; timestamp: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${messageId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          status: data.status,
          timestamp: data.timestamp,
        };

      return null;
    } catch (error) {
      return null;
    }

  // Get Templates
  async getTemplates(): Promise<WhatsAppTemplate[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.businessAccountId}/message_templates`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        return data.data || [];

      return [];
    } catch (error) {
      return [];
    }

  // Create Template
  async createTemplate(
    template: Omit<WhatsAppTemplate, "status">,
  ): Promise<{ success: boolean; templateId?: string; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.businessAccountId}/message_templates`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(template),
        },
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          templateId: data.id,
        };
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to create template",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }

  // Process Webhook Event
  processWebhookEvent(event: WhatsAppWebhookEvent): {
    messages: Array<{
      from: string;
      messageId: string;
      timestamp: string;
      type: string;
      content: any;
    }>;
    statuses: Array<{
      messageId: string;
      status: string;
      timestamp: string;
      recipientId: string;
    }>;
  } {
    const messages: any[] = [];
    const statuses: any[] = [];

    event.entry.forEach((entry) => {
      entry.changes.forEach((change) => {
        if (change.value.messages) {
          change.value.messages.forEach((message) => {
            messages.push({
              {
              from: message.from,
              messageId: message.id,
              timestamp: message.timestamp,
              type: message.type,
              content:
                message.text ||
                message.image ||
                message.audio ||
                message.document,
            });
          });

        if (change.value.statuses) {
          change.value.statuses.forEach((status) => {
            statuses.push({
              messageId: status.id,
              status: status.status,
              timestamp: status.timestamp,
              recipientId: status.recipient_id,
            });
          });
        }
      });
    });

    return { messages, statuses };

  // Verify Webhook
  verifyWebhook(mode: string, token: string, _challenge: string): boolean {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    return mode === "subscribe" && token === verifyToken;

  // Get Business Profile
  async getBusinessProfile(): Promise<{
    {
    success: boolean;
    profile?: any;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          profile: data,
        };
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to get business profile",
        };
      }
    } catch (error) {
      return {
        {
        success: false,
        error: (error as Error).message,
      };
    }

  // Update Business Profile
  async updateBusinessProfile(profileData: {
    {
    messaging_product: string;
    about?: string;
    address?: string;
    description?: string;
    email?: string;
    website?: string[];
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to update business profile",
        };
      }
    } catch (error) {
      return {
        {
        success: false,
        error: (error as Error).message,
      };
    }
  }

export const whatsappAPI = new WhatsAppBusinessAPI();
}}}}}}}}}}}}}}}}}}
