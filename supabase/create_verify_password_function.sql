-- ===================================================
-- Create verify_password function for pgcrypto
-- ===================================================
--
-- This function verifies a password against a hash stored in the database
-- It uses pgcrypto's crypt function for password verification
--

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to verify password
CREATE OR REPLACE FUNCTION verify_password(
  password_input TEXT,
  password_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Compare the input password with the stored hash using crypt
  -- crypt(password_input, password_hash) will generate the same hash
  -- if the password matches
  RETURN crypt(password_input, password_hash) = password_hash;
EXCEPTION
  WHEN OTHERS THEN
    -- If there's an error (e.g., invalid hash format), return false
    RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;

-- ===================================================
-- Usage Example:
-- ===================================================
-- 
-- To create a user with hashed password:
-- INSERT INTO users (email, password_hash, name, role, status)
-- VALUES (
--   'user@example.com',
--   crypt('password123', gen_salt('bf')),
--   'Test User',
--   'patient',
--   'active'
-- );
--
-- To verify a password:
-- SELECT verify_password('password123', (SELECT password_hash FROM users WHERE email = 'user@example.com'));
-- This will return TRUE if the password matches, FALSE otherwise
--
