/**
 * Slack Integration
 * Handles Slack notifications and webhooks
 */

export interface SlackMessage {
  channel: string;
  text: string;
  blocks?: unknown[];
  attachments?: unknown[];
}

export interface SlackResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class SlackIntegration {
  private webhookUrl = process.env.SLACK_WEBHOOK_URL;
  private botToken = process.env.SLACK_BOT_TOKEN;

  async sendMessage(_message: SlackMessage): Promise<SlackResponse> {
    try {
      if (!this.webhookUrl && !this.botToken) {
        return {
          success: false,
          error: "Slack credentials not configured",
        };
      }

      const __payload = {
        channel: message.channel,
        text: message.text,
        blocks: message.blocks,
        attachments: message.attachments,
      };

      let response;
      if (this.webhookUrl) {
        // Use webhook
        response = await fetch(this.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Use bot token
        response = await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.botToken}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        return {
          success: false,
          error: "Failed to send Slack message",
        };
      }

      const __result = await response.json();
      return {
        success: true,
        messageId: result.ts,
      };
    } catch (error) {
      // // console.error("Slack integration error:", error);
      return {
        success: false,
        error: "Failed to send Slack message",
      };
    }
  }

  async sendNotification(
    channel: string,
    title: string,
    message: string,
    color: string = "good",
  ): Promise<SlackResponse> {
    return this.sendMessage({
      channel,
      text: title,
      attachments: [
        {
          color,
          fields: [
            {
              title,
              value: message,
              short: false,
            },
          ],
        },
      ],
    });
  }
}

export const __slackIntegration = new SlackIntegration();
