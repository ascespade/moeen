-- ===================================================
-- Create hash_password function for pgcrypto
-- ===================================================
-- This function hashes a password using pgcrypto
-- Useful for setting passwords for users

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to hash password
CREATE OR REPLACE FUNCTION hash_password(
  password_input TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Hash the password using bcrypt (bf = blowfish)
  RETURN crypt(password_input, gen_salt('bf'));
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO service_role;
