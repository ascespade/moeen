## خطة 2 — السكيما النهائية للداتابيز + CUID مركزي

هدف الخطة: مخطط جداول نهائي يغطي كل الشاشات والموديولات بدون الحاجة لتعديلات لاحقة، مع CUID موحّد للروابط بين الواجهات وAPI.

المبادئ

- الاعتماد على مخطط Supabase الحالي كأساس (users/patients/doctors/appointments/sessions/...)
- إضافة جداول ناقصة لـ Chatbot وCRM، مع فهارس وسياسات RLS عند الحاجة.
- CUID مركزي: استخدام مولد معرفات `src/lib/cuid.ts` لتوليد مفاتيح عامة قابلة للمشاركة مع الواجهات.

الجداول المقترحة الجديدة (عناوين مختصرة)

- Chatbot
  - `chatbot_flows(id, name, status, description, created_by, created_at, updated_at)`
  - `chatbot_nodes(id, flow_id, type, config_json, position, created_at, updated_at)`
  - `chatbot_edges(id, flow_id, source_node_id, target_node_id, condition_json, created_at)`
  - `chatbot_integrations(id, provider, config_json, status, created_at, updated_at)`

- CRM
  - `crm_leads(id, source, name, phone, email, owner_id, status, score, notes, created_at, updated_at)`
  - `crm_deals(id, title, value, stage, owner_id, contact_id, expected_close_date, created_at, updated_at)`
  - `crm_activities(id, type, subject, due_at, status, owner_id, contact_id, deal_id, created_at, updated_at)`

- Settings/Content
  - `ui_settings(id, key, value_json, updated_by, updated_at)` (اختياري إن احتجنا تخصيصات لاحقة)

توليد الـCUID

- واجهة: كل إنشاء سجل عبر الواجهات/الAPI سيستدعي `generateCuid()` من `src/lib/cuid.ts` ويخزّن في حقل `id` (UUID/CUID حسب الجدول) أو حقل `public_id` إذا أردنا الحفاظ على UUID داخلي.

قائمة التحقق (To‑Do)

- [ ] إنشاء Migration لإضافة جداول Chatbot وCRM.
- [ ] إضافة فهارس على الحقول: `owner_id`, `status`, `stage`, `created_at`.
- [ ] إعداد سياسات RLS على الجداول الجديدة (حسب الدور/الملكية).
- [ ] تحديث `src/types` لتعكس السكيما الجديدة.
- [ ] التأكد من توافر `generateCuid()` واستخدامه في كل الإنشاءات.
