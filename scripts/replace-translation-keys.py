#!/usr/bin/env python3
"""Translation Keys Replacement Script - Complete version with ALL keys"""

import os
import re
import sys
from pathlib import Path

# Complete key mappings extracted from i18n-keys.ts
KEY_MAPPINGS = {
    # Common
    'common.save': 'I18N_KEYS.COMMON.SAVE',
    'common.cancel': 'I18N_KEYS.COMMON.CANCEL',
    'common.delete': 'I18N_KEYS.COMMON.DELETE',
    'common.edit': 'I18N_KEYS.COMMON.EDIT',
    'common.add': 'I18N_KEYS.COMMON.ADD',
    'common.search': 'I18N_KEYS.COMMON.SEARCH',
    'common.filter': 'I18N_KEYS.COMMON.FILTER',
    'common.sort': 'I18N_KEYS.COMMON.SORT',
    'common.loading': 'I18N_KEYS.COMMON.LOADING',
    'common.error': 'I18N_KEYS.COMMON.ERROR',
    'common.success': 'I18N_KEYS.COMMON.SUCCESS',
    'common.confirm': 'I18N_KEYS.COMMON.CONFIRM',
    'common.back': 'I18N_KEYS.COMMON.BACK',
    'common.next': 'I18N_KEYS.COMMON.NEXT',
    'common.previous': 'I18N_KEYS.COMMON.PREVIOUS',
    'common.close': 'I18N_KEYS.COMMON.CLOSE',
    'common.open': 'I18N_KEYS.COMMON.OPEN',
    'common.yes': 'I18N_KEYS.COMMON.YES',
    'common.no': 'I18N_KEYS.COMMON.NO',
    'common.ok': 'I18N_KEYS.COMMON.OK',
    'common.enabled': 'I18N_KEYS.COMMON.ENABLED',
    'common.disabled': 'I18N_KEYS.COMMON.DISABLED',
    'common.active': 'I18N_KEYS.COMMON.ACTIVE',
    'common.inactive': 'I18N_KEYS.COMMON.INACTIVE',
    'common.systemName': 'I18N_KEYS.COMMON.SYSTEM_NAME',
    'common.searchPlaceholder': 'I18N_KEYS.COMMON.SEARCH_PLACEHOLDER',
    'common.openMenu': 'I18N_KEYS.COMMON.OPEN_MENU',
    'common.required': 'I18N_KEYS.COMMON.REQUIRED',
    'common.completed': 'I18N_KEYS.COMMON.COMPLETED',
    'common.processing': 'I18N_KEYS.COMMON.PROCESSING',
    'common.activating': 'I18N_KEYS.COMMON.ACTIVATING',
    'common.submitting': 'I18N_KEYS.COMMON.SUBMITTING',
    'common.creating': 'I18N_KEYS.COMMON.CREATING',
    'common.excellent': 'I18N_KEYS.COMMON.SUCCESS',
    'common.good': 'I18N_KEYS.COMMON.SUCCESS',
    'common.needs_improvement': 'I18N_KEYS.COMMON.ERROR',
    'common.pending': 'I18N_KEYS.COMMON.LOADING',
    'common.unknown': 'I18N_KEYS.COMMON.ERROR',
    'common.activated': 'I18N_KEYS.COMMON.ACTIVE',
    
    # Navigation
    'nav.dashboard': 'I18N_KEYS.NAV.DASHBOARD',
    'nav.services': 'I18N_KEYS.NAV.SERVICES',
    'nav.about': 'I18N_KEYS.NAV.ABOUT',
    'nav.gallery': 'I18N_KEYS.NAV.GALLERY',
    'nav.contact': 'I18N_KEYS.NAV.CONTACT',
    'nav.login': 'I18N_KEYS.NAV.LOGIN',
    'nav.register': 'I18N_KEYS.NAV.REGISTER',
    'nav.logout': 'I18N_KEYS.NAV.LOGOUT',
    'nav.profile': 'I18N_KEYS.NAV.PROFILE',
    'nav.settings': 'I18N_KEYS.NAV.SETTINGS',
    'nav.patients': 'I18N_KEYS.NAV.PATIENTS',
    'nav.appointments': 'I18N_KEYS.NAV.APPOINTMENTS',
    'nav.sessions': 'I18N_KEYS.NAV.SESSIONS',
    'nav.insurance': 'I18N_KEYS.NAV.INSURANCE',
    'nav.reports': 'I18N_KEYS.NAV.REPORTS',
    'nav.staff': 'I18N_KEYS.NAV.STAFF',
    'nav.admin': 'I18N_KEYS.NAV.ADMIN',
    
    # Auth
    'auth.login': 'I18N_KEYS.AUTH.LOGIN',
    'auth.register': 'I18N_KEYS.AUTH.REGISTER',
    'auth.logout': 'I18N_KEYS.AUTH.LOGOUT',
    'auth.email': 'I18N_KEYS.AUTH.EMAIL',
    'auth.password': 'I18N_KEYS.AUTH.PASSWORD',
    'auth.confirm_password': 'I18N_KEYS.AUTH.CONFIRM_PASSWORD',
    'auth.forgot_password': 'I18N_KEYS.AUTH.FORGOT_PASSWORD',
    'auth.reset_password': 'I18N_KEYS.AUTH.RESET_PASSWORD',
    'auth.remember_me': 'I18N_KEYS.AUTH.REMEMBER_ME',
    'auth.sign_in': 'I18N_KEYS.AUTH.SIGN_IN',
    'auth.sign_up': 'I18N_KEYS.AUTH.SIGN_UP',
    'auth.sign_out': 'I18N_KEYS.AUTH.SIGN_OUT',
    'auth.invalid_credentials': 'I18N_KEYS.AUTH.INVALID_CREDENTIALS',
    'auth.account_created': 'I18N_KEYS.AUTH.ACCOUNT_CREATED',
    'auth.login_success': 'I18N_KEYS.AUTH.LOGIN_SUCCESS',
    'auth.unauthorized': 'I18N_KEYS.AUTH.UNAUTHORIZED',
    'auth.insufficient_permissions': 'I18N_KEYS.AUTH.INSUFFICIENT_PERMISSIONS',
    'auth.back_to_dashboard': 'I18N_KEYS.AUTH.BACK_TO_DASHBOARD',
    
    # Dashboard
    'dashboard.title': 'I18N_KEYS.DASHBOARD.TITLE',
    'dashboard.welcome': 'I18N_KEYS.DASHBOARD.WELCOME',
    'dashboard.overview': 'I18N_KEYS.DASHBOARD.OVERVIEW',
    'dashboard.statistics': 'I18N_KEYS.DASHBOARD.STATISTICS',
    'dashboard.recent_activities': 'I18N_KEYS.DASHBOARD.RECENT_ACTIVITIES',
    'dashboard.quick_actions': 'I18N_KEYS.DASHBOARD.QUICK_ACTIONS',
    'dashboard.today_appointments': 'I18N_KEYS.DASHBOARD.TODAY_APPOINTMENTS',
    'dashboard.pending_tasks': 'I18N_KEYS.DASHBOARD.PENDING_TASKS',
    'dashboard.notifications': 'I18N_KEYS.DASHBOARD.NOTIFICATIONS',
    
    # Patients
    'patients.title': 'I18N_KEYS.PATIENTS.TITLE',
    'patients.add_patient': 'I18N_KEYS.PATIENTS.ADD_PATIENT',
    'patients.edit_patient': 'I18N_KEYS.PATIENTS.EDIT_PATIENT',
    'patients.delete_patient': 'I18N_KEYS.PATIENTS.DELETE_PATIENT',
    'patients.patient_details': 'I18N_KEYS.PATIENTS.PATIENT_DETAILS',
    'patients.name': 'I18N_KEYS.PATIENTS.NAME',
    'patients.age': 'I18N_KEYS.PATIENTS.AGE',
    'patients.phone': 'I18N_KEYS.PATIENTS.PHONE',
    'patients.email': 'I18N_KEYS.PATIENTS.EMAIL',
    'patients.address': 'I18N_KEYS.PATIENTS.ADDRESS',
    'patients.medical_history': 'I18N_KEYS.PATIENTS.MEDICAL_HISTORY',
    'patients.emergency_contact': 'I18N_KEYS.PATIENTS.EMERGENCY_CONTACT',
    'patients.registration_date': 'I18N_KEYS.PATIENTS.REGISTRATION_DATE',
    'patients.last_visit': 'I18N_KEYS.PATIENTS.LAST_VISIT',
    'patients.status': 'I18N_KEYS.PATIENTS.STATUS',
    'patients.active': 'I18N_KEYS.PATIENTS.ACTIVE',
    'patients.inactive': 'I18N_KEYS.PATIENTS.INACTIVE',
    'patient.checklist.title': 'I18N_KEYS.PATIENTS.CHECKLIST.TITLE',
    'patient.checklist.description': 'I18N_KEYS.PATIENTS.CHECKLIST.DESCRIPTION',
    'patient.checklist.progress': 'I18N_KEYS.PATIENTS.CHECKLIST.PROGRESS',
    'patient.checklist.required_completed': 'I18N_KEYS.PATIENTS.CHECKLIST.REQUIRED_COMPLETED',
    'patient.checklist.required_warning': 'I18N_KEYS.PATIENTS.CHECKLIST.REQUIRED_WARNING',
    'patient.checklist.submit': 'I18N_KEYS.PATIENTS.CHECKLIST.SUBMIT',
    'patient.activation.title': 'I18N_KEYS.PATIENTS.ACTIVATION.TITLE',
    'patient.activation.description': 'I18N_KEYS.PATIENTS.ACTIVATION.DESCRIPTION',
    'patient.activation.progress': 'I18N_KEYS.PATIENTS.ACTIVATION.PROGRESS',
    'patient.activation.complete_step': 'I18N_KEYS.PATIENTS.ACTIVATION.COMPLETE_STEP',
    'patient.activation.ready_to_activate': 'I18N_KEYS.PATIENTS.ACTIVATION.READY_TO_ACTIVATE',
    'patient.activation.activate_account': 'I18N_KEYS.PATIENTS.ACTIVATION.ACTIVATE_ACCOUNT',
    'patient.activation.required': 'I18N_KEYS.PATIENTS.ACTIVATION.TITLE',
    'patient.activation.steps.profile_complete': 'I18N_KEYS.PATIENTS.ACTIVATION.STEPS.PROFILE_COMPLETE',
    'patient.activation.steps.profile_complete_desc': 'I18N_KEYS.PATIENTS.ACTIVATION.STEPS.PROFILE_COMPLETE_DESC',
    'patient.activation.steps.insurance_verified': 'I18N_KEYS.PATIENTS.ACTIVATION.STEPS.INSURANCE_VERIFIED',
    'patient.activation.steps.insurance_verified_desc': 'I18N_KEYS.PATIENTS.ACTIVATION.STEPS.INSURANCE_VERIFIED_DESC',
    'patient.activation.steps.payment_settled': 'I18N_KEYS.PATIENTS.ACTIVATION.STEPS.PAYMENT_SETTLED',
    'patient.activation.steps.payment_settled_desc': 'I18N_KEYS.PATIENTS.ACTIVATION.STEPS.PAYMENT_SETTLED_DESC',
    'patient.activation.steps.first_visit': 'I18N_KEYS.PATIENTS.ACTIVATION.STEPS.FIRST_VISIT',
    'patient.activation.steps.first_visit_desc': 'I18N_KEYS.PATIENTS.ACTIVATION.STEPS.FIRST_VISIT_DESC',
    'patient.dashboard.welcome': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.dashboard.subtitle': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.dashboard.next_appointment': 'I18N_KEYS.DASHBOARD.TODAY_APPOINTMENTS',
    'patient.dashboard.with_doctor': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.dashboard.no_appointments': 'I18N_KEYS.DASHBOARD.TODAY_APPOINTMENTS',
    'patient.dashboard.account_status': 'I18N_KEYS.PATIENTS.STATUS',
    'patient.dashboard.activation_status': 'I18N_KEYS.PATIENTS.ACTIVATION.TITLE',
    'patient.dashboard.insurance_status': 'I18N_KEYS.INSURANCE.TITLE',
    'patient.dashboard.quick_stats': 'I18N_KEYS.DASHBOARD.STATISTICS',
    'patient.dashboard.total_appointments': 'I18N_KEYS.DASHBOARD.TODAY_APPOINTMENTS',
    'patient.dashboard.outstanding_payment': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.actions.book_appointment': 'I18N_KEYS.APPOINTMENTS.BOOK_APPOINTMENT',
    'patient.actions.book_description': 'I18N_KEYS.APPOINTMENTS.TITLE',
    'patient.actions.book_now': 'I18N_KEYS.APPOINTMENTS.BOOK_APPOINTMENT',
    'patient.actions.view_file': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.actions.file_description': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.actions.open_file': 'I18N_KEYS.COMMON.OPEN',
    'patient.actions.file_locked': 'I18N_KEYS.COMMON.ERROR',
    'patient.actions.payments': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.actions.payments_description': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.actions.view_payments': 'I18N_KEYS.PATIENTS.TITLE',
    'patient.actions.insurance': 'I18N_KEYS.NAV.INSURANCE',
    'patient.actions.insurance_description': 'I18N_KEYS.INSURANCE.TITLE',
    'patient.actions.view_insurance': 'I18N_KEYS.NAV.INSURANCE',
    
    # Appointments
    'appointments.title': 'I18N_KEYS.APPOINTMENTS.TITLE',
    'appointments.add_appointment': 'I18N_KEYS.APPOINTMENTS.ADD_APPOINTMENT',
    'appointments.edit_appointment': 'I18N_KEYS.APPOINTMENTS.EDIT_APPOINTMENT',
    'appointments.delete_appointment': 'I18N_KEYS.APPOINTMENTS.DELETE_APPOINTMENT',
    'appointments.appointment_details': 'I18N_KEYS.APPOINTMENTS.APPOINTMENT_DETAILS',
    'appointments.date': 'I18N_KEYS.APPOINTMENTS.DATE',
    'appointments.time': 'I18N_KEYS.APPOINTMENTS.TIME',
    'appointments.type': 'I18N_KEYS.APPOINTMENTS.TYPE',
    'appointments.status': 'I18N_KEYS.APPOINTMENTS.STATUS',
    'appointments.notes': 'I18N_KEYS.APPOINTMENTS.NOTES',
    'appointments.scheduled': 'I18N_KEYS.APPOINTMENTS.SCHEDULED',
    'appointments.confirmed': 'I18N_KEYS.APPOINTMENTS.CONFIRMED',
    'appointments.completed': 'I18N_KEYS.APPOINTMENTS.COMPLETED',
    'appointments.cancelled': 'I18N_KEYS.APPOINTMENTS.CANCELLED',
    'appointments.book_appointment': 'I18N_KEYS.APPOINTMENTS.BOOK_APPOINTMENT',
    
    # Sessions
    'sessions.title': 'I18N_KEYS.SESSIONS.TITLE',
    'sessions.add_session': 'I18N_KEYS.SESSIONS.ADD_SESSION',
    'sessions.edit_session': 'I18N_KEYS.SESSIONS.EDIT_SESSION',
    'sessions.delete_session': 'I18N_KEYS.SESSIONS.DELETE_SESSION',
    'sessions.session_details': 'I18N_KEYS.SESSIONS.SESSION_DETAILS',
    'sessions.session_type': 'I18N_KEYS.SESSIONS.SESSION_TYPE',
    'sessions.exercises': 'I18N_KEYS.SESSIONS.EXERCISES',
    'sessions.completed': 'I18N_KEYS.SESSIONS.COMPLETED',
    'sessions.notes': 'I18N_KEYS.SESSIONS.NOTES',
    'sessions.duration': 'I18N_KEYS.SESSIONS.DURATION',
    'sessions.therapist': 'I18N_KEYS.SESSIONS.THERAPIST',
    
    # Insurance
    'insurance.title': 'I18N_KEYS.INSURANCE.TITLE',
    'insurance.claims': 'I18N_KEYS.INSURANCE.CLAIMS',
    'insurance.add_claim': 'I18N_KEYS.INSURANCE.ADD_CLAIM',
    'insurance.edit_claim': 'I18N_KEYS.INSURANCE.EDIT_CLAIM',
    'insurance.delete_claim': 'I18N_KEYS.INSURANCE.DELETE_CLAIM',
    'insurance.claim_number': 'I18N_KEYS.INSURANCE.CLAIM_NUMBER',
    'insurance.insurance_company': 'I18N_KEYS.INSURANCE.INSURANCE_COMPANY',
    'insurance.amount': 'I18N_KEYS.INSURANCE.AMOUNT',
    'insurance.status': 'I18N_KEYS.INSURANCE.STATUS',
    'insurance.submitted': 'I18N_KEYS.INSURANCE.SUBMITTED',
    'insurance.approved': 'I18N_KEYS.INSURANCE.APPROVED',
    'insurance.rejected': 'I18N_KEYS.INSURANCE.REJECTED',
    'insurance.pending': 'I18N_KEYS.INSURANCE.PENDING',
    'insurance.claims.title': 'I18N_KEYS.INSURANCE.CLAIMS_TITLE',
    'insurance.claims.create_new': 'I18N_KEYS.INSURANCE.CREATE_NEW',
    'insurance.claims.search_placeholder': 'I18N_KEYS.INSURANCE.SEARCH_PLACEHOLDER',
    'insurance.claims.all_statuses': 'I18N_KEYS.INSURANCE.ALL_STATUSES',
    'insurance.claims.draft': 'I18N_KEYS.INSURANCE.DRAFT',
    'insurance.claims.submitted': 'I18N_KEYS.INSURANCE.SUBMITTED',
    'insurance.claims.under_review': 'I18N_KEYS.INSURANCE.UNDER_REVIEW',
    'insurance.claims.approved': 'I18N_KEYS.INSURANCE.APPROVED',
    'insurance.claims.rejected': 'I18N_KEYS.INSURANCE.REJECTED',
    'insurance.claims.provider': 'I18N_KEYS.INSURANCE.PROVIDER',
    'insurance.claims.select_provider': 'I18N_KEYS.INSURANCE.SELECT_PROVIDER',
    'insurance.claims.amount': 'I18N_KEYS.INSURANCE.AMOUNT',
    'insurance.claims.description': 'I18N_KEYS.INSURANCE.DESCRIPTION',
    'insurance.claims.description_placeholder': 'I18N_KEYS.INSURANCE.DESCRIPTION_PLACEHOLDER',
    'insurance.claims.diagnosis': 'I18N_KEYS.INSURANCE.DIAGNOSIS',
    'insurance.claims.diagnosis_placeholder': 'I18N_KEYS.INSURANCE.DIAGNOSIS_PLACEHOLDER',
    'insurance.claims.treatment': 'I18N_KEYS.INSURANCE.TREATMENT',
    'insurance.claims.treatment_placeholder': 'I18N_KEYS.INSURANCE.TREATMENT_PLACEHOLDER',
    'insurance.claims.create': 'I18N_KEYS.INSURANCE.CREATE',
    'insurance.claims.reference': 'I18N_KEYS.INSURANCE.REFERENCE',
    'insurance.claims.submit': 'I18N_KEYS.INSURANCE.SUBMIT',
    'insurance.claims.no_claims': 'I18N_KEYS.INSURANCE.NO_CLAIMS',
    
    # Admin
    'admin.title': 'I18N_KEYS.ADMIN.TITLE',
    'admin.modules': 'I18N_KEYS.ADMIN.MODULES',
    'admin.aiFeatures': 'I18N_KEYS.ADMIN.AI_FEATURES',
    'admin.security': 'I18N_KEYS.ADMIN.SECURITY',
    'admin.automation': 'I18N_KEYS.ADMIN.AUTOMATION',
    'admin.systemConfiguration': 'I18N_KEYS.ADMIN.SYSTEM_CONFIGURATION',
    'admin.systemConfigurationDescription': 'I18N_KEYS.ADMIN.SYSTEM_CONFIGURATION_DESCRIPTION',
    'admin.healthcareModules': 'I18N_KEYS.ADMIN.HEALTHCARE_MODULES',
    'admin.capabilities': 'I18N_KEYS.ADMIN.CAPABILITIES',
    'admin.integrations': 'I18N_KEYS.ADMIN.INTEGRATIONS',
    'admin.securitySettings': 'I18N_KEYS.ADMIN.SECURITY_SETTINGS',
    'admin.automationSettings': 'I18N_KEYS.ADMIN.AUTOMATION_SETTINGS',
    'admin.scheduledJobs': 'I18N_KEYS.ADMIN.SCHEDULED_JOBS',
    'admin.active': 'I18N_KEYS.ADMIN.ACTIVE',
    
    # Header
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
    'header.aiAgent': 'I18N_KEYS.HEADER.AI_FEATURES',
    
    # Theme & Language
    'theme.label': 'I18N_KEYS.THEME.LABEL',
    'theme.light': 'I18N_KEYS.THEME.LIGHT',
    'theme.dark': 'I18N_KEYS.THEME.DARK',
    'theme.system': 'I18N_KEYS.THEME.SYSTEM',
    'language.label': 'I18N_KEYS.LANGUAGE.LABEL',
    'language.arabic': 'I18N_KEYS.LANGUAGE.ARABIC',
    'language.english': 'I18N_KEYS.LANGUAGE.ENGLISH',
    'language.switch_to': 'I18N_KEYS.LANGUAGE.SWITCH_TO',
    
    # Settings
    'settings.title': 'I18N_KEYS.SETTINGS.TITLE',
    'settings.general': 'I18N_KEYS.SETTINGS.GENERAL',
    'settings.profile': 'I18N_KEYS.SETTINGS.PROFILE',
    'settings.security': 'I18N_KEYS.SETTINGS.SECURITY',
    'settings.notifications': 'I18N_KEYS.SETTINGS.NOTIFICATIONS',
    'settings.language': 'I18N_KEYS.SETTINGS.LANGUAGE',
    'settings.theme': 'I18N_KEYS.SETTINGS.THEME',
    'settings.timezone': 'I18N_KEYS.SETTINGS.TIMEZONE',
    'settings.save_changes': 'I18N_KEYS.SETTINGS.SAVE_CHANGES',
    'settings.reset': 'I18N_KEYS.SETTINGS.RESET',
    
    # Errors
    'errors.required_field': 'I18N_KEYS.ERRORS.REQUIRED_FIELD',
    'errors.invalid_email': 'I18N_KEYS.ERRORS.INVALID_EMAIL',
    'errors.invalid_phone': 'I18N_KEYS.ERRORS.INVALID_PHONE',
    'errors.passwords_dont_match': 'I18N_KEYS.ERRORS.PASSWORDS_DONT_MATCH',
    'errors.network_error': 'I18N_KEYS.ERRORS.NETWORK_ERROR',
    'errors.server_error': 'I18N_KEYS.ERRORS.SERVER_ERROR',
    'errors.unauthorized': 'I18N_KEYS.ERRORS.UNAUTHORIZED',
    'errors.forbidden': 'I18N_KEYS.ERRORS.FORBIDDEN',
    'errors.not_found': 'I18N_KEYS.ERRORS.NOT_FOUND',
    'errors.validation_error': 'I18N_KEYS.ERRORS.VALIDATION_ERROR',
    'error.generic': 'I18N_KEYS.ERRORS.SERVER_ERROR',
    
    # Success
    'success.saved': 'I18N_KEYS.SUCCESS.SAVED',
    'success.deleted': 'I18N_KEYS.SUCCESS.DELETED',
    'success.updated': 'I18N_KEYS.SUCCESS.UPDATED',
    'success.created': 'I18N_KEYS.SUCCESS.CREATED',
    'success.sent': 'I18N_KEYS.SUCCESS.SENT',
    'success.uploaded': 'I18N_KEYS.SUCCESS.UPLOADED',
}

stats = {
    'files_processed': 0,
    'files_modified': 0,
    'replacements': 0,
    'imports_added': 0
}

def get_all_ts_files(root_dir):
    """Get all TypeScript/TSX files recursively"""
    ts_files = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '.next', 'dist', 'build']]
        for file in files:
            if file.endswith(('.ts', '.tsx')) and not file.endswith('.d.ts'):
                if '.test.' not in file and '.spec.' not in file and 'i18n-keys.ts' not in file:
                    ts_files.append(os.path.join(root, file))
    return ts_files

def has_i18n_import(content):
    """Check if file already has I18N_KEYS import"""
    return bool(re.search(r"import.*I18N_KEYS.*from.*['\"]@/constants/i18n-keys['\"]", content))

def add_i18n_import(content):
    """Add I18N_KEYS import to file"""
    import_pattern = r"^import\s+.*?from\s+['\"].*?['\"];?$"
    imports = re.findall(import_pattern, content, re.MULTILINE)
    
    if not imports:
        return "import { I18N_KEYS } from '@/constants/i18n-keys';\n" + content
    
    last_import = imports[-1]
    last_import_index = content.rfind(last_import)
    after_last_import = last_import_index + len(last_import)
    
    needs_newline = content[after_last_import] != '\n'
    import_stmt = "\nimport { I18N_KEYS } from '@/constants/i18n-keys';\n" if needs_newline else "import { I18N_KEYS } from '@/constants/i18n-keys';\n"
    
    return content[:after_last_import] + import_stmt + content[after_last_import:]

def replace_keys(content):
    """Replace translation keys in content"""
    new_content = content
    replacements = 0
    
    # Sort keys by length (longest first) to avoid partial replacements
    sorted_keys = sorted(KEY_MAPPINGS.keys(), key=len, reverse=True)
    
    for old_key in sorted_keys:
        new_key = KEY_MAPPINGS[old_key]
        escaped_key = re.escape(old_key)
        
        # Pattern 1: t('key') or t("key")
        pattern1 = rf"t\(['\"]{escaped_key}['\"]"
        matches1 = len(re.findall(pattern1, new_content))
        if matches1:
            new_content = re.sub(pattern1, f"t({new_key}", new_content)
            replacements += matches1
        
        # Pattern 2: t(`key`)
        pattern2 = rf"t\(`{escaped_key}`"
        matches2 = len(re.findall(pattern2, new_content))
        if matches2:
            new_content = re.sub(pattern2, f"t({new_key}", new_content)
            replacements += matches2
    
    return new_content, replacements

def process_file(file_path):
    """Process a single file"""
    try:
        stats['files_processed'] += 1
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        new_content, replacements = replace_keys(content)
        
        if replacements > 0:
            content = new_content
            stats['replacements'] += replacements
            
            if not has_i18n_import(content):
                content = add_i18n_import(content)
                stats['imports_added'] += 1
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            stats['files_modified'] += 1
            print(f"âœ“ {file_path} ({replacements} replacements)")
            return True
        
        return False
    except Exception as e:
        print(f"âœ— Error: {file_path}: {str(e)}")
        return False

def main():
    """Main function"""
    project_root = os.getcwd()
    src_dir = os.path.join(project_root, 'src')
    
    print("ðŸ” Searching for TypeScript files...")
    
    if not os.path.exists(src_dir):
        print("âœ— src directory not found!")
        sys.exit(1)
    
    files = get_all_ts_files(src_dir)
    print(f"Found {len(files)} files to process\n")
    
    print("ðŸ”„ Processing files...\n")
    
    for file in files:
        process_file(file)
    
    print(f"\nâœ… Complete!")
    print(f"Files processed: {stats['files_processed']}")
    print(f"Files modified: {stats['files_modified']}")
    print(f"Total replacements: {stats['replacements']}")
    print(f"Imports added: {stats['imports_added']}")

if __name__ == '__main__':
    main()