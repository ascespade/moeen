# 🔍 Debug Login Issue

## Steps to Debug

1. **Check Browser Console** - Look for errors when clicking login
2. **Check Network Tab** - See the response from `/api/auth/custom-login`
3. **Check Server Logs** - Look for `[AUTH-HUB]` and `[CUSTOM-LOGIN]` logs

## Common Issues

### Issue 1: `verify_password` function doesn't exist
**Solution**: Run `apply_db_fix_working.sql` in Supabase SQL Editor

### Issue 2: Password hash mismatch
**Solution**: The password was hashed differently. Re-run the UPDATE statements in the SQL file.

### Issue 3: JWT_SECRET not set
**Solution**: Add to `.env.local`:
```
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
```

### Issue 4: User ID type mismatch
**Fixed**: Changed from `number` to `string` (UUID) in CustomAuthHub.ts

## Test Login Manually

```sql
-- Test if verify_password works
SELECT verify_password('Admin123!', password_hash) 
FROM users 
WHERE email = 'admin@test.com';
```

## Check User Status

```sql
SELECT 
  email,
  status,
  CASE 
    WHEN password_hash IS NULL OR password_hash = '' THEN 'No password'
    ELSE 'Has password'
  END as password_status
FROM users
WHERE email = 'admin@test.com';
```
