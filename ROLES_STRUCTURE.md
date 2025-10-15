# Roles Structure Guide - دليل هيكل الأدوار

## Overview - نظرة عامة

The healthcare dashboard implements a comprehensive role-based access control (RBAC) system with five distinct user roles, each with specific permissions and access levels.

## Role Hierarchy - التسلسل الهرمي للأدوار

```
Admin (المدير)
├── Full system access
├── User management
├── System configuration
└── All reports and analytics

Supervisor (المشرف)
├── Staff management
├── Reports and analytics
├── Claims approval
└── Performance monitoring

Staff (الموظف)
├── Patient registration
├── Appointment scheduling
├── Payment processing
└── Basic operations

Doctor (الطبيب)
├── Patient files access
├── Medical records
├── Appointment management
└── Treatment notes

Patient (المريض)
├── Personal dashboard
├── Appointment history
├── Medical records (own)
└── Payment status
```

## Role Definitions - تعريفات الأدوار

### 1. Patient - المريض

**Purpose**: End users accessing their personal healthcare information

**Permissions**:
- View personal dashboard
- Access own medical records
- View appointment history
- Check payment status
- Update personal information
- View insurance claims status

**Restrictions**:
- Cannot access other patients' data
- Cannot modify medical records
- Cannot access administrative functions
- Cannot view system reports

**Dashboard Features**:
- Personal profile management
- Appointment booking and history
- Medical records viewer
- Payment and insurance status
- Pre-visit checklist

### 2. Doctor - الطبيب

**Purpose**: Healthcare providers managing patient care

**Permissions**:
- Access assigned patient files
- View and update medical records
- Manage appointments
- Add treatment notes
- View patient history
- Access test results

**Restrictions**:
- Cannot access patients not assigned to them
- Cannot modify system settings
- Cannot access administrative reports
- Cannot manage user accounts

**Dashboard Features**:
- Patient list for the day
- Medical records management
- Appointment scheduling
- Treatment notes editor
- Test results viewer

### 3. Staff - الموظف

**Purpose**: Administrative staff handling patient registration and basic operations

**Permissions**:
- Register new patients
- Schedule appointments
- Process payments
- Update patient information
- Handle insurance claims
- Basic reporting

**Restrictions**:
- Cannot access medical records
- Cannot modify treatment plans
- Cannot access system administration
- Cannot view sensitive reports

**Dashboard Features**:
- Patient registration form
- Appointment management
- Payment processing
- Insurance claims handling
- Basic reports

### 4. Supervisor - المشرف

**Purpose**: Management level staff overseeing operations and staff performance

**Permissions**:
- View all staff activities
- Access comprehensive reports
- Approve insurance claims
- Manage staff permissions
- View system analytics
- Monitor performance metrics

**Restrictions**:
- Cannot modify system configuration
- Cannot manage admin accounts
- Cannot access sensitive medical data
- Cannot modify core system settings

**Dashboard Features**:
- Staff activity reports
- Claims approval queue
- Performance dashboards
- Staff management tools
- Analytics and insights

### 5. Admin - المدير

**Purpose**: System administrators with full access to all features

**Permissions**:
- Full system access
- User account management
- System configuration
- Database management
- Security settings
- All reports and analytics

**Restrictions**:
- None (full access)

**Dashboard Features**:
- System administration panel
- User management interface
- Configuration settings
- Security monitoring
- Complete analytics suite

## Database Schema - مخطط قاعدة البيانات

### Users Table - جدول المستخدمين

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT REFERENCES roles(role) DEFAULT 'patient',
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Roles Table - جدول الأدوار

```sql
CREATE TABLE roles (
  role TEXT PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (role, description) VALUES 
('patient', 'Patient role with access to personal dashboard and appointments'),
('doctor', 'Doctor role with access to patient files and medical records'),
('staff', 'Staff role with access to patient registration and basic operations'),
('supervisor', 'Supervisor role with access to staff management and reports'),
('admin', 'Admin role with full system access');
```

## Access Control Implementation - تنفيذ التحكم في الوصول

### Row Level Security (RLS) - أمان مستوى الصف

```sql
-- Patients can view own data
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth.uid() = user_id);

-- Doctors can view assigned patients
CREATE POLICY "Doctors can view assigned patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments 
      WHERE appointments.patient_id = patients.id 
      AND appointments.doctor_id IN (
        SELECT id FROM doctors WHERE user_id = auth.uid()
      )
    )
  );

-- Staff can view all patients
CREATE POLICY "Staff can view all patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('staff', 'supervisor', 'admin')
    )
  );
```

### API Middleware - وسيط API

```typescript
// Role-based API protection
export function authorize(requiredRoles: string[]) {
  return (req: NextRequest) => {
    const userRole = req.headers.get('x-user-role');
    
    if (!requiredRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
  };
}

// Usage in API routes
export async function GET(request: NextRequest) {
  const authResult = authorize(['admin', 'supervisor'])(request);
  if (authResult) return authResult;
  
  // Protected route logic
}
```

### Frontend Protection - الحماية في الواجهة الأمامية

```tsx
// Protected route component
function ProtectedRoute({ 
  children, 
  requiredRoles 
}: { 
  children: React.ReactNode;
  requiredRoles: string[];
}) {
  const { user } = useAuth();
  
  if (!user || !requiredRoles.includes(user.role)) {
    return <AccessDenied />;
  }
  
  return <>{children}</>;
}

// Usage
<ProtectedRoute requiredRoles={['admin', 'supervisor']}>
  <AdminDashboard />
</ProtectedRoute>
```

## Dashboard Features by Role - ميزات لوحة التحكم حسب الدور

### Patient Dashboard - لوحة تحكم المريض

```tsx
function PatientDashboard() {
  return (
    <div>
      <h1>My Dashboard</h1>
      <PatientProfile />
      <AppointmentHistory />
      <PaymentStatus />
      <MedicalRecords />
    </div>
  );
}
```

### Doctor Dashboard - لوحة تحكم الطبيب

```tsx
function DoctorDashboard() {
  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <PatientList />
      <AppointmentSchedule />
      <MedicalRecordsEditor />
      <TestResults />
    </div>
  );
}
```

### Staff Dashboard - لوحة تحكم الموظف

```tsx
function StaffDashboard() {
  return (
    <div>
      <h1>Staff Dashboard</h1>
      <PatientRegistration />
      <AppointmentManagement />
      <PaymentProcessing />
      <InsuranceClaims />
    </div>
  );
}
```

### Supervisor Dashboard - لوحة تحكم المشرف

```tsx
function SupervisorDashboard() {
  return (
    <div>
      <h1>Supervisor Dashboard</h1>
      <StaffActivity />
      <ClaimsApproval />
      <PerformanceReports />
      <StaffManagement />
    </div>
  );
}
```

### Admin Dashboard - لوحة تحكم المدير

```tsx
function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <SystemOverview />
      <UserManagement />
      <SystemConfiguration />
      <SecurityMonitoring />
      <CompleteAnalytics />
    </div>
  );
}
```

## Permission Matrix - مصفوفة الصلاحيات

| Feature | Patient | Doctor | Staff | Supervisor | Admin |
|---------|---------|--------|-------|------------|-------|
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| View other profiles | ❌ | ✅* | ✅ | ✅ | ✅ |
| Edit medical records | ❌ | ✅* | ❌ | ❌ | ✅ |
| Schedule appointments | ❌ | ✅ | ✅ | ✅ | ✅ |
| Process payments | ❌ | ❌ | ✅ | ✅ | ✅ |
| View reports | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ | ✅ |
| System configuration | ❌ | ❌ | ❌ | ❌ | ✅ |

*Only for assigned patients

## Security Considerations - اعتبارات الأمان

### Data Protection - حماية البيانات

- **Encryption**: All sensitive data encrypted at rest
- **Access Logging**: All data access logged and monitored
- **Audit Trail**: Complete audit trail for all actions
- **Data Retention**: Automatic data retention policies

### Authentication - المصادقة

- **Multi-factor Authentication**: Required for admin and supervisor roles
- **Session Management**: Secure session handling with timeout
- **Password Policies**: Strong password requirements
- **Account Lockout**: Automatic lockout after failed attempts

### Authorization - التفويض

- **Principle of Least Privilege**: Users get minimum required access
- **Role Separation**: Clear separation of duties
- **Regular Audits**: Periodic access reviews
- **Permission Reviews**: Regular permission audits

## Implementation Guidelines - إرشادات التنفيذ

### Role Assignment - تعيين الأدوار

```typescript
// Role assignment during user creation
const createUser = async (userData: CreateUserData) => {
  const user = await supabase
    .from('users')
    .insert({
      ...userData,
      role: userData.role || 'patient'
    });
    
  // Assign role-specific permissions
  await assignRolePermissions(user.id, userData.role);
};
```

### Permission Checking - فحص الصلاحيات

```typescript
// Check user permissions
const hasPermission = (userRole: string, requiredRoles: string[]) => {
  return requiredRoles.includes(userRole);
};

// Usage in components
const canEditRecords = hasPermission(user.role, ['doctor', 'admin']);
```

### Role Updates - تحديث الأدوار

```typescript
// Update user role
const updateUserRole = async (userId: string, newRole: string) => {
  // Validate role exists
  const { data: role } = await supabase
    .from('roles')
    .select('role')
    .eq('role', newRole)
    .single();
    
  if (!role) {
    throw new Error('Invalid role');
  }
  
  // Update user role
  await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId);
    
  // Update permissions
  await updateRolePermissions(userId, newRole);
};
```

## Testing - الاختبار

### Role Testing - اختبار الأدوار

```typescript
// Test role-based access
describe('Role-based Access Control', () => {
  it('should allow patients to view own data', async () => {
    const patient = await createTestUser('patient');
    const response = await request(app)
      .get('/api/patients/own')
      .set('x-user-role', 'patient')
      .set('x-user-id', patient.id);
      
    expect(response.status).toBe(200);
  });
  
  it('should deny patients access to other data', async () => {
    const response = await request(app)
      .get('/api/patients/123')
      .set('x-user-role', 'patient');
      
    expect(response.status).toBe(403);
  });
});
```

### Permission Testing - اختبار الصلاحيات

```typescript
// Test specific permissions
describe('Permissions', () => {
  it('should allow doctors to edit medical records', () => {
    const canEdit = hasPermission('doctor', ['doctor', 'admin']);
    expect(canEdit).toBe(true);
  });
  
  it('should deny staff access to medical records', () => {
    const canEdit = hasPermission('staff', ['doctor', 'admin']);
    expect(canEdit).toBe(false);
  });
});
```

## Monitoring and Auditing - المراقبة والتدقيق

### Access Logging - تسجيل الوصول

```typescript
// Log all data access
const logAccess = async (userId: string, resource: string, action: string) => {
  await supabase
    .from('access_logs')
    .insert({
      user_id: userId,
      resource,
      action,
      timestamp: new Date().toISOString(),
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });
};
```

### Security Monitoring - مراقبة الأمان

```typescript
// Monitor suspicious activities
const monitorSecurity = async () => {
  // Check for unusual access patterns
  const suspiciousAccess = await supabase
    .from('access_logs')
    .select('*')
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000))
    .order('timestamp', { ascending: false });
    
  // Alert on suspicious activities
  if (suspiciousAccess.length > 100) {
    await sendSecurityAlert('High access volume detected');
  }
};
```

## Troubleshooting - استكشاف الأخطاء وإصلاحها

### Common Issues - المشاكل الشائعة

1. **Access Denied Errors**:
   - Check user role assignment
   - Verify permission requirements
   - Review RLS policies

2. **Role Not Working**:
   - Confirm role exists in database
   - Check role assignment
   - Verify middleware configuration

3. **Permission Issues**:
   - Review permission matrix
   - Check role hierarchy
   - Verify API protection

### Debug Mode - وضع التصحيح

```typescript
// Enable role debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Role debug:', {
    userRole: user.role,
    requiredRoles,
    hasAccess: hasPermission(user.role, requiredRoles),
    permissions: getUserPermissions(user.role)
  });
}
```

## Support - الدعم

For technical support and questions about the role system, please refer to the project documentation or contact the development team.
