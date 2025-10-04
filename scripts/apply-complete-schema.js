#!/usr/bin/env node

// Muayin Assistant - Complete Schema Application Script
// سكريبت تطبيق Schema الكامل لنظام مُعين الذكي

const fs = require('fs');
const https = require('https');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ مفاتيح Supabase غير محددة في .env.local');
    process.exit(1);
}

console.log('🚀 بدء تطبيق Schema الكامل لنظام مُعين الذكي...');
console.log('📊 مركز الهمم - Al-Hemam Center');
console.log('');

// Read schema file
const schemaPath = './supabase-schema-complete.sql';
if (!fs.existsSync(schemaPath)) {
    console.error('❌ ملف supabase-schema-complete.sql غير موجود');
    process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

// Function to make HTTP request to Supabase
function makeSupabaseRequest(sql, useServiceKey = false) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            query: sql
        });

        const key = useServiceKey ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY;
        const url = new URL(SUPABASE_URL);
        
        const options = {
            hostname: url.hostname,
            port: 443,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({
                        status: res.statusCode,
                        data: responseData,
                        success: true
                    });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

// Function to execute SQL in chunks with better error handling
async function executeSchema() {
    try {
        console.log('📊 جاري تحليل Schema...');
        
        // Split schema into logical sections
        const sections = [
            'extensions',
            'types', 
            'tables',
            'indexes',
            'rls',
            'policies',
            'functions',
            'triggers',
            'views',
            'data'
        ];

        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'))
            .map(stmt => stmt + ';');

        console.log(`📝 تم العثور على ${statements.length} عبارة SQL`);
        console.log('');

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;
        const errors = [];

        // Execute statements in batches
        const batchSize = 5;
        for (let i = 0; i < statements.length; i += batchSize) {
            const batch = statements.slice(i, i + batchSize);
            console.log(`⏳ معالجة الدفعة ${Math.floor(i/batchSize) + 1}/${Math.ceil(statements.length/batchSize)}...`);
            
            for (let j = 0; j < batch.length; j++) {
                const statement = batch[j];
                const statementNumber = i + j + 1;
                
                try {
                    // Skip certain statements that might cause issues
                    if (statement.includes('GRANT USAGE') || 
                        statement.includes('GRANT ALL') ||
                        statement.includes('-- This schema creates')) {
                        console.log(`⏭️  تخطي العبارة ${statementNumber}: ${statement.substring(0, 50)}...`);
                        skippedCount++;
                        continue;
                    }
                    
                    const result = await makeSupabaseRequest(statement, true);
                    console.log(`✅ تم تنفيذ العبارة ${statementNumber} بنجاح`);
                    successCount++;
                    
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                } catch (error) {
                    console.log(`❌ خطأ في العبارة ${statementNumber}: ${error.message.substring(0, 100)}...`);
                    errors.push({
                        statement: statementNumber,
                        error: error.message,
                        sql: statement.substring(0, 100) + '...'
                    });
                    errorCount++;
                }
            }
            
            // Longer delay between batches
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('');
        console.log('📊 ملخص التنفيذ:');
        console.log(`✅ نجح: ${successCount}`);
        console.log(`❌ فشل: ${errorCount}`);
        console.log(`⏭️  تم تخطيه: ${skippedCount}`);
        console.log(`📝 إجمالي: ${statements.length}`);

        if (errorCount > 0) {
            console.log('');
            console.log('❌ الأخطاء المفصلة:');
            errors.slice(0, 10).forEach((err, index) => {
                console.log(`${index + 1}. العبارة ${err.statement}: ${err.error}`);
                console.log(`   SQL: ${err.sql}`);
            });
            
            if (errors.length > 10) {
                console.log(`   ... و ${errors.length - 10} أخطاء أخرى`);
            }
        }

        if (successCount > 0) {
            console.log('');
            console.log('🧪 اختبار الاتصال بقاعدة البيانات...');
            try {
                const testResult = await makeSupabaseRequest('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\';', true);
                console.log('✅ الاتصال بقاعدة البيانات ناجح');
                
                // Test user count
                const userResult = await makeSupabaseRequest('SELECT COUNT(*) as user_count FROM users;', true);
                console.log('👥 عدد المستخدمين:', userResult.data);
                
                // Test conversation count
                const convResult = await makeSupabaseRequest('SELECT COUNT(*) as conv_count FROM conversations;', true);
                console.log('💬 عدد المحادثات:', convResult.data);
                
            } catch (error) {
                console.log('⚠️ فشل اختبار الاتصال:', error.message);
            }
        }

        console.log('');
        if (errorCount === 0) {
            console.log('🎉 تم تطبيق Schema الكامل بنجاح!');
            console.log('');
            console.log('🔑 بيانات الدخول التجريبية:');
            console.log('   👤 admin@alhemamcenter.com / admin123 (مدير النظام)');
            console.log('   👤 manager@alhemamcenter.com / manager123 (مدير الفريق)');
            console.log('   👤 supervisor@alhemamcenter.com / supervisor123 (مشرف)');
            console.log('   👤 agent@alhemamcenter.com / agent123 (وكيل خدمة العملاء)');
            console.log('   👤 demo@alhemamcenter.com / demo123 (مستخدم تجريبي)');
            console.log('');
            console.log('🚀 يمكنك الآن تشغيل المشروع: npm run dev');
        } else {
            console.log('⚠️ تم تطبيق Schema مع بعض الأخطاء');
            console.log('💡 يرجى مراجعة الأخطاء أعلاه وإصلاحها يدوياً إذا لزم الأمر');
        }

    } catch (error) {
        console.error('❌ خطأ في تطبيق Schema:', error.message);
        process.exit(1);
    }
}

// Run the script
executeSchema();


