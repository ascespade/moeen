## خطة 3 — ربط الشاشات بالداتابيز وتشغيل الوظائف بثبات

هدف الخطة: تشغيل كل شاشة بوظائف CRUD/عرض فعلية عبر API موحد، بخطوات تدريجية تقلل المخاطر وتضمن اختباراً صحيحاً من أول مرة.

استراتيجية عامة

- طبقة API: بناء Endpoints تحت `/app/api/**` لكل موديول.
- طبقة Client: `src/utils/api-client.ts` واجهة موحّدة للاستدعاءات.
- حراسة الوصول: `middleware.prod.ts` + أدوار.
- اختبارات: Jest لوحدات API + Playwright (اختياري لاحقاً) للتصفح الرئيسي.

الموديولات بالترتيب

1) Auth (Supabase)
- [ ] استبدال الموك بربط Supabase Auth (تسجيل/تسجيل دخول/تسجيل خروج/استعادة كلمة المرور).
- [ ] حفظ توكن HttpOnly + قراءة جلسة بالـ SSR عند الحاجة.

2) Dashboard
- [ ] KPIs من: `appointments`, `sessions`, `conversations`, `users` (استعلامات aggregate).
- [ ] Charts: Buckets زمنية يومية/أسبوعية.

3) Chatbot
- [ ] Templates: CRUD كامل على `message_templates`.
- [ ] Flows: CRUD على `chatbot_flows/nodes/edges` + نشر/إلغاء نشر.
- [ ] Integrations: تخزين وفحص الحالة ضمن `chatbot_integrations`.
- [ ] Analytics: استعلامات على `conversations` مع فلاتر.

4) CRM
- [ ] Contacts: عرض من `patients/users` + فلترة.
- [ ] Leads/Deals/Activities: CRUD على الجداول الجديدة.

5) Healthcare
- [ ] Appointments: CRUD + تقويم.
- [ ] Sessions: CRUD + ربط بالAppointments.
- [ ] Patients: عرض وتحديث الملف.

قائمة التحقق (To‑Do)

- [ ] بناء API للموديولات بالترتيب أعلاه.
- [ ] توصيل كل صفحة بمصدرها عبر `useSWR` أو استدعاءات fetch بسيطة + loading states.
- [ ] كتابة اختبارات وحدات للAPI الحرجة (Auth, Templates, Appointments).
- [ ] تمكين Telemetry بسيط للأخطاء (log + toast).


