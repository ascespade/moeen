import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

export interface PaymentIntentData {
  amount: number;
  currency: string;
  patientId: string;
  appointmentId: string;
  metadata?: Record<string, string>;

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;

export class StripePaymentService {
  async createPaymentIntent(data: PaymentIntentData): Promise<PaymentResult> {
    if (!stripe) {
      return {
        success: false,
        error: "Stripe not configured",
      };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        metadata: {
          patient_id: data.patientId,
          appointment_id: data.appointmentId,
          ...data.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment creation failed",
      };
    }

  async confirmPayment(paymentIntentId: string): Promise<PaymentResult> {
    if (!stripe) {
      return {
        success: false,
        error: "Stripe not configured",
      };

    try {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        return {
          success: true,
          paymentIntentId: paymentIntent.id,
        };

      return {
        success: false,
        error: `Payment not completed. Status: ${paymentIntent.status}`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment confirmation failed",
      };
    }

  async refundPayment(
    paymentIntentId: string,
    amount?: number,
  ): Promise<PaymentResult> {
    if (!stripe) {
      return {
        success: false,
        error: "Stripe not configured",
      };

    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        success: true,
        paymentIntentId: refund.payment_intent as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      };
    }

  async handleWebhook(
    payload: string,
    signature: string,
  ): Promise<PaymentResult> {
    if (!stripe) {
      return {
        success: false,
        error: "Stripe not configured",
      };

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          return {
            success: true,
            paymentIntentId: paymentIntent.id,
          };

        case "payment_intent.payment_failed":
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          return {
            success: false,
            error: `Payment failed: ${failedPayment.last_payment_error?.message}`,
          };

        default:
          return {
            success: true,
            paymentIntentId: "unknown_event",
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

export const stripeService = new StripePaymentService();
}}}}}}}}}}}
