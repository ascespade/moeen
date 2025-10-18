import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

let supabase = () => ({} as any)(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/webhook/whatsapp - استقبال رسائل WhatsApp
export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    let body = await request.json();
    
    // التحقق من صحة الطلب
    let verifyToken = request.headers.get('x-verify-token');
    if (verifyToken !== process.env.WHATSAPP_VERIFY_TOKEN) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    // معالجة رسائل WhatsApp
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            for (const message of change.value.messages || []) {
              await processWhatsAppMessage(message, change.value);
            }
          }
        }
      }
    }
    
    return import { NextResponse } from "next/server";.json({ status: 'success' });
  } catch (error) {
    logger.error('WhatsApp webhook error:', error);
    return import { NextResponse } from "next/server";.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// معالجة رسالة WhatsApp
async function processWhatsAppMessage(message: any, value: any) {
  try {
    const from, text, type, timestamp = message;
    
    // حفظ الرسالة في قاعدة البيانات
    const error = await supabase
      .from('whatsapp_messages')
      .insert({
        from_number: from,
        message_text: text?.body || '',
        message_type: type,
        timestamp: new Date(parseInt(timestamp, 10) * 1000).toISOString(),
        raw_data: message,
      });
      
    if (error) {
      logger.error('Error saving WhatsApp message:', error);
      return;
    }
    
    // معالجة الرسالة حسب النوع
    if (type === 'text' && text?.body) {
      await handleTextMessage(from, text.body);
    } else if (type === 'button') {
      await handleButtonMessage(from, message.button);
    } else if (type === 'interactive') {
      await handleInteractiveMessage(from, message.interactive);
    }
    
  } catch (error) {
    logger.error('Error processing WhatsApp message:', error);
  }
}

// معالجة الرسائل النصية
async function handleTextMessage(from: string, text: string) {
  try {
    // البحث عن محادثة موجودة
    const data: conversation = await supabase
      .from('whatsapp_conversations')
      .select('*')
      .eq('phone_number', from)
      .eq('status', 'active')
      .single();
      
    if (conversation) {
      // تحديث المحادثة الموجودة
      await supabase
        .from('whatsapp_conversations')
        .update({
          last_message: text,
          last_message_at: new Date().toISOString(),
          message_count: conversation.message_count + 1,
        })
        .eq('id', conversation.id);
    } else {
      // إنشاء محادثة جديدة
      await supabase
        .from('whatsapp_conversations')
        .insert({
          phone_number: from,
          status: 'active',
          last_message: text,
          last_message_at: new Date().toISOString(),
          message_count: 1,
        });
    }
    
    // معالجة الأوامر الخاصة
    if (text.startsWith('/')) {
      await handleCommand(from, text);
    }
    
  } catch (error) {
    logger.error('Error handling text message:', error);
  }
}

// معالجة رسائل الأزرار
async function handleButtonMessage(from: string, button: any) {
  try {
    const text, payload = button;
    
    // حفظ تفاعل الزر
    await supabase
      .from('whatsapp_interactions')
      .insert({
        phone_number: from,
        interaction_type: 'button',
        button_text: text,
        button_payload: payload,
        timestamp: new Date().toISOString(),
      });
      
    // معالجة الأزرار حسب النوع
    if (payload === 'book_appointment') {
      await handleBookAppointment(from);
    } else if (payload === 'view_services') {
      await handleViewServices(from);
    } else if (payload === 'contact_support') {
      await handleContactSupport(from);
    }
    
  } catch (error) {
    logger.error('Error handling button message:', error);
  }
}

// معالجة الرسائل التفاعلية
async function handleInteractiveMessage(from: string, interactive: any) {
  try {
    const type, list_reply, button_reply = interactive;
    
    if (type === 'list_reply' && list_reply) {
      await handleListReply(from, list_reply);
    } else if (type === 'button_reply' && button_reply) {
      await handleButtonReply(from, button_reply);
    }
    
  } catch (error) {
    logger.error('Error handling interactive message:', error);
  }
}

// معالجة الأوامر
async function handleCommand(from: string, command: string) {
  try {
    const [cmd, ...args] = command.split(' ');
    
    switch (cmd) {
      case '/start':
        await sendWelcomeMessage(from);
        break;
      case '/help':
        await sendHelpMessage(from);
        break;
      case '/appointment':
        await handleBookAppointment(from);
        break;
      case '/services':
        await handleViewServices(from);
        break;
      case '/contact':
        await handleContactSupport(from);
        break;
      default:
        await sendUnknownCommandMessage(from);
    }
    
  } catch (error) {
    logger.error('Error handling command:', error);
  }
}

// إرسال رسالة ترحيب
async function sendWelcomeMessage(from: string) {
  // Implementation for sending welcome message
  logger.info(`Sending welcome message to ${from}`
}

// إرسال رسالة مساعدة
async function sendHelpMessage(from: string) {
  // Implementation for sending help message
  logger.info(`Sending help message to ${from}`
}

// معالجة حجز موعد
async function handleBookAppointment(from: string) {
  // Implementation for booking appointment
  logger.info(`Handling appointment booking for ${from}`
}

// معالجة عرض الخدمات
async function handleViewServices(from: string) {
  // Implementation for viewing services
  logger.info(`Handling view services for ${from}`
}

// معالجة التواصل مع الدعم
async function handleContactSupport(from: string) {
  // Implementation for contact support
  logger.info(`Handling contact support for ${from}`
}

// إرسال رسالة أمر غير معروف
async function sendUnknownCommandMessage(from: string) {
  // Implementation for unknown command message
  logger.info(`Sending unknown command message to ${from}`
}

// معالجة رد القائمة
async function handleListReply(from: string, listReply: any) {
  // Implementation for list reply
  logger.info(`Handling list reply for ${from}:`
}

// معالجة رد الزر
async function handleButtonReply(from: string, buttonReply: any) {
  // Implementation for button reply
  logger.info(`Handling button reply for ${from}:`
}