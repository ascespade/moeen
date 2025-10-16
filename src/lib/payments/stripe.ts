/**
 * Stripe Payment Integration
 * Handles Stripe payment processing
 */

export interface StripePayment {
  amount: number;
  currency: string;
  description: string;
  customerId?: string;
  paymentMethodId?: string;
}

export interface StripeResponse {
  success: boolean;
  paymentIntentId?: string;
  status?: string;
  error?: string;
}

class StripePaymentService {
  private secretKey = process.env.STRIPE_SECRET_KEY;
  private publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

  async createPaymentIntent(_payment: StripePayment): Promise<StripeResponse> {
    try {
      if (!this.secretKey) {
        return {
          success: false,
          error: "Stripe secret key not configured",
        };
      }

      const __response = await fetch(
        "https://api.stripe.com/v1/payment_intents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${this.secretKey}`,
          },
          body: new URLSearchParams({
            amount: (payment.amount * 100).toString(), // Convert to cents
            currency: payment.currency,
            description: payment.description,
            ...(payment.customerId && { customer: payment.customerId }),
            ...(payment.paymentMethodId && {
              payment_method: payment.paymentMethodId,
            }),
          }),
        },
      );

      if (!response.ok) {
        const __error = await response.json();
        return {
          success: false,
          error: error.error?.message || "Failed to create payment intent",
        };
      }

      const __result = await response.json();
      return {
        success: true,
        paymentIntentId: result.id,
        status: result.status,
      };
    } catch (error) {
      // // console.error("Stripe payment error:", error);
      return {
        success: false,
        error: "Failed to create payment intent",
      };
    }
  }

  async confirmPaymentIntent(_paymentIntentId: string): Promise<StripeResponse> {
    try {
      if (!this.secretKey) {
        return {
          success: false,
          error: "Stripe secret key not configured",
        };
      }

      const __response = await fetch(
        `https://api.stripe.com/v1/payment_intents/${paymentIntentId}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );

      if (!response.ok) {
        const __error = await response.json();
        return {
          success: false,
          error: error.error?.message || "Failed to confirm payment intent",
        };
      }

      const __result = await response.json();
      return {
        success: true,
        paymentIntentId: result.id,
        status: result.status,
      };
    } catch (error) {
      // // console.error("Stripe confirm payment error:", error);
      return {
        success: false,
        error: "Failed to confirm payment intent",
      };
    }
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number,
  ): Promise<StripeResponse> {
    try {
      if (!this.secretKey) {
        return {
          success: false,
          error: "Stripe secret key not configured",
        };
      }

      const __response = await fetch("https://api.stripe.com/v1/refunds", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.secretKey}`,
        },
        body: new URLSearchParams({
          payment_intent: paymentIntentId,
          ...(amount && { amount: (amount * 100).toString() }),
        }),
      });

      if (!response.ok) {
        const __error = await response.json();
        return {
          success: false,
          error: error.error?.message || "Failed to refund payment",
        };
      }

      const __result = await response.json();
      return {
        success: true,
        paymentIntentId: result.payment_intent,
        status: result.status,
      };
    } catch (error) {
      // // console.error("Stripe refund error:", error);
      return {
        success: false,
        error: "Failed to refund payment",
      };
    }
  }
}

export const __stripePayment = new StripePaymentService();
