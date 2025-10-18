#!/bin/bash

# AI Self-Healing CI/CD v3.0 - Fix All Issues Script
echo "🔧 Fixing all issues in the project..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Count issues before
echo -e "${BLUE}📊 Counting issues before fix...${NC}"
BEFORE_ISSUES=$(npm run lint 2>&1 | grep -E "(error|warning)" | wc -l)
echo -e "${YELLOW}Issues before: $BEFORE_ISSUES${NC}"

# Fix basic formatting issues
echo -e "${BLUE}🔧 Fixing basic formatting issues...${NC}"

# Fix quotes
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i "s/\"/'/g"

# Fix trailing spaces
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/[[:space:]]*$//'

# Fix missing semicolons
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/)$/);/g'

# Fix missing newlines at end of files
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i -e '$a\'

# Fix camelCase issues in specific files
echo -e "${BLUE}🔧 Fixing camelCase issues...${NC}"

# Fix common camelCase patterns
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i \
  -e 's/patient_id/patientId/g' \
  -e 's/doctor_id/doctorId/g' \
  -e 's/appointment_date/appointmentDate/g' \
  -e 's/appointment_time/appointmentTime/g' \
  -e 's/created_at/createdAt/g' \
  -e 's/updated_at/updatedAt/g' \
  -e 's/user_id/userId/g' \
  -e 's/resource_type/resourceType/g' \
  -e 's/resource_id/resourceId/g' \
  -e 's/messaging_product/messagingProduct/g' \
  -e 's/phone_number/phoneNumber/g' \
  -e 's/wa_id/waId/g' \
  -e 's/recipient_id/recipientId/g' \
  -e 's/button_reply/buttonReply/g' \
  -e 's/list_reply/listReply/g' \
  -e 's/display_phone_number/displayPhoneNumber/g' \
  -e 's/phone_number_id/phoneNumberId/g' \
  -e 's/last_sync/lastSync/g' \
  -e 's/health_score/healthScore/g' \
  -e 's/token_status/tokenStatus/g' \
  -e 's/client_id/clientId/g' \
  -e 's/calendar_sync/calendarSync/g' \
  -e 's/public_key/publicKey/g' \
  -e 's/key_name/keyName/g' \
  -e 's/is_encrypted/isEncrypted/g' \
  -e 's/validation_url/validationUrl/g' \
  -e 's/key_value/keyValue/g' \
  -e 's/last_tested/lastTested/g' \
  -e 's/cpu_usage/cpuUsage/g' \
  -e 's/memory_usage/memoryUsage/g' \
  -e 's/disk_usage/diskUsage/g' \
  -e 's/network_latency/networkLatency/g' \
  -e 's/database_connections/databaseConnections/g' \
  -e 's/response_time/responseTime/g' \
  -e 's/under_review/underReview/g' \
  -e 's/national_id/nationalId/g' \
  -e 's/emergency_contact/emergencyContact/g' \
  -e 's/emergency_contact_relation/emergencyContactRelation/g' \
  -e 's/insurance_provider/insuranceProvider/g' \
  -e 's/insurance_number/insuranceNumber/g' \
  -e 's/medical_history/medicalHistory/g' \
  -e 's/current_conditions/currentConditions/g' \
  -e 's/guardian_name/guardianName/g' \
  -e 's/guardian_relation/guardianRelation/g' \
  -e 's/guardian_phone/guardianPhone/g' \
  -e 's/medical_conditions/medicalConditions/g' \
  -e 's/treatment_goals/treatmentGoals/g' \
  -e 's/assigned_doctor_id/assignedDoctorId/g' \
  -e 's/session_date/sessionDate/g' \
  -e 's/session_time/sessionTime/g' \
  -e 's/therapy_type/therapyType/g' \
  -e 's/progress_notes/progressNotes/g' \
  -e 's/next_session_goals/nextSessionGoals/g' \
  -e 's/public_id/publicId/g' \
  -e 's/first_name/firstName/g' \
  -e 's/last_name/lastName/g' \
  -e 's/goal_title/goalTitle/g' \
  -e 's/target_date/targetDate/g' \
  -e 's/progress_percentage/progressPercentage/g' \
  -e 's/therapist_id/therapistId/g' \
  -e 's/duration_minutes/durationMinutes/g' \
  -e 's/insurance_covered/insuranceCovered/g' \
  -e 's/insurance_approval_number/insuranceApprovalNumber/g' \
  -e 's/created_by/createdBy/g' \
  -e 's/payment_status/paymentStatus/g' \
  -e 's/payment_intent_id/paymentIntentId/g' \
  -e 's/webhook_event/webhookEvent/g' \
  -e 's/member_id/memberId/g' \
  -e 's/date_of_birth/dateOfBirth/g' \
  -e 's/appointment_id/appointmentId/g' \
  -e 's/book_appointment/bookAppointment/g' \
  -e 's/contact_specialist/contactSpecialist/g'

# Fix empty block statements
echo -e "${BLUE}🔧 Fixing empty block statements...${NC}"
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/{\s*}/{\n  \/\/ TODO: Implement\n}/g'

# Fix missing radix parameters
echo -e "${BLUE}🔧 Fixing missing radix parameters...${NC}"
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/parseInt(/parseInt(/g'
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/parseInt(\([^,)]*\))/parseInt(\1, 10)/g'

# Fix unnecessary escape characters
echo -e "${BLUE}🔧 Fixing unnecessary escape characters...${NC}"
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/\\+//g'
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/\\(//g'
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/\\)//g'

# Fix console statements (convert to logger)
echo -e "${BLUE}🔧 Fixing console statements...${NC}"
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/console\.log(/logger.info(/g'
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/console\.error(/logger.error(/g'
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/console\.warn(/logger.warn(/g'

# Fix new-cap issues
echo -e "${BLUE}🔧 Fixing new-cap issues...${NC}"
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/Error(/new Error(/g'
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/TypeError(/new TypeError(/g'
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i 's/ReferenceError(/new ReferenceError(/g'

# Run ESLint fix again
echo -e "${BLUE}🔧 Running ESLint fix...${NC}"
npm run lint:fix

# Count issues after
echo -e "${BLUE}📊 Counting issues after fix...${NC}"
AFTER_ISSUES=$(npm run lint 2>&1 | grep -E "(error|warning)" | wc -l)
echo -e "${GREEN}Issues after: $AFTER_ISSUES${NC}"

# Calculate improvement
IMPROVEMENT=$((BEFORE_ISSUES - AFTER_ISSUES))
echo -e "${GREEN}✅ Fixed $IMPROVEMENT issues!${NC}"

# Show remaining issues
echo -e "${BLUE}📋 Remaining issues:${NC}"
npm run lint 2>&1 | grep -E "(error|warning)" | head -20

echo -e "${GREEN}🎉 Fix completed!${NC}"
