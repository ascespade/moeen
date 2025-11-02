# 🎯 دليل التحكم والتواصل في Cursor Cloud Entities

## 📋 نظرة عامة - Overview

في Cursor Cloud، يمكنك التحكم بـ **4 entities رئيسية** والتواصل بينها:

1. **🤖 Background Agents** - وكلاء الخلفية الذكية
2. **🔄 Workflows** - سير العمل الآلي
3. **💬 AI Assistants** - المساعدون الذكيون
4. **📝 Rules & Instructions** - القواعد والتعليمات المخصصة

---

## 1️⃣ 🤖 Background Agents (وكلاء الخلفية)

### ما هو Background Agent؟
عامل ذكي يعمل في الخلفية بشكل مستقل لتنفيذ مهام محددة مثل:
- إصلاح الأخطاء تلقائياً
- تشغيل الاختبارات
- تحسين الكود
- مراقبة الجودة

### كيفية التحكم به:

#### أ) عبر ملف التكوين `cursor_background_agent.json`

```json
{
  "name": "Agent Name",
  "mode": "aggressive", // أو "gentle", "balanced"
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

#### ب) عبر Cursor Dashboard
```
1. افتح: https://cursor.com/dashboard?tab=background-agents
2. اختر الـ Agent المطلوب
3. اضبط الإعدادات:
   - Status: Active/Inactive
   - Mode: Aggressive/Gentle/Balanced
   - Objectives: أهداف العمل
   - Execution: إعدادات التنفيذ
```

#### ج) عبر Terminal/Scripts
```bash
# تشغيل الـ Agent
npm run cursor:agent

# تشغيل مستمر
npm run cursor:agent:continuous

# أو مباشرة
node scripts/cursor-background-agent.mjs
```

### التحكم البرمجي:
```typescript
// scripts/cursor-background-agent.mjs
const agentConfig = {
  mode: 'aggressive',
  objectives: {
    build_success: true,
    zero_type_errors: true
  }
};

// إرسال أوامر للـ Agent
await sendCommandToAgent({
  action: 'start',
  config: agentConfig
});
```

---

## 2️⃣ 🔄 Workflows (سير العمل)

### ما هو Workflow؟
سير عمل آلي يعمل عبر GitHub Actions أو أنظمة CI/CD الأخرى.

### كيفية التحكم به:

#### أ) عبر ملفات `.github/workflows/`

```yaml
# .github/workflows/my-workflow.yml
name: My Workflow
on:
  workflow_dispatch:
    inputs:
      mode:
        description: "وضع التشغيل"
        required: true
        default: "auto"
        type: choice
        options:
          - "auto"
          - "fix-only"
          - "test-only"
```

#### ب) عبر GitHub Actions Dashboard
```
1. اذهب إلى: Repository → Actions
2. اختر Workflow المطلوب
3. اضغط "Run workflow"
4. اختر الإعدادات:
   - Branch
   - Mode
   - Inputs
```

#### ج) عبر GitHub CLI
```bash
# تشغيل workflow
gh workflow run my-workflow.yml \
  --ref main \
  -f mode=auto

# عرض حالة workflow
gh run list --workflow=my-workflow.yml

# مشاهدة logs
gh run watch
```

### التحكم البرمجي:
```typescript
// عبر GitHub API
const response = await fetch(
  `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
  {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: {
        mode: 'auto'
      }
    })
  }
);
```

---

## 3️⃣ 💬 AI Assistants (المساعدون الذكيون)

### ما هو AI Assistant؟
مساعد ذكي في محرر Cursor يساعدك في:
- كتابة الكود
- إصلاح الأخطاء
- شرح الكود
- تحسين الأداء

### كيفية التحكم به:

#### أ) عبر Cursor Settings
```
1. Cursor → Settings → Features → AI
2. اضبط:
   - Model Selection
   - Temperature
   - Context Window
   - Auto-suggestions
```

#### ب) عبر `.cursorrules` أو User Rules
```markdown
# .cursorrules
You are an expert in TypeScript and Next.js.
Always use TypeScript strict mode.
Prefer functional components over class components.
```

#### ج) عبر Command Palette
```
1. Cmd/Ctrl + Shift + P
2. ابحث عن:
   - "Cursor: Chat"
   - "Cursor: Explain Code"
   - "Cursor: Refactor"
```

### التحكم البرمجي (API):
```typescript
// Cursor AI API (إذا كان متاحاً)
const assistant = new CursorAI({
  model: 'gpt-4',
  temperature: 0.7,
  contextWindow: 8000
});

await assistant.chat({
  message: 'Fix TypeScript errors',
  context: codeContext
});
```

---

## 4️⃣ 📝 Rules & Instructions (القواعد والتعليمات)

### ما هي Rules؟
قواعد وتعليمات مخصصة تحدد سلوك Cursor AI في مشروعك.

### كيفية التحكم به:

#### أ) عبر ملفات Rules في المشروع
```
1. .cursorrules - قواعد عامة للمشروع
2. .cursor/ - مجلد قواعد إضافية
3. User Rules - قواعد المستخدم الشخصية
```

#### ب) عبر Cursor Settings → Rules
```
1. Cursor → Settings → Rules
2. أضف قواعد جديدة:
   - Project-specific rules
   - Language-specific rules
   - Framework-specific rules
```

#### ج) عبر Workspace Rules
```markdown
# في ملف .cursorrules
## STRICT PROJECT RULES
- ❌ FORBIDDEN: Hardcoded data
- ✅ REQUIRED: All data from database
- ✅ Use centralized color system
```

---

## 🔗 التواصل بين الـ 4 Entities

### 1️⃣ Background Agent ↔ Workflow

#### أ) من Agent إلى Workflow:
```json
// cursor_background_agent.json
{
  "execution": {
    "trigger_workflow": true,
    "workflow_name": "ai-self-healing.yml",
    "workflow_inputs": {
      "mode": "auto",
      "source": "background-agent"
    }
  }
}
```

#### ب) من Workflow إلى Agent:
```yaml
# .github/workflows/my-workflow.yml
- name: Trigger Background Agent
  run: |
    curl -X POST https://api.cursor.sh/v1/background-agent/trigger \
      -H "Authorization: Bearer ${{ secrets.CURSOR_API_KEY }}" \
      -H "Content-Type: application/json" \
      -d '{
        "action": "start",
        "config": {
          "mode": "aggressive"
        }
      }'
```

### 2️⃣ Background Agent ↔ AI Assistant

#### التواصل عبر Shared Context:
```typescript
// Agent يشارك نتائج مع Assistant
const agentResults = {
  errors: [...],
  fixes: [...],
  suggestions: [...]
};

// حفظ في ملف مشترك
await writeFile(
  '.cursor/agent-context.json',
  JSON.stringify(agentResults)
);

// Assistant يقرأ النتائج
const context = await readFile('.cursor/agent-context.json');
await assistant.chat({
  message: 'Review and improve these fixes',
  context: context
});
```

### 3️⃣ Workflow ↔ AI Assistant

#### عبر GitHub Actions Comments:
```yaml
- name: Get AI Review
  run: |
    response=$(curl -X POST https://api.cursor.sh/v1/chat \
      -H "Authorization: Bearer ${{ secrets.CURSOR_API_KEY }}" \
      -d '{
        "message": "Review this PR",
        "context": "${{ github.event.pull_request.diff }}"
      }')
    
    echo "$response" >> ai-review.md
```

### 4️⃣ Rules ↔ جميع Entities

#### Rules تؤثر على الجميع:
```markdown
# .cursorrules
## Auto-fix Rules
- When TypeScript errors detected → Auto-fix via Background Agent
- When lint errors found → Trigger workflow
- When code quality < threshold → Ask AI Assistant for review
```

---

## 🎛️ لوحة تحكم موحدة (Unified Control Panel)

### إنشاء لوحة تحكم لجميع Entities:

```typescript
// scripts/cursor-cloud-controller.ts
interface CursorCloudController {
  // Background Agents
  startAgent(config: AgentConfig): Promise<void>;
  stopAgent(agentId: string): Promise<void>;
  getAgentStatus(agentId: string): Promise<AgentStatus>;
  
  // Workflows
  triggerWorkflow(workflow: string, inputs: WorkflowInputs): Promise<void>;
  getWorkflowStatus(runId: string): Promise<WorkflowStatus>;
  
  // AI Assistant
  sendMessage(message: string, context?: any): Promise<string>;
  setRules(rules: string): Promise<void>;
  
  // Rules
  updateRules(rules: RulesConfig): Promise<void>;
  getActiveRules(): Promise<RulesConfig>;
}

class CursorCloudControllerImpl implements CursorCloudController {
  private agentClient: AgentClient;
  private workflowClient: WorkflowClient;
  private assistantClient: AssistantClient;
  private rulesManager: RulesManager;
  
  async startAgent(config: AgentConfig) {
    await this.agentClient.start(config);
    // إشعار Workflow
    await this.workflowClient.trigger('agent-started', {
      agentId: config.id
    });
  }
  
  async triggerWorkflow(workflow: string, inputs: WorkflowInputs) {
    const runId = await this.workflowClient.dispatch(workflow, inputs);
    // إشعار Agent
    await this.agentClient.notify('workflow-triggered', {
      workflow,
      runId
    });
    return runId;
  }
}
```

---

## 📊 مثال عملي: نظام متكامل

### سيناريو: إصلاح تلقائي للأخطاء

```typescript
// 1. AI Assistant يكتشف خطأ
const error = await assistant.analyze(code);
if (error) {
  // 2. إرسال للـ Background Agent
  await agent.fixError({
    error,
    priority: 'high',
    autoCommit: true
  });
  
  // 3. Agent يطلق Workflow للاختبار
  await workflow.trigger('ai-self-healing.yml', {
    mode: 'fix-only',
    source: 'assistant-detected-error'
  });
  
  // 4. Workflow يعيد النتائج للـ Assistant
  const results = await workflow.waitForCompletion(runId);
  await assistant.review({
    message: 'Review these fixes',
    context: results
  });
}
```

---

## 🔐 الأمان والتفويض

### API Keys المطلوبة:

```bash
# .env
CURSOR_API_KEY=your_cursor_api_key
GITHUB_TOKEN=your_github_token
CURSOR_CLOUD_SECRET=your_cloud_secret
```

### الصلاحيات:
- **Background Agents**: تحتاج `cursor:agent:control`
- **Workflows**: تحتاج `github:actions:write`
- **AI Assistant**: تحتاج `cursor:assistant:chat`
- **Rules**: تحتاج `cursor:rules:write`

---

## 📚 موارد إضافية

### الوثائق الرسمية:
- [Cursor Background Agents](https://cursor.com/docs/background-agents)
- [Cursor AI API](https://cursor.com/docs/api)
- [GitHub Actions](https://docs.github.com/en/actions)

### أمثلة في المشروع:
- `cursor_background_agent.json` - تكوين Agent
- `.github/workflows/` - Workflows
- `.cursorrules` - Rules
- `scripts/cursor-background-agent.mjs` - Scripts

---

## ❓ الأسئلة الشائعة

### Q: هل يمكن للـ 4 entities التواصل في الوقت الفعلي؟
**A:** نعم، عبر:
- Shared files (JSON, logs)
- API calls
- Webhooks
- Event system

### Q: كيف أتحكم في Entity واحد فقط؟
**A:** استخدم:
- Cursor Dashboard للـ Agents
- GitHub Actions للـ Workflows
- Cursor Settings للـ Assistant
- `.cursorrules` للـ Rules

### Q: هل يمكن تشغيل Entities بالتوازي؟
**A:** نعم، يمكن:
- تشغيل Agents متعددة
- Workflows متوازية
- Assistant مع Agent في نفس الوقت

---

**آخر تحديث:** 2025-01-29
**النسخة:** 1.0.0