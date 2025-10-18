#!/usr/bin/env node

const fs = require('fs');
const yaml = require('js-yaml');

class CIAssistantFixer {
  constructor() {
    this.workflowPath = '.github/workflows/ultimate-ci-self-healing.yml';
    this.fixesApplied = [];
    this.errors = [];
  }

  async analyzeWorkflowError() {
    console.log('🔍 تحليل خطأ الـ workflow...');
    
    try {
      // قراءة الـ workflow
      const content = fs.readFileSync(this.workflowPath, 'utf8');
      
      // تحليل YAML
      const workflow = yaml.load(content);
      
      // فحص الأخطاء الشائعة
      const errors = this.detectCommonErrors(content, workflow);
      
      if (errors.length > 0) {
        console.log(`❌ تم العثور على ${errors.length} خطأ`);
        return errors[0]; // إصلاح أول خطأ
      }
      
      return null;
    } catch (error) {
      console.log('❌ خطأ في تحليل الـ workflow:', error.message);
      return {
        type: 'yaml-syntax',
        message: error.message,
        fix: 'fix-yaml-syntax'
      };
    }
  }

  detectCommonErrors(content, workflow) {
    const errors = [];
    
    // فحص YAML syntax
    if (!workflow) {
      errors.push({
        type: 'yaml-syntax',
        message: 'YAML syntax error',
        fix: 'fix-yaml-syntax'
      });
    }
    
    // فحص permissions
    if (!workflow.permissions) {
      errors.push({
        type: 'missing-permissions',
        message: 'Missing permissions block',
        fix: 'add-permissions'
      });
    }
    
    // فحص timeout
    if (workflow.jobs) {
      for (const [jobName, job] of Object.entries(workflow.jobs)) {
        if (!job['timeout-minutes'] || job['timeout-minutes'] < 30) {
          errors.push({
            type: 'low-timeout',
            message: `Job ${jobName} has low timeout`,
            fix: 'increase-timeout'
          });
        }
      }
    }
    
    // فحص set-output deprecated
    if (content.includes('::set-output')) {
      errors.push({
        type: 'deprecated-set-output',
        message: 'Using deprecated set-output syntax',
        fix: 'fix-set-output'
      });
    }
    
    return errors;
  }

  async fixError(error) {
    console.log(`🔧 إصلاح خطأ: ${error.type}`);
    
    try {
      const content = fs.readFileSync(this.workflowPath, 'utf8');
      let fixed = content;
      
      switch (error.fix) {
        case 'fix-yaml-syntax':
          fixed = this.fixYamlSyntax(content);
          break;
        case 'add-permissions':
          fixed = this.addPermissions(content);
          break;
        case 'increase-timeout':
          fixed = this.increaseTimeout(content);
          break;
        case 'fix-set-output':
          fixed = this.fixSetOutput(content);
          break;
        default:
          console.log('❓ نوع إصلاح غير معروف');
          return false;
      }
      
      if (fixed !== content) {
        fs.writeFileSync(this.workflowPath, fixed);
        this.fixesApplied.push(error.fix);
        console.log(`✅ تم إصلاح ${error.type}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log(`❌ خطأ في الإصلاح: ${error.message}`);
      this.errors.push(error);
      return false;
    }
  }

  fixYamlSyntax(content) {
    // إصلاحات YAML شائعة
    return content
      .replace(/:\s*$/, ': ') // إضافة مسافة بعد النقطتين
      .replace(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*):\s*$/, '$1$2: ') // إضافة مسافة للقيم الفارغة
      .replace(/\n\s*\n\s*\n/g, '\n\n'); // إزالة الأسطر الفارغة الزائدة
  }

  addPermissions(content) {
    const permissionsBlock = `permissions:
  contents: write
  pull-requests: write
  issues: write
  checks: write
  statuses: write
  security-events: write
  actions: write

`;
    
    return content.replace(/^name:.*$/m, `$&\n${permissionsBlock}`);
  }

  increaseTimeout(content) {
    return content.replace(/timeout-minutes: \d+/g, 'timeout-minutes: 60');
  }

  fixSetOutput(content) {
    // إصلاح set-output deprecated
    return content
      .replace(/console\.log\(`::set-output name=([^:]+)::\$\{([^}]+)\}`\);/g, 'console.log(`$1=$${$2}` >> $GITHUB_OUTPUT);')
      .replace(/console\.log\(\\`::set-output name=([^:]+)::\\\$\{([^}]+)\}\\\`\);/g, 'console.log(\\`$1=$${$2}\\\` >> $GITHUB_OUTPUT);');
  }

  async run() {
    console.log('🤖 بدء CI Assistant Fixer...');
    
    const error = await this.analyzeWorkflowError();
    
    if (error) {
      const fixed = await this.fixError(error);
      
      if (fixed) {
        console.log('✅ تم إصلاح الخطأ بنجاح');
        return {
          success: true,
          fixesApplied: this.fixesApplied,
          error: error
        };
      } else {
        console.log('❌ فشل في إصلاح الخطأ');
        return {
          success: false,
          fixesApplied: this.fixesApplied,
          errors: this.errors,
          error: error
        };
      }
    } else {
      console.log('✅ لا توجد أخطاء في الـ workflow');
      return {
        success: true,
        fixesApplied: [],
        error: null
      };
    }
  }
}

// تشغيل الإصلاح إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  const fixer = new CIAssistantFixer();
  fixer.run().then(result => {
    fs.writeFileSync('ci-assistant-results.json', JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = CIAssistantFixer;