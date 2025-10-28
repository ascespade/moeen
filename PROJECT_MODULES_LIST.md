# 📦 Project Modules - Complete List

## Summary

**Total**: 30+ integrated modules across healthcare, CRM, AI, and administrative functions

---

## Core Healthcare Modules (13)

| # | Module | Description | Location |
|---|--------|-------------|----------|
| 1 | **Authentication** | Login, registration, password reset, RBAC | `src/app/(auth)/` |
| 2 | **Users Management** | Account and profile management | `src/app/(admin)/admin/users/` |
| 3 | **Patients** | Patient records and profiles | `src/app/(health)/patients/` |
| 4 | **Doctors** | Doctor profiles and schedules | `src/app/(admin)/doctors/` |
| 5 | **Appointments** | Appointment scheduling and booking | `src/app/(health)/appointments/` |
| 6 | **Medical Records** | Medical history and records | `src/app/(health)/medical-file/` |
| 7 | **Sessions** | Therapy sessions management | `src/app/(health)/sessions/` |
| 8 | **Insurance** | Insurance claims processing | `src/app/(health)/insurance/` |
| 9 | **Payments** | Payment and billing | `src/app/(admin)/payments/` |
| 10 | **Progress Tracking** | Patient progress monitoring | `src/app/(health)/progress/` |
| 11 | **Family Support** | Family communication | `src/app/(health)/family/` |
| 12 | **Therapy & Training** | Therapy programs | `src/app/(health)/therapy/` |
| 13 | **Approvals** | Treatment approvals | `src/app/(health)/approvals/` |

---

## Advanced Modules (17+)

| # | Module | Description | Location |
|---|--------|-------------|----------|
| 14 | **CRM System** | Contact & lead management | `src/app/(admin)/crm/` |
| 15 | **Chatbot AI** | AI-powered chatbot | `src/app/(admin)/chatbot/` |
| 16 | **Conversations** | Message management | `src/app/(admin)/conversations/` |
| 17 | **Agent Dashboard** | AI agent management | `src/app/(admin)/agent-dashboard/` |
| 18 | **Notifications** | Notification delivery | `src/app/(admin)/notifications/` |
| 19 | **Analytics** | Analytics and reports | `src/app/(admin)/analytics/` |
| 20 | **Dynamic Data** | Dynamic content management | `src/app/(admin)/dynamic-data/` |
| 21 | **Settings** | System configuration | `src/app/(admin)/settings/` |
| 22 | **Security** | Security and audit | `src/app/(admin)/security/` |
| 23 | **Integrations** | Third-party integrations | `src/app/(admin)/integrations/` |
| 24 | **Flow Studio** | Visual flow builder | `src/app/(admin)/flow/` |
| 25 | **Performance** | Performance monitoring | `src/app/(admin)/performance/` |
| 26 | **Saudi Health** | MoH integration | `src/lib/saudi-health-integration.ts` |
| 27 | **WhatsApp** | WhatsApp integration | `src/lib/whatsapp-integration.ts` |
| 28 | **AI Training** | AI model training | Related to chatbot |
| 29 | **Accessibility** | WCAG compliance | `src/lib/accessibility.ts` |
| 30 | **SEO** | Search optimization | `src/lib/seo/` |

---

## Module Features

### 🔐 Authentication & Security
- Multi-factor authentication
- Role-based access control (9 roles)
- Session management
- Audit logging
- Encryption

### 🏥 Healthcare Core
- Patient management
- Doctor/therapist schedules
- Appointment booking
- Medical records
- Progress tracking

### 💬 Communication
- Multi-channel messaging
- WhatsApp integration
- Email notifications
- SMS support
- Push notifications

### 🤖 AI & Automation
- Chatbot conversations
- AI agent automation
- Flow management
- Template system
- Analytics

### 💰 Financial
- Payment processing
- Insurance claims
- Billing system
- Refunds
- Transaction tracking

### 📊 Analytics & Reporting
- Dashboard statistics
- Performance metrics
- Custom reports
- Data exports
- Real-time monitoring

---

## Database Tables by Module

### Healthcare (20+ tables)
- users, roles, patients, doctors
- appointments, sessions, medical_records
- payments, insurance_claims
- therapy_sessions, therapy_goals

### CRM (10+ tables)  
- crm_contacts, crm_leads, crm_deals
- crm_activities, customers
- conversations, messages

### Chatbot & AI (8+ tables)
- chatbot_conversations, chatbot_flows
- chatbot_nodes, chatbot_templates
- ai_training_data, ai_models

### System (15+ tables)
- audit_logs, system_settings
- translations, notifications
- analytics, reports

---

## API Endpoints (101 total)

- Healthcare: 20+ endpoints
- CRM: 10+ endpoints
- Chatbot: 15+ endpoints
- Admin: 15+ endpoints
- System: 40+ endpoints

---

**Status**: ✅ All modules integrated and operational  
**Database**: 60+ tables, 40+ functions, 12+ views  
**Last Updated**: Based on live schema

