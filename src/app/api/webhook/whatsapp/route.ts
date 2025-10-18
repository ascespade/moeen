import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { logger } from "@/lib/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// POST /api/webhook/whatsapp - استقبال رسائل WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من صحة الطلب
    const verifyToken = request.headers.get("x-verify-token");
    if (verifyToken !== process.env.WHATSAPP_VERIFY_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // معالجة رسائل WhatsApp
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === "messages") {
            for (const message of change.value.messages) {
              await processWhatsAppMessage(message, change.value);
            }
          }
        }
      }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );

// GET /api/webhook/whatsapp - التحقق من webhook
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge);

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });

async function processWhatsAppMessage(message: any, value: any) {
  try {
    const phoneNumber = message.from;
    const messageText = message.text?.body || "";
    const messageId = message.id;

    // البحث عن محادثة موجودة أو إنشاء جديدة
    let { data: conversation } = await supabase
      .from("chatbot_conversations")
      .select("*")
      .eq("whatsapp_number", phoneNumber)
      .eq("conversation_state", "active")
      .single();

    if (!conversation) {
      // إنشاء محادثة جديدة
      const { data: newConversation } = await supabase
        .from("chatbot_conversations")
        .insert({
          whatsapp_number: phoneNumber,
          customer_name: value.contacts?.[0]?.profile?.name || "مجهول",
          conversation_state: "active",
          context_data: {},
        })
        .select()
        .single();

      conversation = newConversation;

    // حفظ الرسالة
    await supabase.from("chatbot_messages").insert({
      conversation_id: conversation.id,
      whatsapp_message_id: messageId,
      sender_type: "customer",
      message_text: messageText,
      message_type: "text",
      is_handled: false,
    });

    // تحديث آخر رسالة
    await supabase
      .from("chatbot_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversation.id);

    // معالجة الرسالة بواسطة AI
    await processMessageWithAI(conversation.id, messageText, phoneNumber);
  } catch (error) {}

async function processMessageWithAI(
  conversationId: string,
  messageText: string,
  phoneNumber: string,
) {
  try {
    // البحث عن النية المناسبة
    const { data: intents } = await supabase
      .from("chatbot_intents")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: true });

    let matchedIntent = null;
    let confidence = 0;

    // البحث عن تطابق في الكلمات المفتاحية
    for (const intent of intents || []) {
      for (const keyword of intent.keywords) {
        if (messageText.toLowerCase().includes(keyword.toLowerCase())) {
          matchedIntent = intent;
          confidence = 0.8;
          break;
        }
      if (matchedIntent) break;

    // إذا لم يتم العثور على نية، استخدم النية العامة
    if (!matchedIntent) {
      matchedIntent =
        intents?.find((i) => i.action_type === "general") || intents?.[0];
      confidence = 0.3;

    let responseText =
      (matchedIntent as any)?.response_template ||
      "مرحباً بك! كيف يمكنني مساعدتك؟";

    // معالجة النية
    if ((matchedIntent as any)?.action_type === "appointment") {
      responseText = await handleAppointmentIntent(
        conversationId,
        messageText,
        phoneNumber,
      );
    } else if ((matchedIntent as any)?.action_type === "cancel") {
      responseText = await handleCancelIntent(
        conversationId,
        messageText,
        phoneNumber,
      );
    } else if ((matchedIntent as any)?.action_type === "reminder") {
      responseText = await handleReminderIntent(
        conversationId,
        messageText,
        phoneNumber,
      );

    // حفظ رد البوت
    await supabase.from("chatbot_messages").insert({
      conversation_id: conversationId,
      sender_type: "bot",
      message_text: responseText,
      message_type: "text",
      intent_id: (matchedIntent as any)?.id,
      confidence_score: confidence,
      is_handled: true,
    });

    // إرسال الرد عبر WhatsApp API
    await sendWhatsAppMessage(phoneNumber, responseText);
  } catch (error) {}

async function handleAppointmentIntent(
  conversationId: string,
  messageText: string,
  phoneNumber: string,
): Promise<string> {
  // منطق حجز المواعيد
  return "أهلاً بك! سأساعدك في حجز موعد جديد. ما نوع الخدمة التي تحتاجها؟\n1️⃣ العلاج الطبيعي\n2️⃣ العلاج النفسي\n3️⃣ العلاج الوظيفي\n4️⃣ الاستشارات الأسرية";

async function handleCancelIntent(
  conversationId: string,
  messageText: string,
  phoneNumber: string,
): Promise<string> {
  // منطق إلغاء المواعيد
  return "أفهم أنك تريد إلغاء موعدك. يرجى إرسال رقم الموعد أو اسمك ورقم هاتفك لتتمكن من إلغاء الموعد.";

async function handleReminderIntent(
  conversationId: string,
  messageText: string,
  phoneNumber: string,
): Promise<string> {
  // منطق تذكير المواعيد
  return "سأتحقق من موعدك القادم. يرجى إرسال اسمك ورقم هاتفك للتحقق من موعدك.";

async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "text",
          text: {
            body: message,
          },
        }),
      },
    );

    if (!response.ok) {
      logger.error("Failed to send WhatsApp message:", await response.text());
    }
  } catch (error) {}
}}}}}}}}}}}}}}}
