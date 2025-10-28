# 📦 Project Modules - قائمة وحدات المشروع

## Overview

The Moeen Medical Center system consists of **30+ integrated modules** providing comprehensive healthcare management, CRM, AI chatbot, and administrative capabilities.

## Core Healthcare Modules (13)

### 1. **Authentication & Authorization** 🔐
- User login, registration, password reset
- Role-based access control (RBAC)
- 9 canonical roles: admin, manager, supervisor, doctor, nurse, staff, agent, patient, demo
- Session management
- **Files**: `src/app/(auth)/`, `src/lib/auth/`, `src/middleware/`

### 2. **Users Management** 👥
- User account management
- Profile management
- Activity tracking
- Security settings
- **Files**: `src/app/(admin)/admin/users/`, `src/api/admin/users/`

### 3. **Patients Management** 🏥
- Patient records and profiles
- Medical history
- Insurance information
- Family members
- Emergency contacts
- **Files**: `src/app/(health)/patients/`, `src/app/(admin)/admin/patients/`, `src/api/patients/`

### 4. **Doctors/Therapists Management** 👨‍⚕️
- Doctor profiles and schedules
- Specializations and qualifications
- Availability management
- Working hours
- Ratings and reviews
- **Files**: `src/app/(admin)/admin/therapists/`, `src/app/(admin)/doctors/`, `src/api/doctors/`

### 5. **Appointments System** 📅
- Appointment scheduling
- Calendar management
- Booking management
- Conflicts detection
- Reminders and notifications
- **Files**: `src/app/(health)/appointments/`, `src/app/(admin)/appointments/`, `src/api/appointments/`

### 6. **Medical Records** 📋
- Medical history tracking
- Diagnoses and treatments
- Medications
- Lab results
- Imaging results
- **Files**: `src/app/(health)/medical-file/`, `src/api/medical-records/`

### 7. **Sessions Management** 🎯
- Therapy sessions
- Session notes
- Progress tracking
- Goal setting
- **Files**: `src/app/(health)/health/sessions/`, `src/app/(admin)/sessions/`, `src/api/sessions/`

### 8. **Insurance & Claims** 🏥💳
- Insurance provider management
- Claim processing
- Approval workflows
- Claim tracking
- **Files**: `src/app/(health)/insurance-claims/`, `src/app/(health)/insurance/`, `src/api/insurance/`

### 9. **Payments & Billing** 💰
- Payment processing
- Transaction management
- Refunds
- Payment methods
- Invoice generation
- **Files**: `src/app/(admin)/payments/`, `src/app/(admin)/admin/payments/`, `src/api/payments/`

### 10. **Progress Tracking** 📈
- Patient progress monitoring
- Assessments and evaluations
- Goal tracking
- Progress reports
- **Files**: `src/app/(health)/progress-tracking/`, `src/app/(health)/progress/`, `src/api/progress/`

### 11. **Family Support** 👨‍👩‍👧‍👦
- Family member management
- Support sessions
- Communication tools
- **Files**: `src/app/(health)/family/`, `src/app/(health)/family-support/`, `src/api/family/`

### 12. **Therapy & Training** 🎓
- Therapy program management
- Training courses
- Rehabilitation programs
- **Files**: `src/app/(health)/therapy/`, `src/app/(health)/training/`, `src/api/training/`

### 13. **Approvals System** ✅
- Treatment approvals
- Medication approvals
- Referral approvals
- Insurance approvals
- **Files**: `src/app/(health)/approvals/`

## Advanced Modules (17+)

### 14. **CRM System** 🤝
- Contact management
- Lead tracking
- Deal management
- Sales pipelines
- Activity tracking
- **Files**: `src/app/(admin)/crm/`, `src/api/crm/`

### 15. **Chatbot & AI Assistant** 🤖
- AI-powered conversations
- Flow management
- Templates and responses
- Integration with WhatsApp
- Intent management
- Analytics
- **Files**: `src/app/(admin)/chatbot/`, `src/app/(public)/chatbot/`, `src/api/chatbot/`

### 16. **Conversations & Messages** 💬
- Conversation threads
- Message management
- Multi-channel support
- Assignments and routing
- **Files**: `src/app/(admin)/conversations/`, `src/app/(admin)/messages/`

### 17. **Agent Dashboard** 🤖
- AI agent management
- Task automation
- Status monitoring
- Completion tracking
- **Files**: `src/app/(admin)/agent-dashboard/`, `src/api/agent/`

### 18. **Notifications System** 🔔
- Notification delivery
- Templates
- Scheduling
- Multi-channel notifications
- **Files**: `src/app/(admin)/notifications/`, `src/api/notifications/`

### 19. **Analytics & Reports** 📊
- Dashboard statistics
- Performance metrics
- Custom reports
- Data exports
- **Files**: `src/app/(admin)/analytics/`, `src/app/(admin)/reports/`

### 20. **Dynamic Data Management** 🔄
- Dynamic content management
- Center information
- Dynamic doctors list
- Dynamic services
- **Files**: `src/app/(admin)/dynamic-data/`, `src/components/dynamic-*.tsx`

### 21. **Settings Management** ⚙️
- System configuration
- Center settings
- Emergency contacts
- Staff management
- API keys
- **Files**: `src/app/(admin)/settings/`, `src/api/settings/`

### 22. **Security & Audit** 🔒
- Security monitoring
- Audit logs
- Review system
- Access control
- **Files**: `src/app/(admin)/security،`, `src/app/(admin)/admin/audit-logs/`

### 23. **Integration System** 🔌
- Third-party integrations
- Configuration management
- Health monitoring
- Testing tools
- **Files**: `src/app/(admin)/integrations/`, `src/api/integration_test_logs/`

### 24. **Flow Management** 🔀
- Visual flow builder
- Automation flows
- Trigger management
- **Files**: `src/app/(admin)/flow/`, `src/lib/conversation-flows.ts`

### 25. **Performance Monitoring** ⚡
- System performance tracking
- Optimization metrics
- Performance dashboard
- **Files**: `src/app/(admin)/performance/`

### 26. **Saudi Health Integration** 🇸🇦
- Ministry of Health integration
- Health sector standards
- Compliance features
- **Files**: `src/lib/saudi-health-integration.ts`, `src/lib/saudi-ministry-health-integration.ts`

### 27. **WhatsApp Business Integration** 📱
- WhatsApp messaging
- Business API integration
- Template management
- **Files**: `src/lib/whatsapp-integration.ts`, `src/lib/whatsapp-business-api.ts`

### 28. **AI Training Data** 🧠
- AI model training
- Data verification
- Confidence scoring
- **Files**: Related to AI chatbot module

### 29. **Accessibility Features** ♿
- WCAG compliance
- Keyboard navigation
- Screen reader support
- **Files**: `src/lib/accessibility.ts`, `src/components/accessibility/`

### 30. **SEO & Metadata** 🔍
- Search engine optimization
- Dynamic metadata
- Sitemap generation
- **Files**: `src/app/sitemap.ts`, `src/lib/seo/`

## Supporting Systems

### Infrastructure Modules
- **API Layer**: 101 API routes
- **State Management**: Jotai, Zustand
- **Internationalization (i18n)**: 898 translations (Arabic/English)
- **Theme Management**: Light/Dark mode
- **Responsive Design**: Mobile-first approach
- **File Upload**: Media management
- **Caching System**: Performance optimization
- **Error Handling**: Comprehensive error management
- **Logging**: System logging and monitoring
- **Rate Limiting**: API protection

### Utilities & Helpers
- CUID generation system
- Validation system (Zod schemas)
- Encryption utilities
- Date/time utilities
- Currency formatting
- Text formatting

## Module Statistics

### Frontend Pages
- **Admin Pages**: 45+ admin interfaces
- **Health Pages**: 17+ healthcare interfaces
- **Auth Pages**: 6 authentication pages
- **Public Pages**: Marketing and info pages
- **Dashboard Pages**: Role-specific dashboards

### API Endpoints
- **Total**: 101 API routes
- **Healthcare**: 20+ endpoints
- **CRM**: 10+ endpoints
- **Chatbot**: 15+ endpoints
- **Admin**: 15+ endpoints
- **System**: 40+ endpoints

### Database Tables
- **Total**: 60+ tables
- **Healthcare**: 20+ tables
- **CRM**: 10+ tables
- **Chatbot**: 8+ tables
- **System**: 15+ tables
- **Views**: 12+ views
- **Functions**: 40+ functions

## Technology Stack by Module

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Radix UI, Tailwind CSS
- **State**: React hooks, Context API
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts, Chart.js

### Backend
- **Database**: Supabase (PostgreSQL 17)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### AI & Integration
- **AI Models**: Gemini Pro, GPT-4, Claude
- **WhatsApp**: WhatsApp Business API
- **Notifications**: Multi-channel (email, SMS, push)

---

**Total Modules**: 30+ modules  
**Completion Status**: 98% complete  
**Last Updated**: From live database schema

