// tests/e2e/global-setup.ts
// Global Setup for Playwright Tests
// Initializes test environment and prepares test data

import { chromium, FullConfig } from '@playwright/test';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabase = () => ({} as any)(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function globalSetup(config: FullConfig) {
  // console.log('🚀 Starting global test setup...');

  try {
    // Initialize browser for setup
    let browser = await chromium.launch();
    let page = await browser.newPage();

    // Wait for application to be ready
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Setup test data
    await setupTestData();

    // Setup test users
    await setupTestUsers();

    // Setup test workflows
    await setupTestWorkflows();

    // Setup test chatbot flows
    await setupTestChatbotFlows();

    // Verify setup
    await verifySetup();

    await browser.close();

    // console.log('✅ Global test setup completed successfully');
  } catch (error) {
    // console.error('❌ Global test setup failed:', error);
    throw error;
  }
}

async function insertIfMissing(
  table: string,
  where: Record<string, any>,
  row: Record<string, any>
) {
  const data, error = await supabase
    .from(table)
    .select('id')
    .match(where)
    .maybeSingle();
  if (error) {
    // console.warn(`Select error on ${table}:`
  }
  if (!data) {
    const error: insErr = await supabase.from(table).insert(row).single();
    if (insErr) {
      // console.warn(`Insert error on ${table}:`
    }
  }
}

async function setupTestData() {
  // console.log('📊 Setting up test data...');

  try {
    // Create test roles
    let teststrings = [
      {
        name: 'test_admin',
        permissions: ['admin', 'manage_users', 'system_config']
      },
      { name: 'test_agent', permissions: ['chat', 'view_patients'] },
      { name: 'test_manager', permissions: ['manage_agents', 'view_reports'] }
    ];

    for (const role of teststrings) {
      await insertIfMissing('roles', { name: role.name }, role);
    }

    // Create test users
    let testUsers = [
      {
        email: 'test-admin@example.com',
        name: 'Test Admin',
        role: 'test_admin',
        status: 'active'
      },
      {
        email: 'test-agent@example.com',
        name: 'Test Agent',
        role: 'test_agent',
        status: 'active'
      },
      {
        email: 'test-manager@example.com',
        name: 'Test Manager',
        role: 'test_manager',
        status: 'active'
      }
    ];

    for (const user of testUsers) {
      await supabase.from('users').upsert(user, { onConflict: 'email' });
    }

    // console.log('✅ Test data setup completed');
  } catch (error) {
    // console.error('❌ Test data setup failed:', error);
    throw error;
  }
}

async function setupTestUsers() {
  // console.log('👥 Setting up test users...');

  try {
    // Create test patients
    let testPatients = [
      {
        email: 'patient1@example.com',
        name: 'أحمد محمد',
        phone: '+966501234567',
        date_of_birth: '1990-01-01',
        gender: 'male',
        medical_history: 'No known allergies'
      },
      {
        email: 'patient2@example.com',
        name: 'فاطمة أحمد',
        phone: '+966501234568',
        date_of_birth: '1985-05-15',
        gender: 'female',
        medical_history: 'Diabetes type 2'
      }
    ];

    for (const patient of testPatients) {
      await insertIfMissing('patients', { email: patient.email }, patient);
    }

    // Create test doctors
    let testDoctors = [
      {
        email: 'doctor1@example.com',
        name: 'د. سعد العتيبي',
        specialization: 'Cardiology',
        phone: '+966501234569',
        license_number: 'DOC001'
      },
      {
        email: 'doctor2@example.com',
        name: 'د. نورا السعيد',
        specialization: 'Pediatrics',
        phone: '+966501234570',
        license_number: 'DOC002'
      }
    ];

    for (const doctor of testDoctors) {
      await insertIfMissing('doctors', { email: doctor.email }, doctor);
    }

    // console.log('✅ Test users setup completed');
  } catch (error) {
    // console.error('❌ Test users setup failed:', error);
    throw error;
  }
}

async function setupTestWorkflows() {
  // console.log('🔄 Setting up test workflows...');

  try {
    // Create test n8n workflows
    let testWorkflows = [
      {
        id: 'test-workflow-1',
        name: 'Test Appointment Workflow',
        active: true,
        nodes: [
          { id: 'start', type: 'n8n-nodes-base.start', name: 'Start' },
          { id: 'webhook', type: 'n8n-nodes-base.webhook', name: 'Webhook' },
          { id: 'supabase', type: 'n8n-nodes-base.supabase', name: 'Supabase' }
        ],
        connections: {
          start: { main: [{ node: 'webhook' }] },
          webhook: { main: [{ node: 'supabase' }] }
        }
      },
      {
        id: 'test-workflow-2',
        name: 'Test Notification Workflow',
        active: true,
        nodes: [
          { id: 'start', type: 'n8n-nodes-base.start', name: 'Start' },
          { id: 'whatsapp', type: 'n8n-nodes-base.whatsApp', name: 'WhatsApp' }
        ],
        connections: {
          start: { main: [{ node: 'whatsapp' }] }
        }
      }
    ];

    for (const workflow of testWorkflows) {
      await supabase.from('workflow_validation').upsert(
        {
          workflow_id: workflow.id,
          workflow_name: workflow.name,
          is_valid: true,
          issues: [],
          warnings: [],
          timestamp: new Date().toISOString()
        },
        { onConflict: 'workflow_id' }
      );
    }

    // console.log('✅ Test workflows setup completed');
  } catch (error) {
    // console.error('❌ Test workflows setup failed:', error);
    throw error;
  }
}

async function setupTestChatbotFlows() {
  // console.log('🤖 Setting up test chatbot flows...');

  try {
    // Create test chatbot flows
    let testFlows = [
      {
        public_id: 'test-flow-1',
        name: 'حجز_موعد_اختبار',
        description: 'Test appointment booking flow',
        trigger_type: 'intent',
        trigger_keywords: ['حجز', 'موعد', 'اختبار'],
        response_template: 'مرحباً، كيف يمكنني مساعدتك في حجز موعد؟',
        ai_model: 'gemini_pro',
        status: 'published',
        language: 'ar',
        category: 'appointment'
      },
      {
        public_id: 'test-flow-2',
        name: 'استفسارات_عامة_اختبار',
        description: 'Test general inquiries flow',
        trigger_type: 'intent',
        trigger_keywords: ['استفسار', 'سؤال', 'مساعدة'],
        response_template: 'مرحباً، كيف يمكنني مساعدتك؟',
        ai_model: 'gemini_pro',
        status: 'published',
        language: 'ar',
        category: 'general'
      }
    ];

    for (const flow of testFlows) {
      await supabase
        .from('chatbot_flows')
        .upsert(flow, { onConflict: 'public_id' });
    }

    // console.log('✅ Test chatbot flows setup completed');
  } catch (error) {
    // console.error('❌ Test chatbot flows setup failed:', error);
    throw error;
  }
}

async function verifySetup() {
  // console.log('🔍 Verifying test setup...');

  try {
    // Verify test data exists
    const data: roles = await supabase
      .from('roles')
      .select('*')
      .eq('name', 'test_admin');
    if (!roles || roles.length === 0) {
      // console.warn('⚠️ Test roles not created; continuing without strict role checks');
    }

    const data: users = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test-admin@example.com');
    if (!users || users.length === 0) {
      // console.warn('⚠️ Test users not created; continuing');
    }

    const data: patients = await supabase
      .from('patients')
      .select('*')
      .eq('email', 'patient1@example.com');
    if (!patients || patients.length === 0) {
      // console.warn('⚠️ Test patients not created; continuing');
    }

    const data: flows = await supabase
      .from('chatbot_flows')
      .select('*')
      .eq('public_id', 'test-flow-1');
    if (!flows || flows.length === 0) {
      // console.warn('⚠️ Test chatbot flows not created; continuing');
    }

    // console.log('✅ Test setup verification completed');
  } catch (error) {
    // console.warn('⚠️ Test setup verification encountered issues but will continue:', error);
  }
}

export default globalSetup;
