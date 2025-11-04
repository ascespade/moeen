const fs = require('fs');
const path = require('path');

const keyMappings = {
  'common.save': 'I18N_KEYS.COMMON.SAVE',
  'common.cancel': 'I18N_KEYS.COMMON.CANCEL',
  'common.delete': 'I18N_KEYS.COMMON.DELETE',
  'common.edit': 'I18N_KEYS.COMMON.EDIT',
  'common.loading': 'I18N_KEYS.COMMON.LOADING',
  'common.error': 'I18N_KEYS.COMMON.ERROR',
  'common.required': 'I18N_KEYS.COMMON.REQUIRED',
  'common.completed': 'I18N_KEYS.COMMON.COMPLETED',
  'common.processing': 'I18N_KEYS.COMMON.PROCESSING',
  'common.activating': 'I18N_KEYS.COMMON.ACTIVATING',
  'common.submitting': 'I18N_KEYS.COMMON.SUBMITTING',
  'common.creating': 'I18N_KEYS.COMMON.CREATING',
  'common.enabled': 'I18N_KEYS.COMMON.ENABLED',
  'common.disabled': 'I18N_KEYS.COMMON.DISABLED',
  'common.active': 'I18N_KEYS.COMMON.ACTIVE',
  'common.systemName': 'I18N_KEYS.COMMON.SYSTEM_NAME',
  'common.searchPlaceholder': 'I18N_KEYS.COMMON.SEARCH_PLACEHOLDER',
  'common.openMenu': 'I18N_KEYS.COMMON.OPEN_MENU',
  'nav.dashboard': 'I18N_KEYS.NAV.DASHBOARD',
  'nav.services': 'I18N_KEYS.NAV.SERVICES',
  'nav.about': 'I18N_KEYS.NAV.ABOUT',
  'nav.gallery': 'I18N_KEYS.NAV.GALLERY',
  'nav.contact': 'I18N_KEYS.NAV.CONTACT',
  'nav.login': 'I18N_KEYS.NAV.LOGIN',
  'nav.register': 'I18N_KEYS.NAV.REGISTER',
  'nav.patients': 'I18N_KEYS.NAV.PATIENTS',
  'nav.appointments': 'I18N_KEYS.NAV.APPOINTMENTS',
  'nav.sessions': 'I18N_KEYS.NAV.SESSIONS',
  'auth.unauthorized': 'I18N_KEYS.AUTH.UNAUTHORIZED',
  'auth.insufficient_permissions': 'I18N_KEYS.AUTH.INSUFFICIENT_PERMISSIONS',
  'auth.back_to_dashboard': 'I18N_KEYS.AUTH.BACK_TO_DASHBOARD',
  'admin.modules': 'I18N_KEYS.ADMIN.MODULES',
  'admin.aiFeatures': 'I18N_KEYS.ADMIN.AI_FEATURES',
  'admin.security': 'I18N_KEYS.ADMIN.SECURITY',
  'admin.automation': 'I18N_KEYS.ADMIN.AUTOMATION',
  'admin.systemConfiguration': 'I18N_KEYS.ADMIN.SYSTEM_CONFIGURATION',
  'admin.healthcareModules': 'I18N_KEYS.ADMIN.HEALTHCARE_MODULES',
  'admin.capabilities': 'I18N_KEYS.ADMIN.CAPABILITIES',
  'admin.integrations': 'I18N_KEYS.ADMIN.INTEGRATIONS',
  'admin.securitySettings': 'I18N_KEYS.ADMIN.SECURITY_SETTINGS',
  'admin.automationSettings': 'I18N_KEYS.ADMIN.AUTOMATION_SETTINGS',
  'admin.scheduledJobs': 'I18N_KEYS.ADMIN.SCHEDULED_JOBS',
  'admin.active': 'I18N_KEYS.ADMIN.ACTIVE',
  'header.welcome': 'I18N_KEYS.HEADER.WELCOME',
  'header.profile': 'I18N_KEYS.HEADER.PROFILE',
  'header.settings': 'I18N_KEYS.HEADER.SETTINGS',
  'header.logout': 'I18N_KEYS.HEADER.LOGOUT',
  'header.notifications': 'I18N_KEYS.HEADER.NOTIFICATIONS',
  'header.noNotifications': 'I18N_KEYS.HEADER.NO_NOTIFICATIONS',
  'header.notification': 'I18N_KEYS.HEADER.NOTIFICATION',
  'header.markAsRead': 'I18N_KEYS.HEADER.MARK_AS_READ',
  'header.aiFeatures': 'I18N_KEYS.HEADER.AI_FEATURES',
  'header.chatbot': 'I18N_KEYS.HEADER.CHATBOT',
  'header.chatbotStatus': 'I18N_KEYS.HEADER.CHATBOT_STATUS',
  'header.voiceBot': 'I18N_KEYS.HEADER.VOICE_BOT',
  'header.voiceBotStatus': 'I18N_KEYS.HEADER.VOICE_BOT_STATUS',
  'header.emotionAnalytics': 'I18N_KEYS.HEADER.EMOTION_ANALYTICS',
  'header.emotionAnalyticsStatus': 'I18N_KEYS.HEADER.EMOTION_ANALYTICS_STATUS',
  'header.earlyDiagnosis': 'I18N_KEYS.HEADER.EARLY_DIAGNOSIS',
  'header.earlyDiagnosisStatus': 'I18N_KEYS.HEADER.EARLY_DIAGNOSIS_STATUS',
  'theme.label': 'I18N_KEYS.THEME.LABEL',
  'language.label': 'I18N_KEYS.LANGUAGE.LABEL',
  'patient.checklist.title': 'I18N_KEYS.PATIENTS.CHECKLIST.TITLE',
  'patient.checklist.submit': 'I18N_KEYS.PATIENTS.CHECKLIST.SUBMIT',
  'patient.activation.title': 'I18N_KEYS.PATIENTS.ACTIVATION.TITLE',
  'insurance.claims.title': 'I18N_KEYS.INSURANCE.CLAIMS_TITLE',
  'insurance.claims.create': 'I18N_KEYS.INSURANCE.CREATE',
  'insurance.claims.submit': 'I18N_KEYS.INSURANCE.SUBMIT',
};

let stats = { filesProcessed: 0, filesModified: 0, replacements: 0, importsAdded: 0 };

function getAllTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next' && file !== 'dist' && file !== 'build') {
        getAllTsFiles(filePath, fileList);
      }
    } else if (file.match(/\.(ts|tsx)$/) && !file.endsWith('.d.ts')) {
      if (!file.includes('.test.') && !file.includes('.spec.') && !file.endsWith('i18n-keys.ts')) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

function hasI18nImport(content) {
  return /import.*I18N_KEYS.*from.*['"]@\/constants\/i18n-keys['"]/.test(content);
}

function addI18nImport(content) {
  const importRegex = /^import\s+.*?from\s+['"].*?['"];?$/gm;
  const imports = content.match(importRegex) || [];
  if (imports.length === 0) {
    return "import { I18N_KEYS } from '@/constants/i18n-keys';\n" + content;
  }
  const lastImport = imports[imports.length - 1];
  const lastImportIndex = content.lastIndexOf(lastImport);
  const afterLastImport = lastImportIndex + lastImport.length;
  const needsNewline = content[afterLastImport] !== '\n';
  const importStatement = needsNewline ? "\nimport { I18N_KEYS } from '@/constants/i18n-keys';\n" : "import { I18N_KEYS } from '@/constants/i18n-keys';\n";
  return content.slice(0, afterLastImport) + importStatement + content.slice(afterLastImport);
}

function replaceKeys(content) {
  let newContent = content;
  let replacements = 0;
  const sortedKeys = Object.keys(keyMappings).sort((a, b) => b.length - a.length);
  for (const oldKey of sortedKeys) {
    const newKey = keyMappings[oldKey];
    const escapedKey = oldKey.replace(/\./g, '\\.');
    const pattern1 = new RegExp("t\\(['"]" + escapedKey + "['"]", 'g');
    const pattern2 = new RegExp('t\\(`' + escapedKey + '`', 'g');
    const matches1 = newContent.match(pattern1);
    const matches2 = newContent.match(pattern2);
    if (matches1) {
      newContent = newContent.replace(pattern1, 't(' + newKey);
      replacements += matches1.length;
    }
    if (matches2) {
      newContent = newContent.replace(pattern2, 't(' + newKey);
      replacements += matches2.length;
    }
  }
  return { content: newContent, replacements };
}

function processFile(filePath) {
  try {
    stats.filesProcessed++;
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const { content: newContent, replacements } = replaceKeys(content);
    if (replacements > 0) {
      content = newContent;
      stats.replacements += replacements;
      if (!hasI18nImport(content)) {
        content = addI18nImport(content);
        stats.importsAdded++;
      }
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      console.log('âœ“ ' + filePath + ' (' + replacements + ' replacements)');
      return true;
    }
    return false;
  } catch (error) {
    console.error('âœ— Error: ' + filePath + ': ' + error.message);
    return false;
  }
}

function main() {
  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  console.log('ðŸ” Searching for TypeScript files...');
  if (!fs.existsSync(srcDir)) {
    console.error('âœ— src directory not found!');
    process.exit(1);
  }
  const files = getAllTsFiles(srcDir);
  console.log('Found ' + files.length + ' files to process\n');
  console.log('ðŸ”„ Processing files...\n');
  files.forEach(processFile);
  console.log('\nâœ… Complete! Processed: ' + stats.filesProcessed + ', Modified: ' + stats.filesModified + ', Replacements: ' + stats.replacements + ', Imports: ' + stats.importsAdded);
}

main();