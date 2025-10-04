#!/usr/bin/env node

// Muayin Assistant - Direct Schema Application
// تطبيق Schema مباشرة عبر Supabase REST API

const fs = require('fs');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ مفاتيح Supabase غير محددة في .env.local');
    process.exit(1);
}

console.log('🚀 بدء تطبيق Schema قاعدة البيانات الكامل...');

// Read complete schema file
const schemaPath = './supabase-schema-complete.sql';
if (!fs.existsSync(schemaPath)) {
    console.error('❌ ملف supabase-schema-complete.sql غير موجود');
    process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

// Function to execute SQL via Supabase REST API
function executeSQL(sql) {
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
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
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

// Function to execute schema in chunks
async function applyCompleteSchema() {
    try {
        console.log('📊 جاري تطبيق Schema الكامل...');
        
        // Split schema into logical chunks
        const schemaParts = schema.split('-- =====================================================');
        const chunks = [
            // Extensions and types
            schemaParts[1] + schemaParts[2],
            
            // Core tables
            schema.split('-- CORE TABLES')[1] + 
            schema.split('-- CORE TABLES')[2].split('-- =====================================================')[0],
            
            // Conversation management
            schema.split('-- CONVERSATION MANAGEMENT')[1] + 
            schema.split('-- CONVERSATION MANAGEMENT')[2].split('-- =====================================================')[0],
            
            // AI and automation
            schema.split('-- AI AND AUTOMATION')[1] + 
            schema.split('-- AI AND AUTOMATION')[2].split('-- =====================================================')[0],
            
            // WhatsApp integration
            schema.split('-- WHATSAPP INTEGRATION')[1] + 
            schema.split('-- WHATSAPP INTEGRATION')[2].split('-- =====================================================')[0],
            
            // Customer management
            schema.split('-- CUSTOMER MANAGEMENT')[1] + 
            schema.split('-- CUSTOMER MANAGEMENT')[2].split('-- =====================================================')[0],
            
            // Analytics and reporting
            schema.split('-- ANALYTICS AND REPORTING')[1] + 
            schema.split('-- ANALYTICS AND REPORTING')[2].split('-- =====================================================')[0],
            
            // System management
            schema.split('-- SYSTEM MANAGEMENT')[1] + 
            schema.split('-- SYSTEM MANAGEMENT')[2].split('-- =====================================================')[0],
            
            // Reviews and feedback
            schema.split('-- REVIEWS AND FEEDBACK')[1] + 
            schema.split('-- REVIEWS AND FEEDBACK')[2].split('-- =====================================================')[0],
            
            // Indexes
            schema.split('-- INDEXES')[1] + 
            schema.split('-- INDEXES')[2].split('-- =====================================================')[0],
            
            // RLS
            schema.split('-- ROW LEVEL SECURITY')[1] + 
            schema.split('-- ROW LEVEL SECURITY')[2].split('-- =====================================================')[0],
            
            // Functions and triggers
            schema.split('-- FUNCTIONS')[1] + 
            schema.split('-- FUNCTIONS')[2].split('-- =====================================================')[0],
            
            // Views
            schema.split('-- VIEWS')[1] + 
            schema.split('-- VIEWS')[2].split('-- =====================================================')[0],
            
            // Initial data
            schema.split('-- INITIAL DATA')[1] + 
            schema.split('-- INITIAL DATA')[2].split('-- =====================================================')[0]
        ];

        console.log(`📝 تم تقسيم Schema إلى ${chunks.length} أجزاء`);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i].trim();
            if (chunk && chunk.length > 10) {
                try {
                    console.log(`⏳ تطبيق الجزء ${i + 1}/${chunks.length}...`);
                    
                    const result = await executeSQL(chunk);
                    console.log(`✅ تم تطبيق الجزء ${i + 1} بنجاح`);
                    successCount++;
                    
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                } catch (error) {
                    console.log(`❌ خطأ في الجزء ${i + 1}: ${error.message}`);
                    errorCount++;
                }
            }
        }

        console.log('\n📊 ملخص التطبيق:');
        console.log(`✅ نجح: ${successCount}`);
        console.log(`❌ فشل: ${errorCount}`);
        console.log(`📝 إجمالي: ${chunks.length}`);

        if (errorCount === 0) {
            console.log('\n🎉 تم تطبيق Schema الكامل بنجاح!');
            
            // Test database
            console.log('\n🧪 اختبار قاعدة البيانات...');
            try {
                const testResult = await executeSQL('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\';');
                console.log('✅ قاعدة البيانات تعمل بشكل صحيح');
                console.log('📊 عدد الجداول:', testResult);
                
                // Test users table
                const userCount = await executeSQL('SELECT COUNT(*) as user_count FROM users;');
                console.log('👥 عدد المستخدمين:', userCount);
                
            } catch (error) {
                console.log('⚠️ فشل اختبار قاعدة البيانات:', error.message);
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
applyCompleteSchema();
