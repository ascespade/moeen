## خطة 1 — خارطة واجهات المستخدم والراوتر (تصميم نهائي قابل للتصفح)

هدف الخطة: امتلاك نظام قابل للتصفح يعرض كل الشاشات بتصميم نهائي ثابت وراوتر مربوط بالكامل، مع تفاصيل كاملة للتخطيط البصري والتفاعلات، قبل ربط البيانات.

ثوابت التصميم (يُمنع تغييرها)
- الألوان والخطوط من `src/app/globals.css` والتهيئة في `src/app/layout.tsx` (Cairo/Inter + CSS Variables).
- استعمال `container-app`, `text-brand`, `border-brand`, `shadow-soft`, `btn-brand` وأدوات Tailwind المخصّصة.

الموديولات والشاشات (تفاصيل نهائية)

1) الصفحة الرئيسية (Landing)
- أقسام: Hero Slider (3 شرائح بخلفيات وصورة شعار)، دعوة للإجراء (CTA)، خدمات (بطاقات 6)، سلايدر شهادات العملاء، معرض صور (Grid مع Lightbox)، قسم "معين" (تعريف مختصر + روابط سريعة)، شريط تواصل (واتساب/اتصال/خريطة)، FAQ مصغّر، Footer غني.
- تفاعلات: سلايدر تلقائي/بالسحب، Lazy-loading للصور، Anchors داخلية.

2) Auth
- Login `/login` (موجود) — نهائي.
- Register `/register` — حقول: الاسم، البريد، كلمة المرور، تأكيد، موافقة على الشروط.
- Forgot `/forgot-password` — إدخال بريد مع تنبيهات حالة.
- Reset `/reset-password` — كلمة مرور جديدة + تأكيد.
- حالات: loading, error, success، تنبيهات واضحة.

3) Dashboard
- User `/dashboard` (موجود) — رأس، شريط جانبي، بطاقات KPI، Charts (3)، نشاط أخير.
- Admin `/admin/dashboard` (موجود) — Widgets إدارية: المستخدمون، السجلات، الإشعارات، حالة التكاملات.
- تفاعلات: فلاتر زمنية، تبديل عرض الجداول/البطاقات.

4) Healthcare
- Appointments (Calendar) `/appointments` — شاشة فل سكرين احترافية:
  - رأس علوي: اختيار الطبيب (Select)، اختيار المريض (Search + Select)، فلاتر المدة (يوم/أسبوع/شهر)، زر إنشاء موعد.
  - تقويم كامل الشاشة (أسبوعي/شهري) مع "Drag & Drop" لنقل/تعديل الموعد، Resize لتعديل المدة، Tooltip بمعلومات المريض والطبيب، تلوين حسب الحالة.
  - Sidebar (قابل للإخفاء): قائمة اليوم، إشعارات التعارض، اقتراح أقرب وقت متاح.
  - حوار (Modal) إنشاء/تعديل موعد: المريض، الطبيب، التاريخ، الوقت، المدة، النوع، الملاحظات، التأمين.
- Sessions `/sessions` — جدول/بطاقات بجلسات اليوم، أزرار بدء/إكمال.
- Patients `/patients` + `/patients/[id]` — قائمة مع بحث متقدّم، ملف مريض بتبويبات (بيانات/سجل/جلسات/وثائق/أقارب/مطالبات).
- Insurance Claims `/insurance-claims` — قائمة + تفاصيل + رفع مرفقات.

5) Chatbot
- Flows `/chatbot/flows` — شبكة بطاقات التدفقات مع الحالة (Draft/Published)، أزرار إنشاء/نسخ/أرشفة، بحث ووسوم.
- Flow Builder `/chatbot/flows/[flowId]` — Canvas بصري (UI متقن): لوح عقد/روابط، Sidebar لعقدة مختارة (نوع، رسائل، شروط)، مصغّر (Mini‑map)، زر نشر، مقارنة تغييرات.
- Templates `/chatbot/templates` — جدول مع فلترة بالتصنيف/اللغة، Badge للموافقة، معاينة سريعة.
- Template Editor `/chatbot/templates/[id]` — محرر متعدد اللغات والمتغيرات، اختبار إرسال تجريبي.
- Integrations `/chatbot/integrations` — بطاقات واتساب/ويب/… مع حالة وصحة Webhook، أزرار Connect/Revoke.
- Analytics `/chatbot/analytics` — لوحات: الرسائل/القنوات/التحويلات/المشاعر مع فلاتر.

6) CRM
- Contacts `/crm/contacts` — جدول متقدّم (بحث، فلاتر، أعمدة قابلة للإظهار/الإخفاء)، Bulk actions.
- Contact Details `/crm/contacts/[id]` — تبويبات: معلومات، أنشطة، صفقات، رسائل.
- Leads `/crm/leads` — جدول + إنشاء lead سريع.
- Deals `/crm/deals` + Kanban `/crm/deals/kanban` — أعمدة مراحل قابلة للسحب، بطاقات بملخص، أشرطة تقدم.
- Activities `/crm/activities` — تقويم/قائمة، أنواع (مكالمة/اجتماع/مهمة) مع فلاتر.

7) System & Admin
- Settings `/settings` — تبويبات: عام، API Keys (Gemini/OpenAI/WhatsApp…)، اتصال قاعدة البيانات (عرض فقط إذا لزم)، التكاملات، الإشعارات الافتراضية، القوالب.
- Roles & Permissions `/admin/roles` — مصفوفة صلاحيات (صفوف أدوار/أعمدة قدرات)، إنشاء دور، تعيين للمستخدمين.
- Notifications Center `/notifications` — صندوق وارد، فلاتر، علامات مقروء/غير مقروء.
- Internal Messages `/messages` — محادثات داخلية (قائمة + نافذة محادثة)، ذكر @المستخدم.
- Insurance Approvals `/insurance/approvals` — قائمة طلبات، تفاصيل، أزرار موافقة/رفض وتعليل.
- Audit Logs `/admin/audit-logs` — جدول بزمن/مستخدم/إجراء/الجدول/القيَم قبل/بعد، فلاتر.

خريطة الراوتر (Route Map)
- المصدر الوحيد للمسارات: `src/constants/routes.ts`.
- توجيه ذكي بعد الدخول: `src/lib/router.ts#getDefaultRouteForUser` (Admin ↦ Admin Dashboard، غير ذلك ↦ User Dashboard).
- استخدام `next/link` حصراً.

قواعد التنفيذ
- كل شاشة تُسلّم بتصميم نهائي (بدون داتا) يشمل: عناوين، أقسام، جداول/بطاقات، نماذج، حوارات، حالات Loading/Empty/Error.
- مكونات مشتركة: بطاقات، جداول قابلة لإعادة الاستخدام، نماذج، تبويبات، Canvas Builder (UI).
- الالتزام الصارم بالستايل المعتمد.

قائمة التحقق (To‑Do)
- الصفحة الرئيسية
  - [ ] Hero Slider + CTA + خدمات + شهادات + معرض + "معين" + FAQ + Footer.
- Appointments (Calendar)
  - [ ] Full‑screen Calendar مع DnD/Resize + Sidebar + Modal الإنشاء/التعديل.
- Chatbot
  - [ ] Flows Grid + Flow Builder (Canvas UI) + Templates List + Template Editor + Integrations + Analytics.
- CRM
  - [ ] Contacts/Details + Leads + Deals + Kanban + Activities.
- System/Admin
  - [ ] Settings (تبويبات المذكورة) + Roles/Permissions + Notifications + Messages + Insurance Approvals + Audit Logs.
- عام
  - [ ] مراجعة كل الروابط لاعتماد `ROUTES`.
  - [ ] فحص الوصولية (تباين/تركيز/aria‑labels).


