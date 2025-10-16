/**
 * WhatsApp Business API Integration
 * Handles WhatsApp messaging and notifications
 */

export interface WhatsAppMessage {
  to: string;
  type: "text" | "template" | "media";
  content: {
    text?: string;
    template?: {
      name: string;
      language: string;
      components: Array<{
        type: string;
        parameters: Array<{
          type: string;
          text: string;
        }>;
      }>;
    };
    media?: {
      type: "image" | "document" | "audio" | "video";
      url: string;
      caption?: string;
    };
  };
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class WhatsAppBusinessAPI {
  private apiUrl = "https://graph.facebook.com/v18.0";
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  async sendMessage(_message: WhatsAppMessage): Promise<WhatsAppResponse> {
    try {
      if (!this.phoneNumberId || !this.accessToken) {
        return {
          success: false,
          error: "WhatsApp API credentials not configured",
        };
      }

      const __response = await fetch(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: message.to,
            type: message.type,
            [message.type]: message.content[message.type],
          }),
        },
      );

      if (!response.ok) {
        const __error = await response.json();
        return {
          success: false,
          error: error.error?.message || "Failed to send WhatsApp message",
        };
      }

      const __result = await response.json();
      return {
        success: true,
        messageId: result.messages?.[0]?.id,
      };
    } catch (error) {
      // // console.error("WhatsApp API error:", error);
      return {
        success: false,
        error: "Failed to send WhatsApp message",
      };
    }
  }

  async sendTextMessage(_to: string, text: string): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: "text",
      content: { text },
    });
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    language: string = "ar",
    parameters: string[] = [],
  ): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: "template",
      content: {
        template: {
          name: templateName,
          language,
          components: [
            {
              type: "body",
              parameters: parameters.map((param) => ({
                type: "text",
                text: param,
              })),
            },
          ],
        },
      },
    });
  }

  async sendMediaMessage(
    to: string,
    mediaType: "image" | "document" | "audio" | "video",
    url: string,
    caption?: string,
  ): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: "media",
      content: {
        media: {
          type: mediaType,
          url,
          caption,
        },
      },
    });
  }

  async markAsRead(_messageId: string): Promise<boolean> {
    try {
      const __response = await fetch(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            status: "read",
            message_id: messageId,
          }),
        },
      );

      return response.ok;
    } catch (error) {
      // // console.error("WhatsApp mark as read error:", error);
      return false;
    }
  }
}

// Create global WhatsApp service
export const __whatsappAPI = new WhatsAppBusinessAPI();
