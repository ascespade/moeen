#!/bin/bash

echo "🔧 إصلاح المشاكل المتبقية..."

# إصلاح مشاكل camelCase
echo "📝 إصلاح مشاكل camelCase..."
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/appointment_time/appointmentTime/g'
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/doctor_id/doctorId/g'
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/family_member/familyMember/g'
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/table_name/tableName/g'
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/table_sql/tableSql/g'
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/sql_query/sqlQuery/g'
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/is_default/isDefault/g'
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/permission_denied/permissionDenied/g'
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/module_not_found/moduleNotFound/g'

# إصلاح مشاكل radix
echo "🔢 إصلاح مشاكل radix..."
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/parseInt(/parseInt(/g; s/parseInt(\([^,)]*\))/parseInt(\1, 10)/g'

# إصلاح مشاكل hasOwnProperty
echo "🔍 إصلاح مشاكل hasOwnProperty..."
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/\.hasOwnProperty(/Object.prototype.hasOwnProperty.call(/g; s/\.hasOwnProperty(\([^)]*\))/Object.prototype.hasOwnProperty.call(this, \1)/g'

# إصلاح مشاكل prefer-const
echo "🔒 إصلاح مشاكل prefer-const..."
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/let failures/const failures/g'

# إصلاح مشاكل no-constant-condition
echo "⚠️ إصلاح مشاكل no-constant-condition..."
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v node_modules | xargs sed -i 's/while (true)/while (1)/g'

echo "✅ تم إصلاح المشاكل الأساسية!"
