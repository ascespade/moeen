# 🔐 APIs التوثيق - Authentication APIs
## مُعين Healthcare Platform

**تاريخ الإعداد**: 2025-01-17  
**النسخة**: 2.0  
**الحالة**: Production-Ready APIs

---

## 📋 نظرة عامة

APIs التوثيق تتعامل مع تسجيل الدخول، التسجيل، إدارة الجلسات، وإدارة الصلاحيات في منصة مُعين الصحية.

### Base URL:
```
Production: https://api.moeen.health
Development: http://localhost:3000
```

### Content-Type:
```
Content-Type: application/json
```

---

## 🔑 تسجيل الدخول

### `POST /api/auth/login`

تسجيل دخول المستخدم إلى النظام.

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123",
      "email": "user@example.com",
      "role": "doctor",
      "name": "Dr. John Doe",
      "avatar": "https://api.moeen.health/avatars/uuid-123.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d",
    "refreshToken": "refresh-token-here"
  }
}
```

#### Response (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

#### Response (429 Too Many Requests):
```json
{
  "success": false,
  "error": "Too many login attempts",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 300
}
```

---

## 📝 تسجيل مستخدم جديد

### `POST /api/auth/register`

تسجيل مستخدم جديد في النظام.

#### Request Body:
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "patient",
  "phone": "+966501234567",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

#### Response (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-456",
      "email": "newuser@example.com",
      "role": "patient",
      "name": "John Doe",
      "status": "pending_verification"
    },
    "message": "User created successfully. Please check your email for verification."
  }
}
```

#### Response (400 Bad Request):
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

#### Response (409 Conflict):
```json
{
  "success": false,
  "error": "User already exists",
  "code": "USER_EXISTS"
}
```

---

## 🚪 تسجيل الخروج

### `POST /api/auth/logout`

تسجيل خروج المستخدم من النظام.

#### Headers:
```
Authorization: Bearer <token>
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Response (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid token",
  "code": "INVALID_TOKEN"
}
```

---

## 🔄 تحديث الجلسة

### `POST /api/auth/refresh`

تحديث JWT token باستخدام refresh token.

#### Request Body:
```json
{
  "refreshToken": "refresh-token-here"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token-here",
    "expiresIn": "7d"
  }
}
```

#### Response (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

---

## 👤 بيانات المستخدم الحالي

### `GET /api/auth/me`

الحصول على بيانات المستخدم الحالي.

#### Headers:
```
Authorization: Bearer <token>
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123",
      "email": "user@example.com",
      "role": "doctor",
      "name": "Dr. John Doe",
      "avatar": "https://api.moeen.health/avatars/uuid-123.jpg",
      "phone": "+966501234567",
      "dateOfBirth": "1985-05-15",
      "gender": "male",
      "status": "active",
      "lastLogin": "2025-01-17T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2025-01-17T10:30:00Z"
    },
    "permissions": [
      "patients.read",
      "patients.write",
      "appointments.read",
      "appointments.write",
      "medical.read",
      "medical.write"
    ]
  }
}
```

#### Response (401 Unauthorized):
```json
{
  "success": false,
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

---

## 🔒 تغيير كلمة المرور

### `PUT /api/auth/change-password`

تغيير كلمة مرور المستخدم الحالي.

#### Headers:
```
Authorization: Bearer <token>
```

#### Request Body:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Response (400 Bad Request):
```json
{
  "success": false,
  "error": "Current password is incorrect",
  "code": "INVALID_CURRENT_PASSWORD"
}
```

---

## 🔑 نسيان كلمة المرور

### `POST /api/auth/forgot-password`

إرسال رابط إعادة تعيين كلمة المرور.

#### Request Body:
```json
{
  "email": "user@example.com"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

#### Response (404 Not Found):
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

---

## 🔄 إعادة تعيين كلمة المرور

### `POST /api/auth/reset-password`

إعادة تعيين كلمة المرور باستخدام الرابط المرسل.

#### Request Body:
```json
{
  "token": "reset-token-here",
  "newPassword": "newpassword123"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Response (400 Bad Request):
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_RESET_TOKEN"
}
```

---

## ✅ التحقق من البريد الإلكتروني

### `POST /api/auth/verify-email`

التحقق من البريد الإلكتروني باستخدام الرابط المرسل.

#### Request Body:
```json
{
  "token": "verification-token-here"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Response (400 Bad Request):
```json
{
  "success": false,
  "error": "Invalid or expired verification token",
  "code": "INVALID_VERIFICATION_TOKEN"
}
```

---

## 🔐 إعادة إرسال رابط التحقق

### `POST /api/auth/resend-verification`

إعادة إرسال رابط التحقق من البريد الإلكتروني.

#### Request Body:
```json
{
  "email": "user@example.com"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

#### Response (400 Bad Request):
```json
{
  "success": false,
  "error": "Email already verified",
  "code": "EMAIL_ALREADY_VERIFIED"
}
```

---

## 🛡️ المصادقة الثنائية (2FA)

### `POST /api/auth/enable-2fa`

تفعيل المصادقة الثنائية للمستخدم.

#### Headers:
```
Authorization: Bearer <token>
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "secret": "JBSWY3DPEHPK3PXP",
    "backupCodes": [
      "12345678",
      "87654321",
      "11223344",
      "44332211"
    ]
  }
}
```

### `POST /api/auth/verify-2fa`

التحقق من رمز المصادقة الثنائية.

#### Headers:
```
Authorization: Bearer <token>
```

#### Request Body:
```json
{
  "code": "123456"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "2FA verified successfully"
}
```

---

## 🔍 فحص الصلاحيات

### `GET /api/auth/permissions`

فحص صلاحيات المستخدم الحالي.

#### Headers:
```
Authorization: Bearer <token>
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "permissions": [
      "patients.read",
      "patients.write",
      "appointments.read",
      "appointments.write",
      "medical.read",
      "medical.write"
    ],
    "role": "doctor",
    "rolePermissions": {
      "patients": ["read", "write"],
      "appointments": ["read", "write"],
      "medical": ["read", "write"]
    }
  }
}
```

---

## 🚨 إدارة الجلسات

### `GET /api/auth/sessions`

عرض جميع الجلسات النشطة للمستخدم.

#### Headers:
```
Authorization: Bearer <token>
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session-123",
        "device": "Chrome on Windows",
        "ipAddress": "192.168.1.100",
        "location": "Riyadh, Saudi Arabia",
        "lastActivity": "2025-01-17T10:30:00Z",
        "isCurrent": true
      },
      {
        "id": "session-456",
        "device": "Safari on iPhone",
        "ipAddress": "192.168.1.101",
        "location": "Jeddah, Saudi Arabia",
        "lastActivity": "2025-01-16T15:20:00Z",
        "isCurrent": false
      }
    ]
  }
}
```

### `DELETE /api/auth/sessions/{sessionId}`

إنهاء جلسة محددة.

#### Headers:
```
Authorization: Bearer <token>
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Session terminated successfully"
}
```

---

## 📊 إحصائيات التوثيق

### `GET /api/auth/stats`

إحصائيات التوثيق (للمديرين فقط).

#### Headers:
```
Authorization: Bearer <admin-token>
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "totalUsers": 1234,
    "activeUsers": 890,
    "newUsersToday": 12,
    "newUsersThisWeek": 78,
    "newUsersThisMonth": 234,
    "loginAttemptsToday": 567,
    "failedLoginsToday": 23,
    "averageSessionDuration": "2h 30m",
    "mostActiveHours": [
      "09:00-10:00",
      "14:00-15:00",
      "19:00-20:00"
    ]
  }
}
```

---

## 🔧 إعدادات التوثيق

### `GET /api/auth/settings`

إعدادات التوثيق (للمديرين فقط).

#### Headers:
```
Authorization: Bearer <admin-token>
```

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "passwordPolicy": {
      "minLength": 8,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true,
      "maxAge": 90
    },
    "sessionSettings": {
      "timeout": 3600,
      "maxSessions": 5,
      "requireReauth": false
    },
    "twoFactorSettings": {
      "enabled": true,
      "required": false,
      "backupCodes": 8
    },
    "rateLimiting": {
      "loginAttempts": 5,
      "windowMinutes": 15,
      "lockoutMinutes": 30
    }
  }
}
```

### `PUT /api/auth/settings`

تحديث إعدادات التوثيق (للمديرين فقط).

#### Headers:
```
Authorization: Bearer <admin-token>
```

#### Request Body:
```json
{
  "passwordPolicy": {
    "minLength": 10,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumbers": true,
    "requireSpecialChars": true,
    "maxAge": 60
  },
  "sessionSettings": {
    "timeout": 7200,
    "maxSessions": 3,
    "requireReauth": true
  }
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## 🚨 رموز الأخطاء

| الكود | المعنى | الحل |
|-------|--------|------|
| `INVALID_CREDENTIALS` | بيانات دخول خاطئة | تحقق من البريد وكلمة المرور |
| `USER_NOT_FOUND` | مستخدم غير موجود | تحقق من البريد الإلكتروني |
| `USER_EXISTS` | مستخدم موجود مسبقاً | استخدم بريد إلكتروني آخر |
| `INVALID_TOKEN` | رمز غير صالح | سجل دخول مرة أخرى |
| `TOKEN_EXPIRED` | انتهت صلاحية الرمز | استخدم refresh token |
| `RATE_LIMIT_EXCEEDED` | تجاوز حد المحاولات | انتظر قبل المحاولة مرة أخرى |
| `ACCOUNT_LOCKED` | الحساب مقفل | تواصل مع الدعم |
| `EMAIL_NOT_VERIFIED` | البريد غير محقق | تحقق من البريد الإلكتروني |
| `INVALID_2FA_CODE` | رمز 2FA خاطئ | تحقق من الرمز |
| `VALIDATION_ERROR` | خطأ في التحقق | تحقق من البيانات المدخلة |

---

## 📝 أمثلة الاستخدام

### JavaScript (Fetch):
```javascript
// تسجيل الدخول
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  } else {
    throw new Error(data.error);
  }
};

// استخدام الرمز في الطلبات
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### cURL:
```bash
# تسجيل الدخول
curl -X POST https://api.moeen.health/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# الحصول على بيانات المستخدم
curl -X GET https://api.moeen.health/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Python (Requests):
```python
import requests

# تسجيل الدخول
def login(email, password):
    response = requests.post('https://api.moeen.health/api/auth/login', json={
        'email': email,
        'password': password
    })
    
    if response.status_code == 200:
        data = response.json()
        return data['data']['token']
    else:
        raise Exception(response.json()['error'])

# استخدام الرمز
def get_current_user(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get('https://api.moeen.health/api/auth/me', headers=headers)
    return response.json()
```

---

## 🔒 الأمان

### 1. **تشفير البيانات**
- جميع كلمات المرور مشفرة باستخدام bcrypt
- JWT tokens موقعة بـ HMAC SHA-256
- البيانات الحساسة مشفرة في قاعدة البيانات

### 2. **Rate Limiting**
- 5 محاولات دخول كل 15 دقيقة
- 10 طلبات API كل دقيقة لكل مستخدم
- 100 طلب API كل ساعة لكل IP

### 3. **حماية إضافية**
- HTTPS إجباري في الإنتاج
- CORS محدود للمواقع المسموحة
- Headers أمان متقدمة
- تسجيل جميع محاولات الدخول

---

*تم إعداد هذا الدليل بتاريخ: 2025-01-17*  
*النسخة: 2.0*  
*الحالة: Production-Ready APIs*
