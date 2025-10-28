// Validation utilities
export const __isValidEmail = (_email: string): boolean => {
  const __emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const __isValidPassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const __isValidPhoneNumber = (_phone: string): boolean => {
  const __phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const __isValidUrl = (_url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const __isValidUuid = (_uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const __isNotEmpty = (_value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length > 0;
  }
  return value !== null && value !== undefined;
};

export const __isNumeric = (_value: unknown): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const __isInteger = (_value: unknown): boolean => {
  return Number.isInteger(Number(value));
};

export const __isPositive = (_value: number): boolean => {
  return value > 0;
};

export const __isInRange = (
  _value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};

export const __hasMinLength = (_value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const __hasMaxLength = (_value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const __matchesPattern = (_value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

export const __validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Record<
    keyof T,
    (_value: unknown) => { isValid: boolean; error?: string }
  >
): { isValid: boolean; errors: Record<keyof T, string> } => {
  const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
  let isValid = true;

  for (const [field, rule] of Object.entries(rules)) {
    const __result = rule(data[field as keyof T]);
    if (!result.isValid) {
      errors[field as keyof T] = result.error || 'Invalid value';
      isValid = false;
    }
  }

  return { isValid, errors };
};
