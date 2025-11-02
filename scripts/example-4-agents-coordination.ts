/**
 * مثال عملي: تنسيق عمل 4 Agents معًا
 * 
 * هذا المثال يوضح كيفية:
 * 1. إنشاء 4 agents مختلفة
 * 2. التحكم بكل agent منفردًا
 * 3. التواصل بينهم
 */

import {
  getAgentCommunication,
  registerAgent,
  sendAgentMessage,
  waitForMessage,
  AgentCoordinator,
  type AgentStatus,
} from '../src/lib/agent/agent-communication';

// تعريف الـ 4 Agents
const AGENT_IDS = {
  TYPESCRIPT_FIXER: 'agent-typescript-fixer',
  ESLINT_FIXER: 'agent-eslint-fixer',
  TEST_RUNNER: 'agent-test-runner',
  QUALITY_CHECKER: 'agent-quality-checker',
} as const;

/**
 * Agent #1: TypeScript Fixer
 * يصلح أخطاء TypeScript
 */
async function agent1TypeScriptFixer() {
  const agentId = AGENT_IDS.TYPESCRIPT_FIXER;
  const comm = getAgentCommunication();

  // تسجيل الـ agent
  registerAgent(agentId, 'TypeScript Fixer', {
    status: 'running',
    currentTask: 'Fixing TypeScript errors...',
  });

  console.log(`🤖 [${agentId}] Starting TypeScript fixes...`);

  try {
    // محاكاة إصلاح الأخطاء
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const errorsFixed = 15;
    const filesModified = 8;

    // تحديث الحالة
    comm.updateAgentStatus(agentId, {
      status: 'completed',
      currentTask: 'TypeScript errors fixed',
      progress: 100,
      metadata: {
        errorsFixed,
        filesModified,
      },
    });

    // إرسال رسالة للـ agents الأخرى
    sendAgentMessage(agentId, AGENT_IDS.ESLINT_FIXER, 'typescript-completed', {
      errorsFixed,
      filesModified,
      timestamp: Date.now(),
    });

    console.log(`✅ [${agentId}] Completed! Fixed ${errorsFixed} errors in ${filesModified} files`);

    return { errorsFixed, filesModified };
  } catch (error) {
    comm.updateAgentStatus(agentId, {
      status: 'error',
      currentTask: `Error: ${error}`,
    });
    throw error;
  }
}

/**
 * Agent #2: ESLint Fixer
 * يصلح أخطاء ESLint (ينتظر Agent #1)
 */
async function agent2ESLintFixer() {
  const agentId = AGENT_IDS.ESLINT_FIXER;
  const comm = getAgentCommunication();

  registerAgent(agentId, 'ESLint Fixer', {
    status: 'idle',
    currentTask: 'Waiting for TypeScript fixes...',
  });

  console.log(`🤖 [${agentId}] Waiting for TypeScript fixes to complete...`);

  try {
    // انتظار إكمال Agent #1
    const message = await waitForMessage(agentId, 'typescript-completed', 60000);
    console.log(`📨 [${agentId}] Received message from Agent #1:`, message?.data);

    // تحديث الحالة
    comm.updateAgentStatus(agentId, {
      status: 'running',
      currentTask: 'Fixing ESLint errors...',
    });

    console.log(`🤖 [${agentId}] Starting ESLint fixes...`);

    // محاكاة إصلاح الأخطاء
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const lintErrorsFixed = 10;

    comm.updateAgentStatus(agentId, {
      status: 'completed',
      currentTask: 'ESLint errors fixed',
      progress: 100,
      metadata: {
        lintErrorsFixed,
      },
    });

    // إرسال رسالة للـ Agent #3
    sendAgentMessage(agentId, AGENT_IDS.TEST_RUNNER, 'eslint-completed', {
      lintErrorsFixed,
      previousResults: message?.data,
    });

    console.log(`✅ [${agentId}] Completed! Fixed ${lintErrorsFixed} lint errors`);

    return { lintErrorsFixed };
  } catch (error) {
    comm.updateAgentStatus(agentId, {
      status: 'error',
      currentTask: `Error: ${error}`,
    });
    throw error;
  }
}

/**
 * Agent #3: Test Runner
 * يشغل الاختبارات (ينتظر Agent #2)
 */
async function agent3TestRunner() {
  const agentId = AGENT_IDS.TEST_RUNNER;
  const comm = getAgentCommunication();

  registerAgent(agentId, 'Test Runner', {
    status: 'idle',
    currentTask: 'Waiting for ESLint fixes...',
  });

  console.log(`🤖 [${agentId}] Waiting for ESLint fixes to complete...`);

  try {
    // انتظار إكمال Agent #2
    const message = await waitForMessage(agentId, 'eslint-completed', 60000);
    console.log(`📨 [${agentId}] Received message from Agent #2:`, message?.data);

    comm.updateAgentStatus(agentId, {
      status: 'running',
      currentTask: 'Running tests...',
    });

    console.log(`🤖 [${agentId}] Running tests...`);

    // محاكاة تشغيل الاختبارات
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const testsPassed = 147;
    const testsFailed = 0;

    comm.updateAgentStatus(agentId, {
      status: 'completed',
      currentTask: 'All tests passed',
      progress: 100,
      metadata: {
        testsPassed,
        testsFailed,
      },
    });

    // إرسال رسالة للـ Agent #4
    sendAgentMessage(agentId, AGENT_IDS.QUALITY_CHECKER, 'tests-completed', {
      testsPassed,
      testsFailed,
      previousResults: message?.data,
    });

    console.log(`✅ [${agentId}] Completed! ${testsPassed} tests passed, ${testsFailed} failed`);

    return { testsPassed, testsFailed };
  } catch (error) {
    comm.updateAgentStatus(agentId, {
      status: 'error',
      currentTask: `Error: ${error}`,
    });
    throw error;
  }
}

/**
 * Agent #4: Quality Checker
 * يفحص الجودة النهائية (ينتظر Agent #3)
 */
async function agent4QualityChecker() {
  const agentId = AGENT_IDS.QUALITY_CHECKER;
  const comm = getAgentCommunication();

  registerAgent(agentId, 'Quality Checker', {
    status: 'idle',
    currentTask: 'Waiting for tests to complete...',
  });

  console.log(`🤖 [${agentId}] Waiting for tests to complete...`);

  try {
    // انتظار إكمال Agent #3
    const message = await waitForMessage(agentId, 'tests-completed', 60000);
    console.log(`📨 [${agentId}] Received message from Agent #3:`, message?.data);

    comm.updateAgentStatus(agentId, {
      status: 'running',
      currentTask: 'Running quality checks...',
    });

    console.log(`🤖 [${agentId}] Running quality checks...`);

    // محاكاة فحص الجودة
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const qualityReport = {
      codeQuality: 'excellent',
      testCoverage: 95,
      performance: 92,
      accessibility: 90,
      seo: 88,
    };

    comm.updateAgentStatus(agentId, {
      status: 'completed',
      currentTask: 'Quality check completed',
      progress: 100,
      metadata: qualityReport,
    });

    console.log(`✅ [${agentId}] Completed! Quality Report:`, qualityReport);

    // إرسال تقرير نهائي
    sendAgentMessage(agentId, 'coordinator', 'all-agents-completed', {
      qualityReport,
      previousResults: message?.data,
    });

    return qualityReport;
  } catch (error) {
    comm.updateAgentStatus(agentId, {
      status: 'error',
      currentTask: `Error: ${error}`,
    });
    throw error;
  }
}

/**
 * طريقة 1: تشغيل الـ Agents بشكل مستقل مع التنسيق
 */
export async function runAgentsIndependently() {
  console.log('🚀 Starting 4 Agents independently...\n');

  // تشغيل جميع الـ agents بشكل متوازي
  // كل agent سينتظر الـ agent السابق
  const promises = [
    agent1TypeScriptFixer(),
    agent2ESLintFixer(),
    agent3TestRunner(),
    agent4QualityChecker(),
  ];

  try {
    const results = await Promise.all(promises);
    console.log('\n✅ All agents completed successfully!');
    console.log('Results:', results);
    return results;
  } catch (error) {
    console.error('\n❌ Error in agents execution:', error);
    throw error;
  }
}

/**
 * طريقة 2: استخدام Agent Coordinator للتنسيق التسلسلي
 */
export async function runAgentsWithCoordinator() {
  console.log('🚀 Starting 4 Agents with Coordinator...\n');

  const coordinator = new AgentCoordinator([
    AGENT_IDS.TYPESCRIPT_FIXER,
    AGENT_IDS.ESLINT_FIXER,
    AGENT_IDS.TEST_RUNNER,
    AGENT_IDS.QUALITY_CHECKER,
  ]);

  try {
    // تشغيل الـ agents بشكل تسلسلي
    const results = await coordinator.runSequence({
      startTime: Date.now(),
    });

    console.log('\n✅ All agents completed successfully!');
    console.log('Final Results:', results);
    return results;
  } catch (error) {
    console.error('\n❌ Error in coordinator execution:', error);
    throw error;
  }
}

/**
 * طريقة 3: التحكم اليدوي في كل Agent
 */
export async function manualAgentControl() {
  console.log('🎛️ Manual Agent Control Mode\n');

  const comm = getAgentCommunication();

  // تشغيل Agent #1
  console.log('▶️  Starting Agent #1...');
  const agent1Promise = agent1TypeScriptFixer();

  // انتظار ثم تشغيل Agent #2
  await agent1Promise;
  console.log('\n▶️  Starting Agent #2...');
  const agent2Promise = agent2ESLintFixer();

  // انتظار ثم تشغيل Agent #3
  await agent2Promise;
  console.log('\n▶️  Starting Agent #3...');
  const agent3Promise = agent3TestRunner();

  // انتظار ثم تشغيل Agent #4
  await agent3Promise;
  console.log('\n▶️  Starting Agent #4...');
  const agent4Promise = agent4QualityChecker();

  // انتظار إكمال Agent #4
  const finalResult = await agent4Promise;

  console.log('\n✅ All agents completed!');
  console.log('Final Status:', comm.getAllAgentStatuses());

  return finalResult;
}

/**
 * مثال: إيقاف Agent محدد
 */
export async function stopAgent(agentId: string) {
  const comm = getAgentCommunication();
  comm.updateAgentStatus(agentId, {
    status: 'paused',
    currentTask: 'Paused by user',
  });
  console.log(`⏸️  Agent ${agentId} paused`);
}

/**
 * مثال: استئناف Agent محدد
 */
export async function resumeAgent(agentId: string) {
  const comm = getAgentCommunication();
  comm.updateAgentStatus(agentId, {
    status: 'running',
    currentTask: 'Resumed by user',
  });
  console.log(`▶️  Agent ${agentId} resumed`);
}

/**
 * عرض حالة جميع الـ Agents
 */
export function displayAgentStatuses() {
  const comm = getAgentCommunication();
  const statuses = comm.getAllAgentStatuses();

  console.log('\n📊 Agent Statuses:');
  console.log('─'.repeat(60));

  statuses.forEach((status) => {
    const emoji = {
      idle: '💤',
      running: '⚙️',
      paused: '⏸️',
      completed: '✅',
      error: '❌',
    }[status.status];

    console.log(
      `${emoji} ${status.agentId}`,
      `| Status: ${status.status}`,
      `| Task: ${status.currentTask || 'N/A'}`,
      `| Progress: ${status.progress || 0}%`
    );
  });

  console.log('─'.repeat(60));
}

// إذا تم تشغيل الملف مباشرة
if (require.main === module) {
  console.log('🎯 Example: 4 Agents Coordination\n');

  // اختر طريقة التشغيل
  const mode = process.argv[2] || 'independent';

  switch (mode) {
    case 'independent':
      runAgentsIndependently()
        .then(() => displayAgentStatuses())
        .catch(console.error);
      break;

    case 'coordinator':
      runAgentsWithCoordinator()
        .then(() => displayAgentStatuses())
        .catch(console.error);
      break;

    case 'manual':
      manualAgentControl()
        .then(() => displayAgentStatuses())
        .catch(console.error);
      break;

    default:
      console.log('Usage: ts-node example-4-agents-coordination.ts [independent|coordinator|manual]');
  }
}
