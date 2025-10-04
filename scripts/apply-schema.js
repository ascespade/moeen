#!/usr/bin/env node

// Muayin Assistant Database Schema Application Script
// سكريبت تطبيق schema قاعدة البيانات

const fs = require('fs');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ مفاتيح Supabase غير محددة في .env.local');
    process.exit(1);
}

console.log('🚀 بدء تطبيق Schema قاعدة البيانات...');

// Read schema file
const schemaPath = './supabase-schema.sql';
if (!fs.existsSync(schemaPath)) {
    console.error('❌ ملف supabase-schema.sql غير موجود');
    process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

// Function to make HTTP request
function makeRequest(sql) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            query: sql
        });

        const options = {
            hostname: 'socwpqzcalgvpzjwavgh.supabase.co',
            port: 443,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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
                    resolve(responseData);
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

// Function to execute SQL in chunks
async function executeSchema() {
    try {
        console.log('📊 جاري تطبيق Schema...');
        
        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 تم العثور على ${statements.length} عبارة SQL`);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`⏳ تنفيذ العبارة ${i + 1}/${statements.length}...`);
                    
                    const result = await makeRequest(statement);
                    console.log(`✅ تم تنفيذ العبارة ${i + 1} بنجاح`);
                    successCount++;
                    
                    // Add small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                } catch (error) {
                    console.log(`❌ خطأ في العبارة ${i + 1}: ${error.message}`);
                    errorCount++;
                }
            }
        }

        console.log('\n📊 ملخص التنفيذ:');
        console.log(`✅ نجح: ${successCount}`);
        console.log(`❌ فشل: ${errorCount}`);
        console.log(`📝 إجمالي: ${statements.length}`);

        if (errorCount === 0) {
            console.log('\n🎉 تم تطبيق Schema بنجاح!');
            
            // Test database connection
            console.log('\n🧪 اختبار الاتصال بقاعدة البيانات...');
            try {
                const testResult = await makeRequest('SELECT COUNT(*) as user_count FROM users;');
                console.log('✅ الاتصال بقاعدة البيانات ناجح');
                console.log('📊 البيانات:', testResult);
            } catch (error) {
                console.log('⚠️ فشل اختبار الاتصال:', error.message);
            }
            
        } else {
            console.log('\n⚠️ تم تطبيق Schema مع بعض الأخطاء');
        }

    } catch (error) {
        console.error('❌ خطأ في تطبيق Schema:', error.message);
        process.exit(1);
    }
}

// Run the script
executeSchema();


