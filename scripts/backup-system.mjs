import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BACKUP_DIR = path.join(projectRoot, 'reports', 'backups');
const MAX_BACKUPS = 10; // الاحتفاظ بـ 10 نسخ احتياطية فقط

// Helper to execute shell commands
async function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: projectRoot, ...options }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Function to create file hash
function createFileHash(content) {
  return createHash('md5').update(content).digest('hex');
}

// Function to backup files with metadata
async function backupFiles(files, reason = 'auto-backup') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  const metadataFile = path.join(backupPath, 'backup-metadata.json');

  try {
    await fs.mkdir(backupPath, { recursive: true });

    const metadata = {
      timestamp: new Date().toISOString(),
      reason: reason,
      files: [],
      gitCommit: null,
      gitBranch: null,
      totalSize: 0,
    };

    // الحصول على معلومات Git
    try {
      const { stdout: commitHash } = await executeCommand('git rev-parse HEAD');
      const { stdout: branchName } = await executeCommand(
        'git branch --show-current'
      );
      metadata.gitCommit = commitHash.trim();
      metadata.gitBranch = branchName.trim();
    } catch (e) {
      console.log('⚠️ لا يمكن الحصول على معلومات Git');
    }

    let totalSize = 0;

    for (const file of files) {
      const sourcePath = path.join(projectRoot, file);
      const destPath = path.join(backupPath, file);

      try {
        // إنشاء المجلد الهدف
        await fs.mkdir(path.dirname(destPath), { recursive: true });

        // نسخ الملف
        await fs.copyFile(sourcePath, destPath);

        // حساب حجم الملف
        const stats = await fs.stat(destPath);
        const fileSize = stats.size;
        totalSize += fileSize;

        // قراءة محتوى الملف لحساب الـ hash
        const content = await fs.readFile(sourcePath, 'utf8');
        const hash = createFileHash(content);

        metadata.files.push({
          path: file,
          size: fileSize,
          hash: hash,
          lastModified: stats.mtime.toISOString(),
        });

        console.log(`📁 تم نسخ: ${file} (${fileSize} bytes)`);
      } catch (err) {
        console.log(`⚠️ فشل في نسخ: ${file} - ${err.message}`);
      }
    }

    metadata.totalSize = totalSize;

    // حفظ البيانات الوصفية
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2), 'utf8');

    console.log(`✅ تم إنشاء النسخة الاحتياطية: ${backupPath}`);
    console.log(`📊 إجمالي الحجم: ${(totalSize / 1024).toFixed(2)} KB`);

    return backupPath;
  } catch (err) {
    console.error(`❌ فشل في إنشاء النسخة الاحتياطية: ${err.message}`);
    return null;
  }
}

// Function to restore files from backup
async function restoreFiles(backupPath) {
  try {
    const metadataFile = path.join(backupPath, 'backup-metadata.json');
    const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));

    console.log(`🔄 استعادة النسخة الاحتياطية: ${backupPath}`);
    console.log(`📅 التاريخ: ${metadata.timestamp}`);
    console.log(`📝 السبب: ${metadata.reason}`);

    for (const fileInfo of metadata.files) {
      const sourcePath = path.join(backupPath, fileInfo.path);
      const destPath = path.join(projectRoot, fileInfo.path);

      try {
        // إنشاء المجلد الهدف
        await fs.mkdir(path.dirname(destPath), { recursive: true });

        // نسخ الملف
        await fs.copyFile(sourcePath, destPath);

        console.log(`✅ تم استعادة: ${fileInfo.path}`);
      } catch (err) {
        console.error(`❌ فشل في استعادة: ${fileInfo.path} - ${err.message}`);
      }
    }

    return true;
  } catch (err) {
    console.error(`❌ فشل في استعادة النسخة الاحتياطية: ${err.message}`);
    return false;
  }
}

// Function to clean old backups
async function cleanOldBackups() {
  try {
    const backups = await fs.readdir(BACKUP_DIR);
    const backupDirs = backups.filter(name => name.startsWith('backup-'));

    if (backupDirs.length <= MAX_BACKUPS) {
      return;
    }

    // ترتيب النسخ الاحتياطية حسب التاريخ
    const sortedBackups = await Promise.all(
      backupDirs.map(async dir => {
        const metadataFile = path.join(BACKUP_DIR, dir, 'backup-metadata.json');
        try {
          const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
          return { dir, timestamp: new Date(metadata.timestamp) };
        } catch (e) {
          return { dir, timestamp: new Date(0) };
        }
      })
    );

    sortedBackups.sort((a, b) => a.timestamp - b.timestamp);

    // حذف النسخ القديمة
    const toDelete = sortedBackups.slice(0, backupDirs.length - MAX_BACKUPS);

    for (const { dir } of toDelete) {
      const backupPath = path.join(BACKUP_DIR, dir);
      await fs.rm(backupPath, { recursive: true, force: true });
      console.log(`🗑️ تم حذف النسخة القديمة: ${dir}`);
    }

    console.log(`🧹 تم تنظيف ${toDelete.length} نسخة احتياطية قديمة`);
  } catch (err) {
    console.error(`❌ فشل في تنظيف النسخ القديمة: ${err.message}`);
  }
}

// Function to list available backups
async function listBackups() {
  try {
    const backups = await fs.readdir(BACKUP_DIR);
    const backupDirs = backups.filter(name => name.startsWith('backup-'));

    console.log(`📋 النسخ الاحتياطية المتاحة (${backupDirs.length}):`);

    for (const dir of backupDirs) {
      const metadataFile = path.join(BACKUP_DIR, dir, 'backup-metadata.json');
      try {
        const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
        console.log(`  📁 ${dir}`);
        console.log(`     📅 ${metadata.timestamp}`);
        console.log(`     📝 ${metadata.reason}`);
        console.log(
          `     📊 ${metadata.files.length} ملف (${(metadata.totalSize / 1024).toFixed(2)} KB)`
        );
        console.log(
          `     🌿 ${metadata.gitBranch} (${metadata.gitCommit?.substring(0, 7)})`
        );
        console.log('');
      } catch (e) {
        console.log(`  📁 ${dir} (بدون بيانات وصفية)`);
      }
    }
  } catch (err) {
    console.error(`❌ فشل في عرض النسخ الاحتياطية: ${err.message}`);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'backup':
      const files = args[1]
        ? args[1].split(',')
        : [
            'src/**/*.js',
            'src/**/*.ts',
            'src/**/*.jsx',
            'src/**/*.tsx',
            'tests/**/*.js',
            'tests/**/*.ts',
            'package.json',
            '.eslintrc.cjs',
            'tsconfig.json',
            'next.config.js',
          ];
      const reason = args[2] || 'manual-backup';
      await backupFiles(files, reason);
      await cleanOldBackups();
      break;

    case 'restore':
      const backupPath = args[1];
      if (!backupPath) {
        console.error('❌ يرجى تحديد مسار النسخة الاحتياطية');
        process.exit(1);
      }
      await restoreFiles(backupPath);
      break;

    case 'list':
      await listBackups();
      break;

    case 'clean':
      await cleanOldBackups();
      break;

    default:
      console.log(
        'استخدام: node backup-system.mjs [backup|restore|list|clean]'
      );
      console.log('  backup [files] [reason] - إنشاء نسخة احتياطية');
      console.log('  restore <path> - استعادة نسخة احتياطية');
      console.log('  list - عرض النسخ الاحتياطية المتاحة');
      console.log('  clean - تنظيف النسخ القديمة');
      break;
  }
}

main().catch(console.error);
