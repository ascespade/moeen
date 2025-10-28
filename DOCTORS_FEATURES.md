# Doctors Database Features

## Doctors Table Structure

### Basic Schema (Simple)
```sql
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  speciality TEXT,
  schedule JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields**:
- ✅ `id` - Auto-increment primary key
- ✅ `user_id` - Reference to users table
- ✅ `speciality` - Doctor specialization
- ✅ `schedule` - Schedule data (JSONB)
- ✅ `created_at` - Creation timestamp

### Enhanced Schema (Full)
```sql
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  public_id VARCHAR(255) UNIQUE DEFAULT 'doc_' || TO_CHAR(NOW(), 'YYYYMMDD') || '_' || LPAD(NEXTVAL('doctors_id_seq')::TEXT, 6, '0'),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  license_number VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  consultation_fee DECIMAL(10,2),
  available_days JSONB,
  available_hours JSONB,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Enhanced Fields**:
- ✅ `public_id` - CUID for API (format: doc_YYYYMMDD_XXXXXX)
- ✅ `user_id` - Linked user account
- ✅ `first_name` - Doctor first name
- ✅ `last_name` - Doctor last name
- ✅ `specialization` - Medical specialization
- ✅ `license_number` - Professional license
- ✅ `phone` - Contact phone
- ✅ `email` - Contact email
- ✅ `consultation_fee` - Fee per consultation
- ✅ AUDIO JSONB - Available days of week
- ✅ `available_hours` - Working hours (JSONB)
- ✅ `status` - Status (active/inactive/on_leave)
- ✅ `created_at` - Creation timestamp
- ✅ `updated_at` - Last update timestamp

## Doctor-Related Tables

### 1. doctors (Main Table)
- Doctor profiles
- Personal information
- Contact details
- Professional credentials

### 2. therapist_schedules (Migration 071)
- ✅ Detailed therapist/doctor schedules
- ✅ Day-by-day availability
- ✅ Time slot management
- ✅ Override schedules

### 3. appointments (Linked to doctors)
- ✅ Doctor's appointments
- ✅ Patient bookings
- ✅ Status tracking
- ✅ Payment integration

### 4. sessions (Therapy sessions)
- ✅ Session management
- ✅ Notes and documentation
- ✅ Session types
- ✅ Progress tracking

### 5. medical_records (Linked to doctors)
- ✅ Patient records
- ✅ Diagnosis history
- ✅ Treatment plans
- ✅ Medical history

## Doctor Features

### ✅ Core Features
1. **Profile Management**
   - Full name and contact info
   - Professional credentials
   - License tracking
   - Fee management

2. **Schedule Management**
   - Available days configuration
   - Working hours setup
   - Schedule overrides
   - Therapist schedules (advanced)

3. **Appointments**
   - View appointments
   - Manage bookings
   - Status tracking
   - Payment management

4. **Patient Management**
   - Patient records
   - Medical history
   - Session notes
   - Progress tracking

5. **Status Tracking**
   - Active doctors
   - Inactive doctors
   - On leave status
   - Availability status

### ✅ Enhanced Features (From Migrations)

#### From Migration 040 - Appointment Enhancements
- Advanced appointment management
- Conflict checking
- Availability validation
- Multiple appointment types

#### From Migration 071 - Therapist Schedules
- Detailed schedule configuration
- Recurring patterns
- Exception handling
- Schedule templates

#### From Migration 076 - Booking Validation
- Real-time availability checking
- Double-booking prevention
- Automatic conflict detection

#### From Migration 042-043 - Medical Records
- Comprehensive patient records
- History tracking
- Documentation system
- Reporting capabilities

## Doctor API Features

### Endpoints Available
```typescript
GET    /api/doctors              // List doctors
GET    /api/doctors?specialty=   // Filter by specialty
GET    /api/doctors?search=      // Search doctors
POST   /api/doctors              // Create doctor
GET    /api/doctors/:id          // Get doctor details
PUT    /api/doctors/:id          // Update doctor
DELETE /api/doctors/:id          // Delete doctor
```

### Data Operations
```typescript
// Search and Filter
realDB.getDoctorsBySpecialty(specialty)
realDB.searchUsers(searchTerm, 'doctor')

// CRUD Operations
realDB.createUser(doctorData)
realDB.createDoctor(doctorRecord)

// Filtering
- By specialty
- By status
- By availability
- By schedule
```

## Doctor CUID Support

### CUID Generation
```typescript
import { cuidEntity } from '@/lib/cuid';

// Generate doctor ID
const doctorId = cuidEntity.doctor(); // Returns: doc_xxxxx
```

### public_id Format
- **Format**: `doc_YYYYMMDD_XXXXXX`
- **Example**: `doc_20250117_000001`
- **Purpose**: API-facing unique identifier

## Summary

### What Doctors Can Do
- ✅ **Manage Profile**: Update credentials and contact info
- ✅ **Set Schedule**: Configure availability and working hours
- ✅ **Manage Appointments**: View and handle patient bookings
- ✅ **Access Patients**: View patient records and history
- ✅ **Document Sessions**: Add session notes and documentation
- ✅ **Track Progress**: Monitor patient progress over time
- ✅ **Get Paid**: Consultation fees tracked in payments

### Database Fields for Doctors
- ✅ **Basic**: 4 fields (id, user_id, speciality, schedule)
- ✅ **Enhanced**: 15 fields (full profile with status and metadata)
- ✅ **Related Tables**: 5+ tables (schedules, appointments, sessions, records)
- ✅ **Total Features**: 20+ doctor-specific features

### Current Implementation
- ✅ Table structure created
- ✅ API routes configured
- ✅ CUID generation ready
- ✅ Dynamic data fetching enabled
- ✅ Search and filter working
- ✅ Validation with Zod schemas

**Status**: ✅ **DOCTORS FULLY CONFIGURED**

