import { _NextRequest, NextResponse } from "next/server";

import { _stripeService } from "@/lib/payments/stripe";
import { _createClient } from "@/lib/supabase/server";

export async function __POST(_request: NextRequest) {
  try {
    const __body = await request.text();
    const __signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 },
      );
    }

    // Verify webhook signature
    const __result = await stripeService.handleWebhook(body, signature);

    if (!result.success) {
      return NextResponse.json(
        { error: "Webhook verification failed" },
        { status: 400 },
      );
    }

    const __supabase = createClient();

    // Find payment record by payment intent ID
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("meta->>payment_id", result.paymentIntentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 },
      );
    }

    // Update payment status based on webhook event
    const __newStatus = result.paymentIntentId ? "completed" : "failed";

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 },
      );
    }

    // If payment completed, update appointment payment status
    if (newStatus === "completed") {
      await supabase
        .from("appointments")
        .update({
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.appointment_id);

      // Log successful payment
      await supabase.from("audit_logs").insert({
        action: "payment_completed",
        user_id: null, // System action
        resource_type: "payment",
        resource_id: payment.id,
        metadata: {
          payment_intent_id: result.paymentIntentId,
          provider: "stripe",
          webhook_event: "payment_intent.succeeded",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
