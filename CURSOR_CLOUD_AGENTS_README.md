# 🎛️ التحكم في Cursor Cloud Background Agents

## ✅ الإجابة السريعة

### سؤال 1: هل يمكن التحكم بكل واحد من الـ 4 في Cursor Cloud؟
**نعم! ✅** يمكنك التحكم في كل agent منفردًا بطرق متعددة:

#### طرق التحكم:
1. **من Cursor Dashboard** - `https://cursor.com/dashboard?tab=background-agents`
2. **من ملف الإعدادات** - `cursor_background_agent.json`
3. **من Terminal/CLI** - أوامر `cursor-agent`
4. **من API** - `/api/agents/control`

#### أمثلة التحكم:
```bash
# إيقاف agent
POST /api/agents/control
{
  "action": "pause",
  "agentId": "agent-1"
}

# تشغيل agent
POST /api/agents/control
{
  "action": "start",
  "agentId": "agent-1"
}
```

---

### سؤال 2: هل يستطيعون التواصل بينهم؟
**نعم! ✅** يمكن للـ agents التواصل بطرق متعددة:

#### طرق التواصل:
1. **Event System** ⚡ - سريع وفوري
2. **Message System** 📨 - رسائل مباشرة
3. **Shared State** 💾 - حالة مشتركة
4. **Database Queue** 🗄️ - موثوق ودائم

#### مثال سريع:
```typescript
// Agent #1 يرسل رسالة
sendAgentMessage('agent-1', 'agent-2', 'task-completed', {
  result: 'success'
});

// Agent #2 يستقبل الرسالة
const message = await waitForMessage('agent-2', 'task-completed');
```

---

## 📚 الوثائق الكاملة

للتفاصيل الكاملة، راجع:
- **الدليل الشامل**: [`docs/CURSOR_CLOUD_AGENTS_GUIDE.md`](docs/CURSOR_CLOUD_AGENTS_GUIDE.md)
- **كود التواصل**: [`src/lib/agent/agent-communication.ts`](src/lib/agent/agent-communication.ts)
- **مثال عملي**: [`scripts/example-4-agents-coordination.ts`](scripts/example-4-agents-coordination.ts)

---

## 🚀 البدء السريع

### 1. تسجيل Agent
```typescript
import { registerAgent } from '@/lib/agent/agent-communication';

registerAgent('agent-1', 'My Agent', {
  status: 'running'
});
```

### 2. إرسال رسالة
```typescript
import { sendAgentMessage } from '@/lib/agent/agent-communication';

sendAgentMessage('agent-1', 'agent-2', 'hello', {
  message: 'Hello from agent 1!'
});
```

### 3. استقبال رسالة
```typescript
import { waitForMessage } from '@/lib/agent/agent-communication';

const message = await waitForMessage('agent-2', 'hello');
console.log(message.data);
```

### 4. التحكم عبر API
```bash
# عرض حالة جميع الـ agents
GET /api/agents/control

# التحكم في agent
POST /api/agents/control
{
  "action": "pause",
  "agentId": "agent-1"
}
```

---

## 🎯 مثال: 4 Agents تعمل معًا

```typescript
// Agent #1: يصلح TypeScript
await agent1TypeScriptFixer();

// Agent #2: ينتظر Agent #1 ثم يصلح ESLint
await agent2ESLintFixer();

// Agent #3: ينتظر Agent #2 ثم يشغل الاختبارات
await agent3TestRunner();

// Agent #4: ينتظر Agent #3 ثم يفحص الجودة
await agent4QualityChecker();
```

راجع: [`scripts/example-4-agents-coordination.ts`](scripts/example-4-agents-coordination.ts)

---

## 📊 APIs المتاحة

### Agent Control
- `GET /api/agents/control` - حالة agents
- `POST /api/agents/control` - التحكم (start/stop/pause/resume)
- `DELETE /api/agents/control` - إلغاء تسجيل agent

### Agent Messages
- `POST /api/agents/messages` - إرسال رسالة
- `GET /api/agents/messages` - استقبال رسائل

---

## ✅ الخلاصة

| الميزة | متاحة؟ |
|--------|--------|
| التحكم في Agent واحد | ✅ نعم |
| التحكم في Agents متعددة | ✅ نعم |
| التواصل بين Agents | ✅ نعم |
| Event System | ✅ نعم |
| Message System | ✅ نعم |
| API Control | ✅ نعم |
| Dashboard Control | ✅ نعم |

---

**تم الإنشاء:** 2025-01-27  
**آخر تحديث:** 2025-01-27
