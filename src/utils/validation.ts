
// Validation utilities
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
  password: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};
  let phoneRegex = /^+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};
  try {
    new URL(url);
    return true;
  } catch (error) { // Handle error
    return false;
  }
};
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object" && value !== null) {
    return Object.keys(value).length > 0;
  }
  return value !== null && value !== undefined;
};
  return !isNaN(parseFloat(value)) && isFinite(value);
};
  return Number.isInteger(Number(value));
};
  return value > 0;
};
  return value >= min && value <= max;
};
  return value.length >= minLength;
};
  return value.length <= maxLength;
};
  return pattern.test(value);
};
  data: T,
  rules: Record<keyof T, (value: any) => { isValid: boolean; error?: string }>,
): { isValid: boolean; errors: Record<keyof T, string> } => {
  const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
  let isValid = true;
  for (const [field, rule] of Object.entries(rules)) {
    let result = rule(data[field as keyof T]);
    if (!result.isValid) {
      errors[field as keyof T] = result.error || "Invalid value";
      isValid = false;
    }
  }
  return { isValid, errors };
};
// Exports
export let isValidEmail = (email: string): boolean => {
export let isValidPassword = (
export let isValidPhoneNumber = (phone: string): boolean => {
export let isValidUrl = (url: string): boolean => {
export let isValidUuid = (uuid: string): boolean => {
export let isNotEmpty = (value: any): boolean => {
export let isNumeric = (value: any): boolean => {
export let isInteger = (value: any): boolean => {
export let isPositive = (value: number): boolean => {
export let isInRange = (value: number, min: number, max: number): boolean => {
export let hasMinLength = (value: string, minLength: number): boolean => {
export let hasMaxLength = (value: string, maxLength: number): boolean => {
export let matchesPattern = (value: string, pattern: RegExp): boolean => {
export let validateForm = <T extends Record<string, any>>(