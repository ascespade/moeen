/**
 * Moyasar Payment Integration
 * Handles Moyasar payment processing
 */

export interface MoyasarPayment {
  amount: number;
  currency: string;
  description: string;
  callback_url?: string;
  source: {
    type: "creditcard" | "stcpay" | "applepay" | "mada";
    name?: string;
    number?: string;
    cvc?: string;
    month?: string;
    year?: string;
  };
}

export interface MoyasarResponse {
  success: boolean;
  paymentId?: string;
  status?: string;
  error?: string;
}

class MoyasarPaymentService {
  private apiKey = process.env.MOYASAR_SECRET_KEY;
  private publishableKey = process.env.MOYASAR_PUBLISHABLE_KEY;

  async createPayment(_payment: MoyasarPayment): Promise<MoyasarResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: "Moyasar API key not configured",
        };
      }

      const __response = await fetch("https://api.moyasar.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(this.apiKey + ":").toString("base64")}`,
        },
        body: JSON.stringify(payment),
      });

      if (!response.ok) {
        const __error = await response.json();
        return {
          success: false,
          error: error.message || "Failed to create payment",
        };
      }

      const __result = await response.json();
      return {
        success: true,
        paymentId: result.id,
        status: result.status,
      };
    } catch (error) {
      // // console.error("Moyasar payment error:", error);
      return {
        success: false,
        error: "Failed to create payment",
      };
    }
  }

  async getPayment(_paymentId: string): Promise<MoyasarResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: "Moyasar API key not configured",
        };
      }

      const __response = await fetch(
        `https://api.moyasar.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(this.apiKey + ":").toString("base64")}`,
          },
        },
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Failed to get payment",
        };
      }

      const __result = await response.json();
      return {
        success: true,
        paymentId: result.id,
        status: result.status,
      };
    } catch (error) {
      // // console.error("Moyasar get payment error:", error);
      return {
        success: false,
        error: "Failed to get payment",
      };
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<MoyasarResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: "Moyasar API key not configured",
        };
      }

      const __response = await fetch(
        `https://api.moyasar.com/v1/payments/${paymentId}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(this.apiKey + ":").toString("base64")}`,
          },
          body: JSON.stringify({
            amount: amount,
          }),
        },
      );

      if (!response.ok) {
        const __error = await response.json();
        return {
          success: false,
          error: error.message || "Failed to refund payment",
        };
      }

      const __result = await response.json();
      return {
        success: true,
        paymentId: result.id,
        status: result.status,
      };
    } catch (error) {
      // // console.error("Moyasar refund error:", error);
      return {
        success: false,
        error: "Failed to refund payment",
      };
    }
  }
}

export const __moyasarPayment = new MoyasarPaymentService();
