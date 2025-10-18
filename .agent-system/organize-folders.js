#!/usr/bin/env node
/**
 * 📁 Organize Folders - تنظيم آمن للمجلدات
 * ينظم هيكل المشروع ويضع الملفات في مجلداتها الصحيحة
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n📁 Organize Folders Agent Starting...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const BACKUP_DIR = 'tmp/backup-folders-' + Date.now();
const LOG_FILE = 'tmp/organize-folders.log';

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (err) {
    // Ignore
  }
}

// النسخ الاحتياطي
function createBackup() {
  log('Creating backup...', 'info');
  try {
    execSync(`mkdir -p ${BACKUP_DIR}`, { stdio: 'inherit' });
    execSync(`cp -r src ${BACKUP_DIR}/src`, { stdio: 'inherit' });
    log(`✅ Backup created at ${BACKUP_DIR}`, 'success');
    return true;
  } catch (error) {
    log(`❌ Backup failed: ${error.message}`, 'error');
    return false;
  }
}

// تنظيم الـ components
function organizeComponents() {
  log('\n📦 Organizing components...', 'info');
  
  const componentsDir = 'src/components';
  let organized = 0;
  
  try {
    // التصنيفات الموصى بها
    const categories = {
      'ui': ['Button', 'Input', 'Modal', 'Card', 'Badge', 'Alert', 'Spinner', 'Toast'],
      'forms': ['Form', 'Field', 'Select', 'Checkbox', 'Radio', 'DatePicker'],
      'layout': ['Header', 'Footer', 'Sidebar', 'Navigation', 'Container'],
      'common': ['Loading', 'Error', 'Empty', 'NotFound'],
      'auth': ['Login', 'Register', 'ForgotPassword', 'ResetPassword'],
      'admin': ['AdminPanel', 'Dashboard', 'Stats'],
      'patient': ['PatientCard', 'PatientList', 'PatientProfile'],
      'booking': ['BookingForm', 'Calendar', 'TimeSlot', 'SessionType'],
      'chatbot': ['Chatbot', 'Message', 'ChatInput']
    };
    
    // قراءة المكونات الموجودة
    if (fs.existsSync(componentsDir)) {
      const files = fs.readdirSync(componentsDir);
      
      for (const file of files) {
        const filePath = path.join(componentsDir, file);
        const stats = fs.statSync(filePath);
        
        // تخطي المجلدات
        if (stats.isDirectory()) continue;
        
        // تخطي غير TSX/JSX
        if (!file.endsWith('.tsx') && !file.endsWith('.jsx')) continue;
        
        // إيجاد الفئة المناسبة
        let targetCategory = 'common';
        const componentName = file.replace(/\.(tsx|jsx)$/, '');
        
        for (const [category, keywords] of Object.entries(categories)) {
          if (keywords.some(keyword => componentName.includes(keyword))) {
            targetCategory = category;
            break;
          }
        }
        
        // إنشاء المجلد إذا لم يكن موجوداً
        const targetDir = path.join(componentsDir, targetCategory);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // نقل الملف إذا كان في مكان خاطئ
        const targetPath = path.join(targetDir, file);
        if (filePath !== targetPath && !fs.existsSync(targetPath)) {
          fs.renameSync(filePath, targetPath);
          log(`   ✅ Moved: ${file} → ${targetCategory}/`, 'success');
          organized++;
        }
      }
    }
    
    log(`\n   Organized ${organized} components\n`, 'info');
    return organized;
    
  } catch (error) {
    log(`   ❌ Error organizing components: ${error.message}`, 'error');
    return 0;
  }
}

// تنظيم الـ lib
function organizeLib() {
  log('📚 Organizing lib...', 'info');
  
  const libDir = 'src/lib';
  let organized = 0;
  
  try {
    // المجلدات الموصى بها
    const recommendedFolders = [
      'api',           // API clients
      'auth',          // Authentication
      'hooks',         // Custom hooks
      'utils',         // Utility functions
      'constants',     // Constants
      'types',         // TypeScript types
      'config',        // Configuration
      'validations',   // Validation schemas
      'helpers',       // Helper functions
      'services',      // Business logic
      'supabase',      // Supabase client
      'monitoring',    // Logging & monitoring
      'notifications', // Notifications
      'integrations'   // Third-party integrations
    ];
    
    // إنشاء المجلدات إذا لم تكن موجودة
    for (const folder of recommendedFolders) {
      const folderPath = path.join(libDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        log(`   ✅ Created: lib/${folder}/`, 'success');
        organized++;
      }
    }
    
    log(`\n   Organized ${organized} lib folders\n`, 'info');
    return organized;
    
  } catch (error) {
    log(`   ❌ Error organizing lib: ${error.message}`, 'error');
    return 0;
  }
}

// تنظيف الملفات المكررة
function findDuplicates() {
  log('🔍 Finding duplicate files...', 'info');
  
  const duplicates = [];
  const fileHashes = {};
  
  try {
    // البحث في src
    const findFiles = (dir) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          // تخطي node_modules و .next و .git
          if (!['node_modules', '.next', '.git', 'tmp'].includes(file)) {
            findFiles(filePath);
          }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          const content = fs.readFileSync(filePath, 'utf8');
          const size = stats.size;
          const key = `${file}-${size}`;
          
          if (fileHashes[key]) {
            // تحقق من المحتوى
            const existingContent = fs.readFileSync(fileHashes[key], 'utf8');
            if (content === existingContent) {
              duplicates.push({
                file1: fileHashes[key],
                file2: filePath
              });
            }
          } else {
            fileHashes[key] = filePath;
          }
        }
      }
    };
    
    findFiles('src');
    
    if (duplicates.length > 0) {
      log(`\n   ⚠️  Found ${duplicates.length} duplicate files:`, 'warn');
      duplicates.forEach(dup => {
        log(`      ${dup.file1}`, 'warn');
        log(`      ${dup.file2}`, 'warn');
        log('', 'info');
      });
    } else {
      log('   ✅ No duplicates found', 'success');
    }
    
    return duplicates.length;
    
  } catch (error) {
    log(`   ❌ Error finding duplicates: ${error.message}`, 'error');
    return 0;
  }
}

// تنظيم API routes
function organizeAPIRoutes() {
  log('\n🌐 Organizing API routes...', 'info');
  
  const apiDir = 'src/app/api';
  let organized = 0;
  
  try {
    // الفئات الموصى بها
    const categories = {
      'auth': ['login', 'register', 'logout', 'forgot-password', 'reset-password'],
      'users': ['users', 'profile'],
      'patients': ['patients'],
      'appointments': ['appointments', 'sessions'],
      'payments': ['payments', 'invoices'],
      'notifications': ['notifications', 'messages'],
      'admin': ['admin', 'settings'],
      'reports': ['reports', 'analytics']
    };
    
    if (fs.existsSync(apiDir)) {
      const routes = fs.readdirSync(apiDir);
      
      for (const route of routes) {
        const routePath = path.join(apiDir, route);
        const stats = fs.statSync(routePath);
        
        if (stats.isDirectory()) {
          // تحقق من التصنيف
          let hasCategory = false;
          for (const category of Object.keys(categories)) {
            if (route.startsWith(category)) {
              hasCategory = true;
              break;
            }
          }
          
          if (!hasCategory) {
            log(`   ⚠️  Uncategorized route: /api/${route}`, 'warn');
          }
        }
      }
    }
    
    log(`\n   Checked API routes organization\n`, 'info');
    return organized;
    
  } catch (error) {
    log(`   ❌ Error organizing API routes: ${error.message}`, 'error');
    return 0;
  }
}

// إنشاء index.ts files
function createIndexFiles() {
  log('📄 Creating index.ts files...', 'info');
  
  let created = 0;
  
  try {
    const dirs = [
      'src/components/ui',
      'src/components/forms',
      'src/components/layout',
      'src/lib/utils',
      'src/lib/hooks',
      'src/lib/helpers'
    ];
    
    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        const indexPath = path.join(dir, 'index.ts');
        
        if (!fs.existsSync(indexPath)) {
          // قراءة الملفات
          const files = fs.readdirSync(dir).filter(f => 
            (f.endsWith('.ts') || f.endsWith('.tsx')) && f !== 'index.ts'
          );
          
          // إنشاء exports
          const exports = files.map(file => {
            const name = file.replace(/\.(ts|tsx)$/, '');
            return `export * from './${name}';`;
          }).join('\n');
          
          if (exports) {
            fs.writeFileSync(indexPath, exports + '\n');
            log(`   ✅ Created: ${indexPath}`, 'success');
            created++;
          }
        }
      }
    }
    
    log(`\n   Created ${created} index files\n`, 'info');
    return created;
    
  } catch (error) {
    log(`   ❌ Error creating index files: ${error.message}`, 'error');
    return 0;
  }
}

// التقرير النهائي
function generateReport(results) {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  log('\n📊 Folder Organization Report:\n', 'info');
  
  log(`   Components organized: ${results.components}`, 'info');
  log(`   Lib folders created: ${results.lib}`, 'info');
  log(`   Duplicate files found: ${results.duplicates}`, 'info');
  log(`   Index files created: ${results.indexFiles}`, 'info');
  
  const total = results.components + results.lib + results.indexFiles;
  log(`\n   Total actions: ${total}`, 'info');
  
  if (results.duplicates > 0) {
    log(`\n   ⚠️  Please review duplicate files manually`, 'warn');
  }
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
  
  // حفظ التقرير
  const report = {
    timestamp: new Date().toISOString(),
    results,
    total
  };
  
  fs.writeFileSync('tmp/organize-folders-report.json', JSON.stringify(report, null, 2));
  log('📁 Report saved: tmp/organize-folders-report.json\n', 'info');
}

// التشغيل الرئيسي
async function main() {
  const results = {
    components: 0,
    lib: 0,
    duplicates: 0,
    indexFiles: 0
  };
  
  try {
    // نسخة احتياطية
    if (!createBackup()) {
      log('❌ Backup failed, aborting...', 'error');
      process.exit(1);
    }
    
    // تنظيم المكونات
    results.components = organizeComponents();
    
    // تنظيم lib
    results.lib = organizeLib();
    
    // البحث عن المكررات
    results.duplicates = findDuplicates();
    
    // تنظيم API routes
    organizeAPIRoutes();
    
    // إنشاء index files
    results.indexFiles = createIndexFiles();
    
    // التقرير
    generateReport(results);
    
    log('✅ Folder organization complete!\n', 'success');
    process.exit(0);
    
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// تشغيل
if (require.main === module) {
  main();
}

module.exports = { main };
