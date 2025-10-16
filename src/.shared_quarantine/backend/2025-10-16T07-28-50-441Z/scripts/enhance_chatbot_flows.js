#!/usr/bin/env node
// enhance_chatbot_flows.js
// Professional chatbot flow enhancement for مركز الهمم
// Creates comprehensive, professional flows with proper configurations

const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in env.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// Helper functions
async function insert(table, row) {
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select()
    .limit(1);

  if (error) {
    console.error(`Insert error [${table}]`, error);
    throw error;
  }
  return data;
}

async function update(table, updates, where) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .match(where)
    .select();

  if (error) {
    console.error(`Update error [${table}]`, error);
    throw error;
  }
  return data;
}

// Professional chatbot flows with comprehensive configurations
const professionalFlows = [
  {
    name: "حجز_موعد_جديد",
    description:
      "Professional appointment booking flow with validation and confirmation",
    status: "published",
    nodes: [
      {
        node_type: "start",
        name: "welcome",
        config: {
          message:
            "مرحباً! أنا معين، مساعد مركز الهمم. سأساعدك في حجز موعد جديد.",
          buttons: [
            { text: "نعم، أريد حجز موعد", value: "book_appointment" },
            { text: "لا، شكراً", value: "decline" },
          ],
        },
        position_x: 100,
        position_y: 100,
      },
      {
        node_type: "message",
        name: "ask_patient_info",
        config: {
          message:
            "ممتاز! أولاً، أحتاج بعض المعلومات الأساسية:\n\n• الاسم الكامل\n• رقم الهاتف\n• تاريخ الميلاد\n• نوع الخدمة المطلوبة",
          input_type: "form",
          fields: [
            {
              name: "full_name",
              label: "الاسم الكامل",
              type: "text",
              required: true,
            },
            { name: "phone", label: "رقم الهاتف", type: "tel", required: true },
            {
              name: "birth_date",
              label: "تاريخ الميلاد",
              type: "date",
              required: true,
            },
            {
              name: "service_type",
              label: "نوع الخدمة",
              type: "select",
              options: ["استشارة نفسية", "تأهيل نطق", "تقويم سلوكي"],
              required: true,
            },
          ],
        },
        position_x: 100,
        position_y: 250,
      },
      {
        node_type: "action",
        name: "validate_patient",
        config: {
          action_type: "validate_patient",
          validation_rules: {
            phone: {
              pattern: "^\\+966[0-9]{9}$",
              message: "رقم الهاتف غير صحيح",
            },
            birth_date: {
              min_age: 3,
              max_age: 18,
              message: "العمر يجب أن يكون بين 3-18 سنة",
            },
          },
        },
        position_x: 100,
        position_y: 400,
      },
      {
        node_type: "message",
        name: "ask_preferred_date",
        config: {
          message:
            "شكراً لك! الآن، ما هو التاريخ والوقت المفضل لديك؟\n\n📅 يمكنك اختيار من التواريخ المتاحة:\n• الأحد - الخميس: 9:00 ص - 6:00 م\n• الجمعة: 2:00 م - 6:00 م\n• السبت: مغلق",
          input_type: "date_time_picker",
          available_days: [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
          ],
          time_slots: [
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
          ],
        },
        position_x: 100,
        position_y: 550,
      },
      {
        node_type: "action",
        name: "check_availability",
        config: {
          action_type: "check_availability",
          check_doctor_schedule: true,
          check_holidays: true,
          buffer_time: 30,
        },
        position_x: 100,
        position_y: 700,
      },
      {
        node_type: "message",
        name: "confirm_appointment",
        config: {
          message:
            "ممتاز! الموعد متاح:\n\n📅 التاريخ: {{appointment_date}}\n🕐 الوقت: {{appointment_time}}\n👨‍⚕️ الطبيب: {{doctor_name}}\n🏥 الخدمة: {{service_type}}\n💰 الرسوم: {{consultation_fee}} ريال\n\nهل تريد تأكيد هذا الموعد؟",
          buttons: [
            { text: "نعم، أكد الموعد", value: "confirm" },
            { text: "غير التاريخ", value: "change_date" },
            { text: "إلغاء", value: "cancel" },
          ],
        },
        position_x: 100,
        position_y: 850,
      },
      {
        node_type: "action",
        name: "create_appointment",
        config: {
          action_type: "create_appointment",
          send_confirmation: true,
          send_reminder: true,
          reminder_hours: 24,
        },
        position_x: 100,
        position_y: 1000,
      },
      {
        node_type: "message",
        name: "success_confirmation",
        config: {
          message:
            "🎉 تم حجز الموعد بنجاح!\n\n📋 تفاصيل الموعد:\n• رقم الموعد: {{appointment_id}}\n• التاريخ: {{appointment_date}}\n• الوقت: {{appointment_time}}\n• الطبيب: {{doctor_name}}\n\n📱 ستصلك رسالة تأكيد على رقم {{phone}}\n⏰ سنذكرك بالموعد قبل 24 ساعة\n\nهل تريد إضافة أي ملاحظات خاصة؟",
          buttons: [
            { text: "إضافة ملاحظات", value: "add_notes" },
            { text: "شكراً، انتهيت", value: "done" },
          ],
        },
        position_x: 100,
        position_y: 1150,
      },
    ],
  },
  {
    name: "استعلام_عن_موعد",
    description:
      "Professional appointment inquiry flow with detailed information",
    status: "published",
    nodes: [
      {
        node_type: "start",
        name: "welcome_inquiry",
        config: {
          message: "مرحباً! كيف يمكنني مساعدتك في الاستعلام عن موعدك؟",
          buttons: [
            { text: "موعدي القادم", value: "next_appointment" },
            { text: "جميع مواعيدي", value: "all_appointments" },
            { text: "تغيير موعد", value: "reschedule" },
          ],
        },
        position_x: 300,
        position_y: 100,
      },
      {
        node_type: "action",
        name: "authenticate_patient",
        config: {
          action_type: "authenticate_patient",
          methods: ["phone", "appointment_id"],
          fallback_message:
            "لم أتمكن من العثور على موعدك. يرجى التأكد من رقم الهاتف أو رقم الموعد.",
        },
        position_x: 300,
        position_y: 250,
      },
      {
        node_type: "message",
        name: "show_appointment_details",
        config: {
          message:
            "📅 موعدك القادم:\n\n• رقم الموعد: {{appointment_id}}\n• التاريخ: {{appointment_date}}\n• الوقت: {{appointment_time}}\n• الطبيب: {{doctor_name}}\n• الخدمة: {{service_type}}\n• الحالة: {{status}}\n• الرسوم: {{consultation_fee}} ريال\n\n📍 العنوان: مركز الهمم، جدة\n📞 للاستفسارات: 0123456789",
          buttons: [
            { text: "تغيير الموعد", value: "reschedule" },
            { text: "إلغاء الموعد", value: "cancel" },
            { text: "إضافة ملاحظات", value: "add_notes" },
            { text: "انتهيت", value: "done" },
          ],
        },
        position_x: 300,
        position_y: 400,
      },
    ],
  },
  {
    name: "الغاء_موعد",
    description: "Professional appointment cancellation flow with confirmation",
    status: "published",
    nodes: [
      {
        node_type: "start",
        name: "cancellation_welcome",
        config: {
          message:
            "أفهم أنك تريد إلغاء موعدك. سأساعدك في ذلك.\n\n⚠️ يرجى ملاحظة أن إلغاء الموعد قبل أقل من 24 ساعة قد يترتب عليه رسوم.",
          buttons: [
            { text: "نعم، أريد الإلغاء", value: "proceed_cancel" },
            { text: "غير رأيي", value: "keep_appointment" },
          ],
        },
        position_x: 500,
        position_y: 100,
      },
      {
        node_type: "action",
        name: "authenticate_for_cancel",
        config: {
          action_type: "authenticate_patient",
          methods: ["phone", "appointment_id"],
          required: true,
        },
        position_x: 500,
        position_y: 250,
      },
      {
        node_type: "message",
        name: "show_cancellation_details",
        config: {
          message:
            "📋 تفاصيل الموعد المراد إلغاؤه:\n\n• رقم الموعد: {{appointment_id}}\n• التاريخ: {{appointment_date}}\n• الوقت: {{appointment_time}}\n• الطبيب: {{doctor_name}}\n• الخدمة: {{service_type}}\n\n💰 رسوم الإلغاء: {{cancellation_fee}} ريال\n\nهل أنت متأكد من إلغاء هذا الموعد؟",
          buttons: [
            { text: "نعم، أكد الإلغاء", value: "confirm_cancel" },
            { text: "غير رأيي", value: "keep_appointment" },
            { text: "تغيير الموعد بدلاً من الإلغاء", value: "reschedule" },
          ],
        },
        position_x: 500,
        position_y: 400,
      },
      {
        node_type: "action",
        name: "process_cancellation",
        config: {
          action_type: "cancel_appointment",
          send_confirmation: true,
          refund_policy: "partial_refund_24h",
          notify_doctor: true,
        },
        position_x: 500,
        position_y: 550,
      },
      {
        node_type: "message",
        name: "cancellation_confirmed",
        config: {
          message:
            "✅ تم إلغاء الموعد بنجاح!\n\n📋 تفاصيل الإلغاء:\n• رقم الموعد الملغي: {{appointment_id}}\n• تاريخ الإلغاء: {{cancellation_date}}\n• المبلغ المسترد: {{refund_amount}} ريال\n• طريقة الاسترداد: {{refund_method}}\n\n📱 ستصلك رسالة تأكيد على رقم {{phone}}\n\nهل تريد حجز موعد جديد؟",
          buttons: [
            { text: "حجز موعد جديد", value: "book_new" },
            { text: "شكراً، انتهيت", value: "done" },
          ],
        },
        position_x: 500,
        position_y: 700,
      },
    ],
  },
  {
    name: "استفسارات_عامة",
    description: "General inquiries and FAQ flow",
    status: "published",
    nodes: [
      {
        node_type: "start",
        name: "general_welcome",
        config: {
          message:
            "مرحباً! أنا معين، مساعد مركز الهمم. كيف يمكنني مساعدتك اليوم؟",
          buttons: [
            { text: "معلومات عن المركز", value: "center_info" },
            { text: "الخدمات المتاحة", value: "services" },
            { text: "الأسعار والرسوم", value: "pricing" },
            { text: "الموقع والاتجاهات", value: "location" },
            { text: "التواصل معنا", value: "contact" },
          ],
        },
        position_x: 700,
        position_y: 100,
      },
      {
        node_type: "message",
        name: "center_info",
        config: {
          message:
            "🏥 مركز الهمم - مركز متخصص في:\n\n• طب نفس الأطفال\n• تأهيل النطق واللغة\n• التقويم السلوكي\n• الاستشارات النفسية\n\n👨‍⚕️ فريق من الأطباء المتخصصين\n🕐 ساعات العمل: الأحد-الخميس 9ص-6م، الجمعة 2م-6م\n📍 الموقع: جدة، المملكة العربية السعودية\n\nهل تريد معرفة المزيد عن خدمة معينة؟",
          buttons: [
            { text: "الخدمات", value: "services" },
            { text: "الأسعار", value: "pricing" },
            { text: "حجز موعد", value: "book_appointment" },
          ],
        },
        position_x: 700,
        position_y: 250,
      },
      {
        node_type: "message",
        name: "services_info",
        config: {
          message:
            "🔬 خدماتنا المتخصصة:\n\n1️⃣ **طب نفس الأطفال**\n   • تشخيص الاضطرابات النفسية\n   • العلاج السلوكي المعرفي\n   • متابعة الحالات المزمنة\n\n2️⃣ **تأهيل النطق واللغة**\n   • علاج اضطرابات النطق\n   • تحسين مهارات التواصل\n   • برامج التطوير اللغوي\n\n3️⃣ **التقويم السلوكي**\n   • تعديل السلوكيات غير المرغوبة\n   • تطوير المهارات الاجتماعية\n   • برامج التدريب السلوكي\n\nأي خدمة تهمك أكثر؟",
          buttons: [
            { text: "طب نفس الأطفال", value: "psychology" },
            { text: "تأهيل النطق", value: "speech_therapy" },
            { text: "التقويم السلوكي", value: "behavioral" },
            { text: "حجز موعد", value: "book_appointment" },
          ],
        },
        position_x: 700,
        position_y: 400,
      },
    ],
  },
];

// Professional chatbot templates
const professionalTemplates = [
  {
    name: "greeting_professional",
    category: "greeting",
    language: "ar",
    content:
      "مرحباً وسهلاً! أنا معين، المساعد الذكي لمركز الهمم. أنا هنا لمساعدتك في:\n\n• حجز المواعيد\n• الاستعلام عن الخدمات\n• الإجابة على استفساراتك\n\nكيف يمكنني مساعدتك اليوم؟",
    variables: {},
  },
  {
    name: "appointment_confirmation",
    category: "appointment",
    language: "ar",
    content:
      "✅ تم تأكيد موعدك بنجاح!\n\n📋 التفاصيل:\n• رقم الموعد: {{appointment_id}}\n• التاريخ: {{appointment_date}}\n• الوقت: {{appointment_time}}\n• الطبيب: {{doctor_name}}\n• الخدمة: {{service_type}}\n• الرسوم: {{consultation_fee}} ريال\n\n📱 ستصلك رسالة تأكيد على {{phone}}\n⏰ سنذكرك بالموعد قبل 24 ساعة\n\n📍 العنوان: مركز الهمم، جدة\n📞 للاستفسارات: 0123456789",
    variables: {
      appointment_id: "string",
      appointment_date: "date",
      appointment_time: "time",
      doctor_name: "string",
      service_type: "string",
      consultation_fee: "number",
      phone: "string",
    },
  },
  {
    name: "cancellation_confirmation",
    category: "appointment",
    language: "ar",
    content:
      "✅ تم إلغاء موعدك بنجاح!\n\n📋 تفاصيل الإلغاء:\n• رقم الموعد الملغي: {{appointment_id}}\n• تاريخ الإلغاء: {{cancellation_date}}\n• المبلغ المسترد: {{refund_amount}} ريال\n• طريقة الاسترداد: {{refund_method}}\n\n📱 ستصلك رسالة تأكيد على {{phone}}\n\nهل تريد حجز موعد جديد؟",
    variables: {
      appointment_id: "string",
      cancellation_date: "date",
      refund_amount: "number",
      refund_method: "string",
      phone: "string",
    },
  },
  {
    name: "reminder_24h",
    category: "reminder",
    language: "ar",
    content:
      "⏰ تذكير بالموعد\n\nلديك موعد غداً في مركز الهمم:\n\n📅 التاريخ: {{appointment_date}}\n🕐 الوقت: {{appointment_time}}\n👨‍⚕️ الطبيب: {{doctor_name}}\n🏥 الخدمة: {{service_type}}\n\n📍 العنوان: مركز الهمم، جدة\n📞 للاستفسارات: 0123456789\n\nيرجى الحضور قبل الموعد بـ 15 دقيقة",
    variables: {
      appointment_date: "date",
      appointment_time: "time",
      doctor_name: "string",
      service_type: "string",
    },
  },
  {
    name: "error_generic",
    category: "error",
    language: "ar",
    content:
      "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة على:\n\n📞 الهاتف: 0123456789\n📧 البريد الإلكتروني: info@alhemmcenter.sa\n\nنعتذر عن الإزعاج وسنعمل على حل المشكلة في أقرب وقت.",
    variables: {},
  },
];

// Enhanced training data
const enhancedTrainingData = [
  // Appointment booking intents
  {
    input_text: "أريد حجز موعد",
    expected_output: "trigger:حجز_موعد_جديد",
    category: "intent",
    tags: ["booking", "appointment"],
    confidence_score: 0.95,
    is_verified: true,
  },
  {
    input_text: "ابغى احجز موعد جديد",
    expected_output: "trigger:حجز_موعد_جديد",
    category: "intent",
    tags: ["booking", "appointment"],
    confidence_score: 0.92,
    is_verified: true,
  },
  {
    input_text: "عندي طفل محتاج استشارة",
    expected_output: "trigger:حجز_موعد_جديد",
    category: "intent",
    tags: ["booking", "consultation"],
    confidence_score: 0.88,
    is_verified: true,
  },
  {
    input_text: "ممكن احجز مع دكتور نفسي",
    expected_output: "trigger:حجز_موعد_جديد",
    category: "intent",
    tags: ["booking", "psychology"],
    confidence_score: 0.9,
    is_verified: true,
  },

  // Appointment inquiry intents
  {
    input_text: "متى موعدي القادم",
    expected_output: "trigger:استعلام_عن_موعد",
    category: "intent",
    tags: ["inquiry", "appointment"],
    confidence_score: 0.93,
    is_verified: true,
  },
  {
    input_text: "عندي موعد متى",
    expected_output: "trigger:استعلام_عن_موعد",
    category: "intent",
    tags: ["inquiry", "appointment"],
    confidence_score: 0.89,
    is_verified: true,
  },
  {
    input_text: "ابغى أعرف مواعيدي",
    expected_output: "trigger:استعلام_عن_موعد",
    category: "intent",
    tags: ["inquiry", "appointment"],
    confidence_score: 0.91,
    is_verified: true,
  },

  // Cancellation intents
  {
    input_text: "أريد إلغاء الموعد",
    expected_output: "trigger:الغاء_موعد",
    category: "intent",
    tags: ["cancel", "appointment"],
    confidence_score: 0.94,
    is_verified: true,
  },
  {
    input_text: "ابغى ألغي موعدي",
    expected_output: "trigger:الغاء_موعد",
    category: "intent",
    tags: ["cancel", "appointment"],
    confidence_score: 0.92,
    is_verified: true,
  },
  {
    input_text: "ممكن ألغي الموعد",
    expected_output: "trigger:الغاء_موعد",
    category: "intent",
    tags: ["cancel", "appointment"],
    confidence_score: 0.9,
    is_verified: true,
  },

  // General inquiries
  {
    input_text: "معلومات عن المركز",
    expected_output: "trigger:استفسارات_عامة",
    category: "intent",
    tags: ["info", "center"],
    confidence_score: 0.87,
    is_verified: true,
  },
  {
    input_text: "وش الخدمات المتاحة",
    expected_output: "trigger:استفسارات_عامة",
    category: "intent",
    tags: ["info", "services"],
    confidence_score: 0.89,
    is_verified: true,
  },
  {
    input_text: "كم الرسوم",
    expected_output: "trigger:استفسارات_عامة",
    category: "intent",
    tags: ["info", "pricing"],
    confidence_score: 0.85,
    is_verified: true,
  },
];

async function enhanceChatbotFlows() {
  console.log("🚀 Starting professional chatbot flow enhancement...");

  try {
    // 1. Clear existing basic flows and create professional ones
    console.log("📋 Creating professional chatbot flows...");

    for (const flow of professionalFlows) {
      // Check if flow exists
      const { data: existingFlow } = await supabase
        .from("chatbot_flows")
        .select("id")
        .eq("name", flow.name)
        .maybeSingle();

      let flowId;
      if (existingFlow) {
        // Update existing flow
        await update(
          "chatbot_flows",
          {
            description: flow.description,
            status: flow.status,
            updated_at: new Date().toISOString(),
          },
          { name: flow.name },
        );
        flowId = existingFlow.id;
        console.log(`✅ Updated flow: ${flow.name}`);
      } else {
        // Create new flow
        const flowData = {
          id: uuidv4(),
          public_id: `flow_${flow.name}_${Math.random().toString(36).slice(2, 7)}`,
          name: flow.name,
          description: flow.description,
          status: flow.status,
          version: 1,
          created_by: null,
        };
        await insert("chatbot_flows", flowData);
        flowId = flowData.id;
        console.log(`✅ Created flow: ${flow.name}`);
      }

      // Create/update nodes for this flow
      console.log(`🔧 Creating nodes for flow: ${flow.name}`);

      // Clear existing nodes for this flow
      await supabase.from("chatbot_nodes").delete().eq("flow_id", flowId);

      // Create new professional nodes
      for (const node of flow.nodes) {
        const nodeData = {
          id: uuidv4(),
          public_id: `node_${node.name}_${Math.random().toString(36).slice(2, 7)}`,
          flow_id: flowId,
          node_type: node.node_type,
          name: node.name,
          config: node.config,
          position_x: node.position_x,
          position_y: node.position_y,
        };
        await insert("chatbot_nodes", nodeData);
      }
    }

    // 2. Create professional templates
    console.log("📝 Creating professional templates...");

    for (const template of professionalTemplates) {
      // Check if template exists
      const { data: existingTemplate } = await supabase
        .from("chatbot_templates")
        .select("id")
        .eq("name", template.name)
        .eq("language", template.language)
        .maybeSingle();

      if (existingTemplate) {
        // Update existing template
        await update(
          "chatbot_templates",
          {
            category: template.category,
            content: template.content,
            variables: template.variables,
            is_approved: true,
            updated_at: new Date().toISOString(),
          },
          { name: template.name, language: template.language },
        );
        console.log(`✅ Updated template: ${template.name}`);
      } else {
        // Create new template
        const templateData = {
          id: uuidv4(),
          public_id: `tpl_${template.name}_${Math.random().toString(36).slice(2, 7)}`,
          name: template.name,
          category: template.category,
          language: template.language,
          content: template.content,
          variables: template.variables,
          is_approved: true,
          created_by: null,
        };
        await insert("chatbot_templates", templateData);
        console.log(`✅ Created template: ${template.name}`);
      }
    }

    // 3. Enhance training data
    console.log("🧠 Enhancing AI training data...");

    for (const trainingItem of enhancedTrainingData) {
      // Check if training data exists
      const { data: existingTraining } = await supabase
        .from("ai_training_data")
        .select("id")
        .eq("input_text", trainingItem.input_text)
        .maybeSingle();

      if (!existingTraining) {
        const trainingData = {
          id: uuidv4(),
          input_text: trainingItem.input_text,
          expected_output: trainingItem.expected_output,
          category: trainingItem.category,
          tags: trainingItem.tags,
          confidence_score: trainingItem.confidence_score,
          is_verified: trainingItem.is_verified,
          verified_by: null,
        };
        await insert("ai_training_data", trainingData);
        console.log(
          `✅ Added training data: ${trainingItem.input_text.substring(0, 30)}...`,
        );
      }
    }

    // 4. Update AI models configuration
    console.log("🤖 Updating AI models configuration...");

    const aiModels = [
      {
        name: "gemini_pro",
        model_type: "gemini_pro",
        api_key: null,
        api_url:
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        configuration: {
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.9,
          top_k: 40,
        },
        is_active: true,
      },
      {
        name: "gemini_flash",
        model_type: "gemini_flash",
        api_key: null,
        api_url:
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        configuration: {
          temperature: 0.5,
          max_tokens: 500,
          top_p: 0.8,
          top_k: 20,
        },
        is_active: true,
      },
    ];

    for (const model of aiModels) {
      const { data: existingModel } = await supabase
        .from("ai_models")
        .select("id")
        .eq("name", model.name)
        .maybeSingle();

      if (existingModel) {
        await update(
          "ai_models",
          {
            configuration: model.configuration,
            is_active: model.is_active,
            updated_at: new Date().toISOString(),
          },
          { name: model.name },
        );
        console.log(`✅ Updated AI model: ${model.name}`);
      } else {
        const modelData = {
          id: uuidv4(),
          name: model.name,
          model_type: model.model_type,
          api_key: model.api_key,
          api_url: model.api_url,
          configuration: model.configuration,
          is_active: model.is_active,
        };
        await insert("ai_models", modelData);
        console.log(`✅ Created AI model: ${model.name}`);
      }
    }

    console.log(
      "🎉 Professional chatbot flow enhancement completed successfully!",
    );
    console.log("\n📊 Summary:");
    console.log(
      `• ${professionalFlows.length} professional flows created/updated`,
    );
    console.log(
      `• ${professionalTemplates.length} professional templates created/updated`,
    );
    console.log(
      `• ${enhancedTrainingData.length} enhanced training data entries`,
    );
    console.log(`• ${aiModels.length} AI models configured`);

    console.log("\n🔧 Next steps:");
    console.log("• Configure AI model API keys in ai_models table");
    console.log("• Test flows using the chatbot interface");
    console.log("• Customize templates based on specific needs");
    console.log("• Add more training data based on real conversations");
  } catch (error) {
    console.error("❌ Enhancement failed:", error);
    process.exit(1);
  }
}

enhanceChatbotFlows();
