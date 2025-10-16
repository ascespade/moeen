// Validation constants
export const __VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: "Please enter a valid email address",
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
    MESSAGE:
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  },
  PHONE: {
    PATTERN: /^\+?[\d\s\-\(\)]{10,}$/,
    MESSAGE: "Please enter a valid phone number",
  },
  URL: {
    PATTERN:
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    MESSAGE: "Please enter a valid URL",
  },
  UUID: {
    PATTERN:
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    MESSAGE: "Please enter a valid UUID",
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/,
    MESSAGE:
      "Name must be 2-50 characters long and contain only letters and spaces",
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
    MESSAGE:
      "Username must be 3-20 characters long and contain only letters, numbers, and underscores",
  },
  SLUG: {
    PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    MESSAGE: "Slug must contain only lowercase letters, numbers, and hyphens",
  },
  HEX_COLOR: {
    PATTERN: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    MESSAGE: "Please enter a valid hex color code",
  },
  IP_ADDRESS: {
    PATTERN:
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    MESSAGE: "Please enter a valid IP address",
  },
} as const;

export const __VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  MIN_LENGTH: (_min: number) => `Must be at least ${min} characters long`,
  MAX_LENGTH: (_max: number) => `Must be no more than ${max} characters long`,
  MIN_VALUE: (_min: number) => `Must be at least ${min}`,
  MAX_VALUE: (_max: number) => `Must be no more than ${max}`,
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD: "Password does not meet requirements",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_URL: "Please enter a valid URL",
  INVALID_UUID: "Please enter a valid UUID",
  INVALID_NAME: "Please enter a valid name",
  INVALID_USERNAME: "Please enter a valid username",
  INVALID_SLUG: "Please enter a valid slug",
  INVALID_HEX_COLOR: "Please enter a valid hex color code",
  INVALID_IP_ADDRESS: "Please enter a valid IP address",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
  INVALID_DATE: "Please enter a valid date",
  INVALID_TIME: "Please enter a valid time",
  INVALID_DATETIME: "Please enter a valid date and time",
  INVALID_NUMBER: "Please enter a valid number",
  INVALID_INTEGER: "Please enter a valid integer",
  INVALID_POSITIVE_NUMBER: "Please enter a positive number",
  INVALID_NEGATIVE_NUMBER: "Please enter a negative number",
  INVALID_RANGE: (_min: number, max: number) =>
    `Must be between ${min} and ${max}`,
  INVALID_PATTERN: "Please enter a valid value",
  INVALID_FILE_TYPE: "Please select a valid file type",
  INVALID_FILE_SIZE: (_maxSize: string) =>
    `File size must be less than ${maxSize}`,
  INVALID_IMAGE_DIMENSIONS: (_width: number, height: number) =>
    `Image must be ${width}x${height} pixels`,
  INVALID_IMAGE_ASPECT_RATIO: (_ratio: string) =>
    `Image aspect ratio must be ${ratio}`,
} as const;

export const __FILE_VALIDATION = {
  IMAGE: {
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_DIMENSIONS: { width: 4096, height: 4096 },
  },
  DOCUMENT: {
    ALLOWED_TYPES: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
  },
  VIDEO: {
    ALLOWED_TYPES: ["video/mp4", "video/webm", "video/ogg"],
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
  },
  AUDIO: {
    ALLOWED_TYPES: ["audio/mp3", "audio/wav", "audio/ogg"],
    MAX_SIZE: 20 * 1024 * 1024, // 20MB
  },
} as const;
