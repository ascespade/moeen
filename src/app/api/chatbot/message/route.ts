import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlowManager } from '@/lib/conversation-flows';

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationId, currentFlow, currentStep } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const flowManager = new FlowManager();

    // تحديد الـ Flow المناسب
    let activeFlow = currentFlow;
    let activeStep = currentStep;

    if (!activeFlow) {
      // تحليل النية لتحديد الـ Flow المناسب
      const intent = await analyzeIntent(message);
      activeFlow = getFlowByIntent(intent.type);
      activeStep = 'start';
    }

    // تنفيذ الـ Flow
    const flow = flowManager.getFlow(activeFlow);
    if (!flow) {
      // Fallback إلى النظام القديم
      return await handleLegacyResponse(message, userId, conversationId, supabase);
    }

    // الحصول على الخطوة التالية
    const nextStep = flowManager.getNextStep(activeFlow, activeStep, message);
    
    if (!nextStep) {
      return NextResponse.json({
        message: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        metadata: { flow: activeFlow, step: activeStep },
        appointmentSuggestions: []
      });
    }

    // تنفيذ إجراءات الخطوة (Slack notifications, WhatsApp, etc.)
    await flowManager.executeStepAction(nextStep, {
      userId,
      conversationId,
      message,
      appointmentId: null // سيتم تحديده من السياق
    });

    // حفظ المحادثة
    await saveConversation(conversationId, userId, message, nextStep.content, supabase);

    return NextResponse.json({
      message: nextStep.content,
      metadata: { 
        flow: activeFlow, 
        step: nextStep.id,
        nextStep: nextStep.nextStep,
        options: nextStep.options
      },
      appointmentSuggestions: nextStep.type === 'information' && nextStep.content.includes('المواعيد المتاحة') 
        ? await getAvailableAppointments(supabase) 
        : []
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// تحديد الـ Flow بناءً على النية
function getFlowByIntent(intentType: string): string {
  const flowMap: { [key: string]: string } = {
    'appointment_booking': 'appointment_slack',
    'appointment_inquiry': 'appointment_management',
    'appointment_cancellation': 'appointment_management',
    'general_inquiry': 'continuous_support',
    'greeting': 'new_beneficiary',
    'emergency': 'emergency_slack',
    'doctor_communication': 'doctor_communication'
  };
  
  return flowMap[intentType] || 'continuous_support';
}

// النظام القديم كـ fallback
async function handleLegacyResponse(message: string, userId: string, conversationId: string, supabase: any) {
  const intent = await analyzeIntent(message);
  
  let response = '';
  let metadata = {};
  let appointmentSuggestions = [];

  switch (intent.type) {
    case 'appointment_booking':
      response = await handleAppointmentBooking(message, userId, supabase);
      appointmentSuggestions = await getAvailableAppointments(supabase);
      break;
    
    case 'appointment_inquiry':
      response = await handleAppointmentInquiry(userId, supabase);
      break;
    
    case 'appointment_cancellation':
      response = await handleAppointmentCancellation(message, userId, supabase);
      break;
    
    case 'general_inquiry':
      response = await handleGeneralInquiry(message);
      break;
    
    case 'greeting':
      response = 'مرحباً! أنا معين، مساعدك الذكي في مركز الهمم. كيف يمكنني مساعدتك اليوم؟';
      break;
    
    default:
      response = 'عذراً، لم أفهم طلبك. يمكنني مساعدتك في حجز المواعيد، الاستعلام عن مواعيدك، أو الإجابة على استفساراتك العامة.';
  }

  // حفظ المحادثة
  await saveConversation(conversationId, userId, message, response, supabase);

  return NextResponse.json({
    message: response,
    metadata,
    appointmentSuggestions,
    intent: intent.type
  });
}

async function analyzeIntent(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // كلمات مفتاحية لحجز المواعيد
  const appointmentKeywords = ['حجز', 'موعد', 'جدولة', 'تحديد موعد', 'أريد موعد'];
  const inquiryKeywords = ['استعلام', 'مواعيدي', 'موعدي', 'متى موعدي'];
  const cancellationKeywords = ['إلغاء', 'إلغاء موعد', 'إلغاء الموعد'];
  const greetingKeywords = ['مرحبا', 'السلام', 'أهلا', 'صباح الخير', 'مساء الخير'];
  
  if (appointmentKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { type: 'appointment_booking', confidence: 0.9 };
  }
  
  if (inquiryKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { type: 'appointment_inquiry', confidence: 0.9 };
  }
  
  if (cancellationKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { type: 'appointment_cancellation', confidence: 0.9 };
  }
  
  if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { type: 'greeting', confidence: 0.8 };
  }
  
  // استفسارات عامة
  const generalKeywords = ['ساعات', 'العمل', 'العنوان', 'الهاتف', 'الموقع', 'معلومات'];
  if (generalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { type: 'general_inquiry', confidence: 0.7 };
  }
  
  return { type: 'unknown', confidence: 0.3 };
}

async function handleAppointmentBooking(message: string, userId: string | null, supabase: any) {
  if (!userId) {
    return 'عذراً، يجب عليك تسجيل الدخول أولاً لحجز موعد. يرجى تسجيل الدخول أو إنشاء حساب جديد.';
  }

  // استخراج معلومات الموعد من الرسالة
  const appointmentInfo = extractAppointmentInfo(message);
  
  if (!appointmentInfo.doctorName && !appointmentInfo.specialty) {
    return 'أفهم أنك تريد حجز موعد. من فضلك أخبرني: ما هو نوع التخصص الذي تريده؟ (مثل: قلب، عظام، أطفال، إلخ)';
  }

  return 'ممتاز! دعني أتحقق من المواعيد المتاحة لك. سأعرض عليك الأطباء المتاحين والأوقات المناسبة.';
}

async function handleAppointmentInquiry(userId: string | null, supabase: any) {
  if (!userId) {
    return 'عذراً، يجب عليك تسجيل الدخول أولاً للاستعلام عن مواعيدك.';
  }

  try {
    // جلب مواعيد المريض
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctors!appointments_doctor_id_fkey(
          first_name,
          last_name,
          specialty
        )
      `)
      .eq('patient_id', userId)
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .order('appointment_date', { ascending: true });

    if (error) {
      return 'عذراً، حدث خطأ في جلب مواعيدك. يرجى المحاولة مرة أخرى.';
    }

    if (!appointments || appointments.length === 0) {
      return 'لا توجد مواعيد قادمة لك حالياً. هل تريد حجز موعد جديد؟';
    }

    let response = 'إليك مواعيدك القادمة:\n\n';
    appointments.forEach((appointment: any, index: number) => {
      const doctorName = `${appointment.doctors.first_name} ${appointment.doctors.last_name}`;
      const date = new Date(appointment.appointment_date).toLocaleDateString('ar-SA');
      response += `${index + 1}. د. ${doctorName} - ${appointment.doctors.specialty}\n`;
      response += `   التاريخ: ${date}\n`;
      response += `   الوقت: ${appointment.appointment_time}\n`;
      response += `   الحالة: ${getStatusText(appointment.status)}\n\n`;
    });

    return response;
  } catch (error) {
    return 'عذراً، حدث خطأ في جلب مواعيدك. يرجى المحاولة مرة أخرى.';
  }
}

async function handleAppointmentCancellation(message: string, userId: string | null, supabase: any) {
  if (!userId) {
    return 'عذراً، يجب عليك تسجيل الدخول أولاً لإلغاء موعدك.';
  }

  return 'أفهم أنك تريد إلغاء موعدك. من فضلك أخبرني برقم الموعد أو التاريخ والوقت للموعد الذي تريد إلغاءه.';
}

async function handleGeneralInquiry(message: string) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('ساعات') || lowerMessage.includes('العمل')) {
    return 'ساعات عمل مركز الهمم:\n\nالأحد - الخميس: 8:00 ص - 10:00 م\nالجمعة: 2:00 م - 10:00 م\nالسبت: 8:00 ص - 6:00 م\n\nنحن متاحون لخدمتك في هذه الأوقات!';
  }
  
  if (lowerMessage.includes('العنوان') || lowerMessage.includes('الموقع')) {
    return 'عنوان مركز الهمم:\n\nالرياض، حي النرجس\nشارع الملك فهد\n\nيمكنك الوصول إلينا بسهولة عبر وسائل النقل المختلفة.';
  }
  
  if (lowerMessage.includes('الهاتف') || lowerMessage.includes('اتصال')) {
    return 'رقم هاتف مركز الهمم:\n\n📞 011-123-4567\n📱 050-123-4567\n\nنحن متاحون للرد على استفساراتك في أي وقت!';
  }
  
  return 'شكراً لسؤالك! يمكنني مساعدتك في:\n\n• حجز المواعيد\n• الاستعلام عن مواعيدك\n• إلغاء المواعيد\n• معلومات المركز\n\nهل تريد معرفة المزيد عن أي من هذه الخدمات؟';
}

async function getAvailableAppointments(supabase: any) {
  try {
    // جلب الأطباء المتاحين
    const { data: doctors, error } = await supabase
      .from('doctors')
      .select('id, first_name, last_name, specialty')
      .eq('is_active', true)
      .limit(3);

    if (error) {
      return [];
    }

    // إنشاء اقتراحات المواعيد
    const suggestions = doctors.map((doctor: any) => ({
      id: doctor.id,
      doctorName: `د. ${doctor.first_name} ${doctor.last_name}`,
      specialty: doctor.specialty,
      availableSlots: [
        '9:00 ص',
        '10:00 ص', 
        '11:00 ص',
        '2:00 م',
        '3:00 م',
        '4:00 م'
      ]
    }));

    return suggestions;
  } catch (error) {
    return [];
  }
}

function extractAppointmentInfo(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // استخراج التخصص
  const specialties = ['قلب', 'عظام', 'أطفال', 'نساء', 'أعصاب', 'جلدية', 'عيون', 'أنف وأذن'];
  const specialty = specialties.find(s => lowerMessage.includes(s));
  
  // استخراج اسم الطبيب
  const doctorPattern = /د\.?\s*([أ-ي\s]+)/;
  const doctorMatch = message.match(doctorPattern);
  const doctorName = doctorMatch?.[1]?.trim() || null;
  
  return {
    specialty,
    doctorName,
    urgency: lowerMessage.includes('عاجل') || lowerMessage.includes('طارئ')
  };
}

function getStatusText(status: string) {
  const statusMap: { [key: string]: string } = {
    'scheduled': 'مجدول',
    'confirmed': 'مؤكد',
    'completed': 'مكتمل',
    'cancelled': 'ملغي',
    'no_show': 'لم يحضر'
  };
  
  return statusMap[status] || status;
}

async function saveConversation(conversationId: string, userId: string | null, userMessage: string, botResponse: string, supabase: any) {
  try {
    // حفظ رسالة المستخدم
    await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'user',
        message_text: userMessage,
        message_type: 'text',
        user_id: userId
      });

    // حفظ رد البوت
    await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'bot',
        message_text: botResponse,
        message_type: 'text'
      });
  } catch (error) {
    }
}
