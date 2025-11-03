import logger from '@/lib/monitoring/logger';
import { NextRequest, NextResponse } from 'next/server';

// Simple chatbot responses - يمكن توسيعه لاحقاً
const responses: Record<string, string> = {
  // Greetings
  مرحبا: 'أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟',
  'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! كيف أقدر أخدمك؟',
  hi: 'Hello! How can I help you today?',

  // Appointments
  'احجز موعد':
    'رائع! لحجز موعد، يمكنك:\n\n1️⃣ الاتصال على: +966126173693\n2️⃣ واتساب: +966555381558\n3️⃣ أو عبر نظامنا الإلكتروني\n\nما هو التخصص المطلوب؟',
  موعد: 'لحجز موعد، تواصل معنا على:\n📞 +966126173693\n📱 +966555381558',

  // Services
  الخدمات:
    'خدماتنا المتخصصة:\n\n🔍 التشخيص والتقييم الشامل\n🗣️ علاج النطق والتخاطب\n🎯 العلاج الوظيفي والتكامل الحسي\n🧩 تعديل السلوك (ABA)\n💚 الدعم النفسي والإرشاد الأسري\n🏫 برامج الرعاية النهارية والدمج\n\nأي خدمة تهمك؟',
  'ما هي الخدمات':
    'خدماتنا تشمل:\n• التشخيص والتقييم\n• علاج النطق\n• العلاج الوظيفي\n• تعديل السلوك\n• الدعم الأسري\n• برامج الدمج',

  // Speech Therapy
  'علاج نطق':
    'علاج النطق والتخاطب:\n\n✅ علاج التلعثم واللدغات\n✅ تأخر النطق\n✅ اضطرابات الصوت\n✅ التواصل البديل (AAC)\n\nنستخدم منهجيات PECS وتحليل السلوك التطبيقي (ABA)',
  تخاطب:
    'خدمة التخاطب متوفرة مع أخصائيين معتمدين. تواصل معنا لحجز جلسة تقييم مجانية!',

  // Occupational Therapy
  'علاج وظيفي':
    'العلاج الوظيفي والتكامل الحسي:\n\n✅ تحسين المهارات الحركية\n✅ الاعتماد على الذات\n✅ معالجة الحساسيات الحسية\n✅ غرف تكامل حسي متخصصة',

  // ABA
  'تعديل سلوك':
    'تعديل السلوك (ABA):\n\n✅ خطط سلوكية فردية (IEPs)\n✅ تعزيز المهارات الاجتماعية\n✅ التعامل مع التحديات السلوكية\n✅ منهجيات مبنية على الأدلة',
  aba: 'برنامج تحليل السلوك التطبيقي (ABA) متوفر مع أخصائيين معتمدين دولياً',

  // Pricing
  الأسعار:
    'للاستفسار عن الأسعار والباقات:\n\n📞 اتصل على: +966126173693\n📱 واتساب: +966555381558\n\nلدينا باقات مخصصة حسب الحالة والاحتياجات',
  'كم السعر':
    'الأسعار تختلف حسب نوع الخدمة. تواصل معنا للحصول على عرض سعر مخصص',

  // Location
  الموقع:
    '📍 موقعنا:\n\nجدة، حي الصفا\nشارع الأمير محمد بن عبد العزيز (التحلية)\nفندق دبليو إيه (WA Hotel) - الدور الثامن\n\n📞 +966126173693',
  العنوان: 'جدة - حي الصفا - فندق WA - الدور الثامن',

  // Working Hours
  'ساعات العمل':
    '🕐 ساعات العمل:\n\nالأحد - الخميس: 7 صباحاً - 7 مساءً\nالجمعة والسبت: مغلق',
  'متى تفتحون': 'نعمل الأحد - الخميس من 7 صباحاً حتى 7 مساءً',

  // Contact
  تواصل:
    '📞 طرق التواصل:\n\nهاتف: +966126173693\nواتساب: +966555381558\nبريد: info@alhemam.sa\nموقع: http://alhemam.sa',
  اتصال: 'للتواصل:\n📱 واتساب: +966555381558\n📞 هاتف: +966126173693',

  // Emergency
  طوارئ:
    '🚨 أرقام الطوارئ:\n\n997 - الطوارئ العامة\n911 - الإسعاف\n+966555381558 - مركز الهمم (واتساب)',
};

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Normalize message
    const normalizedMessage = message.toLowerCase().trim();

    // Find best match
    let response =
      'عذراً، لم أفهم سؤالك بشكل كامل.\n\nيمكنك:\n• اتصال: +966126173693\n• واتساب: +966555381558\n• بريد: info@alhemam.sa\n\nأو جرب أن تسأل عن:\n- الخدمات\n- حجز موعد\n- الأسعار\n- الموقع';

    // Check for exact matches
    for (const [keyword, reply] of Object.entries(responses)) {
      if (normalizedMessage.includes(keyword.toLowerCase())) {
        response = reply;
        break;
      }
    }

    // Log interaction
    logger.info('Chatbot interaction', {
      message: message.substring(0, 100),
      responseType: response === responses['مرحبا'] ? 'greeting' : 'secondary',
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    logger.error('Chatbot API error', error);

    return NextResponse.json(
      {
        success: false,
        response:
          'عذراً، حدث خطأ. يرجى التواصل معنا عبر:\n📱 واتساب: +966555381558\n📞 هاتف: +966126173693',
      },
      { status: 500 }
    );
  }
}
