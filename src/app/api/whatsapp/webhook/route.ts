import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppIntegration } from '@/lib/whatsapp-integration';
import { HemamAssistant } from '@/lib/ai-assistant';
import { FlowManager } from '@/lib/conversation-flows';

const whatsapp = new WhatsAppIntegration();
const assistant = new HemamAssistant();
const flowManager = new FlowManager();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook (in production, verify signature)
    const { entry } = body;
    
    if (!entry || !Array.isArray(entry)) {
      return NextResponse.json({ success: false, error: 'Invalid webhook data' }, { status: 400 });
    }

    for (const entryItem of entry) {
      const { changes } = entryItem;
      
      if (changes && Array.isArray(changes)) {
        for (const change of changes) {
          const { value } = change;
          
          if (value && value.messages) {
            for (const message of value.messages) {
              await processIncomingMessage(message);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Webhook processing failed' 
      },
      { status: 500 }
    );
  }
}

async function processIncomingMessage(message: any) {
  try {
    const from = message.from;
    const content = message.text?.body || '';
    const messageType = message.type;

    // Process the message
    const response = await whatsapp.processIncomingMessage(from, content, messageType);
    
    // Send response back
    await whatsapp.sendMessage(from, response);

    // Log interaction
    console.log(`Processed WhatsApp message from ${from}: ${content} -> ${response}`);

  } catch (error) {
    console.error('Error processing incoming message:', error);
    
    // Send error response
    await whatsapp.sendMessage(
      message.from, 
      'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.'
    );
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify the webhook
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid verification' }, { status: 403 });
}