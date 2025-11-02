# 🎯 دليل سريع: التحكم في Cursor Cloud Entities

## ✅ نعم! يمكنك التحكم في كل واحد من الـ 4 والتواصل بينهم

### 🎛️ الـ 4 Entities في Cursor Cloud:

1. **🤖 Background Agents** - وكلاء الخلفية الذكية
2. **🔄 Workflows** - سير العمل الآلي (GitHub Actions)
3. **💬 AI Assistants** - المساعدون الذكيون في Cursor
4. **📝 Rules & Instructions** - القواعد والتعليمات المخصصة

---

## 🚀 الاستخدام السريع

### 1️⃣ التحكم في Background Agent

```bash
# بدء Agent
npm run cursor-cloud agent:start main-agent "My Agent" balanced

# إيقاف Agent
npm run cursor-cloud agent:stop main-agent

# عرض حالة Agent
npm run cursor-cloud agent:status main-agent

# أو مباشرة
npm run cursor:agent
npm run cursor:agent:continuous
```

### 2️⃣ التحكم في Workflows

```bash
# تشغيل Workflow
npm run cursor-cloud workflow:trigger ai-self-healing.yml auto

# أو عبر GitHub CLI
gh workflow run ai-self-healing.yml --ref main -f mode=auto

# عرض الحالة
gh run list --workflow=ai-self-healing.yml
```

### 3️⃣ التواصل مع AI Assistant

```bash
# إرسال رسالة
npm run cursor-cloud assistant:message "Fix TypeScript errors in src/app"

# تحديث Rules
npm run cursor-cloud rules:update "Always use TypeScript strict mode"
```

### 4️⃣ إدارة Rules

```bash
# تحديث Rules
npm run cursor-cloud rules:update "New rule: Use functional components"

# القواعد موجودة في: .cursorrules
```

---

## 🔗 التواصل بين Entities

### مثال 1: Agent → Workflow

```typescript
// Agent يكتشف مشكلة ويرسل للـ Workflow
await controller.triggerWorkflow('ai-self-healing.yml', {
  mode: 'fix-only',
  source: 'background-agent',
  errorType: 'typescript'
});
```

### مثال 2: Workflow → Agent

```yaml
# Workflow يبدأ Agent بعد الانتهاء
- name: Start Background Agent
  run: |
    npm run cursor-cloud agent:start main-agent "Auto-Fix Agent" aggressive
```

### مثال 3: Assistant → Agent

```typescript
// Assistant يطلب من Agent إصلاح مشكلة
await controller.sendAssistantMessage({
  message: 'Fix all TypeScript errors',
  context: { errors: [...] }
});

// ثم Agent يبدأ العمل
await controller.startAgent({
  mode: 'aggressive',
  objectives: { zero_type_errors: true }
});
```

### مثال 4: Rules → جميع Entities

```markdown
# في .cursorrules
When TypeScript errors detected:
  - Trigger Background Agent (auto-fix)
  - Start Workflow (testing)
  - Notify AI Assistant (review)
```

---

## 📊 تقرير شامل

```bash
# إنشاء تقرير عن جميع Entities
npm run cursor-cloud report
```

---

## 📚 الوثائق الكاملة

للمزيد من التفاصيل، راجع:
- [`docs/CURSOR_CLOUD_ENTITIES_GUIDE.md`](docs/CURSOR_CLOUD_ENTITIES_GUIDE.md) - دليل شامل
- [`scripts/cursor-cloud-controller.ts`](scripts/cursor-cloud-controller.ts) - الكود المصدري

---

## 💡 أمثلة عملية

### سيناريو 1: إصلاح تلقائي كامل

```bash
# 1. Assistant يكتشف خطأ → يرسل لـ Agent
npm run cursor-cloud assistant:message "Fix TypeScript errors"

# 2. Agent يبدأ الإصلاح
npm run cursor-cloud agent:start fix-agent "Fix Agent" aggressive

# 3. Agent يطلق Workflow للاختبار
npm run cursor-cloud workflow:trigger ai-self-healing.yml fix-only

# 4. عرض التقرير
npm run cursor-cloud report
```

### سيناريو 2: مراقبة مستمرة

```bash
# Agent يعمل في الخلفية بشكل مستمر
npm run cursor:agent:continuous

# Workflows تعمل تلقائياً عند push
# (مضبوطة في .github/workflows/)

# Assistant جاهز في Cursor Editor
# Rules فعالة في .cursorrules
```

---

## ❓ أسئلة شائعة

**Q: هل يستطيعون التواصل في الوقت الفعلي؟**  
A: نعم! عبر:
- ملفات مشتركة (`.cursor/notifications/`)
- GitHub API للـ Workflows
- Cursor API للـ Agents و Assistants

**Q: كيف أتحكم في Entity واحد فقط؟**  
A: استخدم الأوامر الخاصة بكل Entity (كما هو موضح أعلاه)

**Q: هل يمكن تشغيلهم بالتوازي؟**  
A: نعم! جميع الـ Entities يمكنها العمل في نفس الوقت

---

**📅 آخر تحديث:** 2025-01-29