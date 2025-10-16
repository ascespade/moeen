interface MoyasarConfig {
  apiKey: string;
  baseUrl: string;
}

interface MoyasarPaymentData {
  amount: number;
  currency: string;
  description: string;
  patientId: string;
  appointmentId: string;
  metadata?: Record<string, string>;
}

interface MoyasarPaymentResult {
  success: boolean;
  paymentId?: string;
  status?: string;
  error?: string;
}

export class MoyasarPaymentService {
  private config: MoyasarConfig;

  constructor() {
    this.config = {
      apiKey: process.env.MOYASAR_SECRET_KEY!,
      baseUrl: "https://api.moyasar.com/v1",
    };
  }

  async createPayment(
    _data: MoyasarPaymentData,
  ): Promise<MoyasarPaymentResult> {
    try {
      const __response = await fetch(`${this.config.baseUrl}/payments`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(this.config.apiKey + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(data.amount * 100), // Convert to halalas
          currency: data.currency.toLowerCase(),
          description: data.description,
          metadata: {
            patient_id: data.patientId,
            appointment_id: data.appointmentId,
            ...data.metadata,
          },
        }),
      });

      const __result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Payment creation failed",
        };
      }

      return {
        success: true,
        paymentId: result.id,
        status: result.status,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment creation failed",
      };
    }
  }

  async getPayment(_paymentId: string): Promise<MoyasarPaymentResult> {
    try {
      const __response = await fetch(
        `${this.config.baseUrl}/payments/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(this.config.apiKey + ":").toString("base64")}`,
          },
        },
      );

      const __result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Payment retrieval failed",
        };
      }

      return {
        success: true,
        paymentId: result.id,
        status: result.status,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment retrieval failed",
      };
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<MoyasarPaymentResult> {
    try {
      const __response = await fetch(
        `${this.config.baseUrl}/payments/${paymentId}/refund`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(this.config.apiKey + ":").toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount ? Math.round(amount * 100) : undefined,
          }),
        },
      );

      const __result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Refund failed",
        };
      }

      return {
        success: true,
        paymentId: result.id,
        status: result.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      };
    }
  }

  async handleWebhook(_payload: unknown): Promise<MoyasarPaymentResult> {
    try {
      // Moyasar webhook validation would go here
      const __event = payload;

      switch (event.type) {
        case "payment.succeeded":
          return {
            success: true,
            paymentId: event.data.id,
            status: "succeeded",
          };

        case "payment.failed":
          return {
            success: false,
            error: `Payment failed: ${event.data.failure_reason}`,
          };

        default:
          return {
            success: true,
            paymentId: "unknown_event",
          };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Webhook processing failed",
      };
    }
  }
}

export const __moyasarService = new MoyasarPaymentService();
