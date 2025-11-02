# 🎛️ دليل التحكم في Cursor Cloud Background Agents

## 📋 نظرة عامة

في Cursor Cloud، يمكنك إدارة وتشغيل **Background Agents** (الوكلاء الخلفية) بشكل منفصل ومستقل. هذا الدليل يشرح كيفية:

1. **التحكم** بكل agent منفردًا
2. **التواصل** بين الـ agents المختلفة
3. **إدارة** وإعدادات كل agent

---

## 🎯 ما هي Background Agents في Cursor Cloud؟

Background Agents هي وكلاء ذكية تعمل في الخلفية بشكل مستقل، ويمكن أن يكون لديك **عدة agents** تعمل في نفس الوقت، كل واحد مسؤول عن مهام معينة.

### المكونات الأساسية:

1. **Cursor Dashboard** - لوحة التحكم الرئيسية
2. **Agent Configuration** - ملف الإعدادات (`cursor_background_agent.json`)
3. **Agent APIs** - واجهات برمجية للتواصل
4. **Agent Status** - حالة كل agent

---

## 🛠️ طريقة التحكم بكل Agent منفردًا

### 1. من خلال Cursor Dashboard

#### الخطوات:
1. افتح [Cursor Dashboard](https://cursor.com/dashboard)
2. اذهب إلى قسم **Background Agents** أو **Agents**
3. سترى قائمة بجميع الـ agents النشطة

#### التحكم في Agent واحد:
```
┌─────────────────────────────────┐
│  Background Agent #1            │
│  ├─ Status: Running ✅          │
│  ├─ Mode: aggressive            │
│  ├─ Actions:                    │
│  │   ├─ ⏸️  Pause              │
│  │   ├─ ⏹️  Stop               │
│  │   ├─ 🔄 Restart             │
│  │   ├─ ⚙️  Configure          │
│  │   └─ 📊 View Logs           │
└─────────────────────────────────┘
```

### 2. من خلال ملف الإعدادات

كل agent له ملف إعدادات خاص يمكن تخصيصه:

```json
{
  "name": "Agent #1 - TypeScript Fixes",
  "version": "1.0.0",
  "mode": "aggressive",
  "execution": {
    "parallel": true,
    "self_healing": true,
    "auto_commit": true,
    "max_iterations": 10
  },
  "objectives": {
    "build_success": true,
    "zero_type_errors": true,
    "zero_lint_errors": true
  }
}
```

### 3. من خلال Terminal/CLI

#### إيقاف Agent محدد:
```bash
# إيقاف agent بواسطة ID
cursor-agent stop --id agent-123

# إيقاف agent بواسطة الاسم
cursor-agent stop --name "Agent #1"
```

#### تشغيل Agent محدد:
```bash
# تشغيل agent
cursor-agent start --id agent-123

# تشغيل agent مع إعدادات مخصصة
cursor-agent start --config ./agent1.config.json
```

#### عرض حالة Agent:
```bash
# عرض حالة agent واحد
cursor-agent status --id agent-123

# عرض جميع الـ agents
cursor-agent list
```

---

## 🔗 التواصل بين الـ Agents

### طريقة 1: Shared State (الحالة المشتركة)

الـ agents يمكنها مشاركة البيانات من خلال:

#### ملف مشترك للتواصل:
```typescript
// shared-agent-state.json
{
  "agent-1": {
    "status": "running",
    "last_task": "fixed-typescript-errors",
    "completed_tasks": 5
  },
  "agent-2": {
    "status": "idle",
    "waiting_for": "agent-1-completion"
  }
}
```

#### قراءة/كتابة من Agent:
```typescript
// في Agent #1
import { readSharedState, writeSharedState } from './agent-communication';

// كتابة حالة
writeSharedState('agent-1', {
  status: 'completed',
  result: 'typescript-errors-fixed'
});

// في Agent #2
const agent1Status = readSharedState('agent-1');
if (agent1Status.status === 'completed') {
  // استمرار العمل
}
```

### طريقة 2: Event System (نظام الأحداث)

استخدام نظام الأحداث للتواصل:

```typescript
// event-bus.ts
export class AgentEventBus {
  private listeners: Map<string, Function[]> = new Map();

  // إرسال حدث
  emit(event: string, data: any) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  // الاستماع للأحداث
  on(event: string, handler: Function) {
    const handlers = this.listeners.get(event) || [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }
}

// استخدام في Agent #1
eventBus.emit('typescript-errors-fixed', {
  agentId: 'agent-1',
  errorsFixed: 15,
  timestamp: Date.now()
});

// استخدام في Agent #2
eventBus.on('typescript-errors-fixed', (data) => {
  console.log(`Agent #1 fixed ${data.errorsFixed} errors`);
  // استمرار العمل بناءً على هذا الحدث
});
```

### طريقة 3: API Communication (التواصل عبر API)

كل agent يمكنه الاتصال بـ agents أخرى عبر API:

#### إعداد Agent API Server:
```typescript
// agent-api-server.ts
import express from 'express';

const app = express();
app.use(express.json());

// API لإرسال رسالة لـ agent آخر
app.post('/agents/:agentId/message', (req, res) => {
  const { agentId } = req.params;
  const { message, data } = req.body;
  
  // إرسال الرسالة للـ agent المحدد
  sendMessageToAgent(agentId, { message, data });
  
  res.json({ success: true });
});

// API لطلب حالة agent
app.get('/agents/:agentId/status', (req, res) => {
  const { agentId } = req.params;
  const status = getAgentStatus(agentId);
  res.json(status);
});

// API للاستماع لرسائل من agents أخرى
app.post('/agents/:agentId/inbox', (req, res) => {
  const { agentId } = req.params;
  const message = req.body;
  
  handleIncomingMessage(agentId, message);
  res.json({ received: true });
});
```

#### استخدام من Agent:
```typescript
// في Agent #1 - إرسال رسالة
await fetch('http://localhost:3001/agents/agent-2/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'typescript-errors-completed',
    data: { errorsFixed: 15 }
  })
});

// في Agent #2 - الاستماع
const response = await fetch('http://localhost:3001/agents/agent-2/inbox');
const messages = await response.json();
```

### طريقة 4: Database Queue (طابور قاعدة البيانات)

استخدام قاعدة البيانات كوسيط للتواصل:

```sql
-- جدول للرسائل بين الـ agents
CREATE TABLE agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent_id TEXT NOT NULL,
  to_agent_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول لحالة الـ agents
CREATE TABLE agent_status (
  agent_id TEXT PRIMARY KEY,
  status TEXT,
  current_task TEXT,
  progress JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

```typescript
// إرسال رسالة
async function sendMessage(
  fromAgent: string,
  toAgent: string,
  message: string,
  data: any
) {
  await supabase.from('agent_messages').insert({
    from_agent_id: fromAgent,
    to_agent_id: toAgent,
    message_type: message,
    payload: data,
    status: 'pending'
  });
}

// استقبال الرسائل
async function getMessages(agentId: string) {
  const { data } = await supabase
    .from('agent_messages')
    .select('*')
    .eq('to_agent_id', agentId)
    .eq('status', 'pending');
  
  return data;
}
```

---

## 📊 مثال عملي: 4 Agents تعمل معًا

### السيناريو:
- **Agent #1**: إصلاح أخطاء TypeScript
- **Agent #2**: إصلاح أخطاء ESLint
- **Agent #3**: تشغيل الاختبارات
- **Agent #4**: التحقق من الجودة

### تدفق العمل:

```
Agent #1 (TypeScript Fixes)
    │
    ├─> Completes → Emits event: "typescript-fixed"
    │
    ↓
Agent #2 (ESLint Fixes)
    │
    ├─> Completes → Emits event: "eslint-fixed"
    │
    ↓
Agent #3 (Run Tests)
    │
    ├─> Completes → Emits event: "tests-passed"
    │
    ↓
Agent #4 (Quality Check)
    │
    └─> Final Report
```

### الكود:

```typescript
// agent-orchestrator.ts
import { AgentEventBus } from './event-bus';

const eventBus = new AgentEventBus();

// Agent #1
async function agent1() {
  console.log('Agent #1: Starting TypeScript fixes...');
  // إصلاح الأخطاء
  await fixTypeScriptErrors();
  
  // إرسال إشارة للـ agents الأخرى
  eventBus.emit('agent1-completed', {
    errorsFixed: 15,
    filesModified: 8
  });
}

// Agent #2 - يستمع لـ Agent #1
eventBus.on('agent1-completed', async (data) => {
  console.log('Agent #2: Starting ESLint fixes...');
  await fixESLintErrors();
  
  eventBus.emit('agent2-completed', {
    lintErrorsFixed: 10
  });
});

// Agent #3 - يستمع لـ Agent #2
eventBus.on('agent2-completed', async (data) => {
  console.log('Agent #3: Running tests...');
  const testResults = await runTests();
  
  eventBus.emit('agent3-completed', {
    testsPassed: testResults.passed,
    testsFailed: testResults.failed
  });
});

// Agent #4 - يستمع لـ Agent #3
eventBus.on('agent3-completed', async (data) => {
  console.log('Agent #4: Running quality check...');
  await qualityCheck();
  
  console.log('✅ All agents completed successfully!');
});
```

---

## 🔧 إعداد Agent Communication System

### 1. إنشاء ملف التواصل

```typescript
// src/lib/agent/communication.ts
export interface AgentMessage {
  from: string;
  to: string;
  type: string;
  data: any;
  timestamp: number;
}

export class AgentCommunication {
  private messages: AgentMessage[] = [];
  
  // إرسال رسالة
  send(message: AgentMessage) {
    this.messages.push(message);
    // يمكن إضافة إرسال عبر API أو Database
  }
  
  // استقبال الرسائل
  receive(agentId: string): AgentMessage[] {
    return this.messages.filter(msg => msg.to === agentId);
  }
  
  // حالة Agent
  updateAgentStatus(agentId: string, status: any) {
    // تحديث الحالة
  }
  
  // حالة Agent آخر
  getAgentStatus(agentId: string) {
    // جلب الحالة
  }
}
```

### 2. إضافة للـ Agent Settings

```json
{
  "communication": {
    "enabled": true,
    "method": "event-bus", // أو "api" أو "database"
    "listen_to": ["agent-1", "agent-3"],
    "notify": ["agent-2", "agent-4"]
  }
}
```

---

## 📱 واجهة المستخدم للإدارة

### Agent Dashboard Component:

```typescript
// src/app/(admin)/agent-dashboard/page.tsx
export default function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  
  // جلب حالة جميع الـ agents
  useEffect(() => {
    fetch('/api/agents/status')
      .then(res => res.json())
      .then(data => setAgents(data));
  }, []);
  
  return (
    <div className="grid grid-cols-4 gap-4">
      {agents.map(agent => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onPause={() => pauseAgent(agent.id)}
          onStop={() => stopAgent(agent.id)}
          onRestart={() => restartAgent(agent.id)}
        />
      ))}
    </div>
  );
}
```

---

## ✅ الخلاصة

### للتحكم في Agent واحد:
1. ✅ من Cursor Dashboard
2. ✅ من ملف الإعدادات (`cursor_background_agent.json`)
3. ✅ من Terminal/CLI
4. ✅ من خلال API

### للتواصل بين Agents:
1. ✅ **Shared State** - ملف مشترك
2. ✅ **Event System** - نظام الأحداث
3. ✅ **API Communication** - التواصل عبر API
4. ✅ **Database Queue** - طابور قاعدة البيانات

### أفضل الممارسات:
- ✅ استخدم Event System للتواصل السريع
- ✅ استخدم Database للتواصل الموثوق
- ✅ راقب حالة الـ agents بشكل مستمر
- ✅ سجل جميع الرسائل والتفاعلات

---

## 🔗 روابط مفيدة

- [Cursor Dashboard](https://cursor.com/dashboard?tab=background-agents)
- [Cursor Documentation](https://docs.cursor.com)
- ملف الإعدادات: `cursor_background_agent.json`
- Agent Dashboard: `/admin/agent-dashboard`

---

**تم إنشاء هذا الدليل بواسطة:** Cursor AI Agent 🤖  
**تاريخ الإنشاء:** 2025-01-27  
**آخر تحديث:** 2025-01-27
