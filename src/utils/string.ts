
// String utilities
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, "");
};

  return text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

  return text
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
};

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

  text: string,
  length: number,
  suffix: string = "...",
): string => {
  if (text.length <= length) return text;
  return text.slice(0, length - suffix.length) + suffix;
};

  text: string,
  wordCount: number,
  suffix: string = "...",
): string => {
  const words = text.split(" ");
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ") + suffix;
};

  return html.replace(/<[^>]*>/g, "");
};

  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
};

  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
  };
  return text.replace(/&(amp|lt|gt|quot|#039);/g, (m) => map[m] || m);
};

  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`;
};

  const [localPart, domain] = email.split("@");
  if (!localPart || localPart.length <= 2) return email;

  const maskedLocal =
    localPart[0] +
    "*".repeat(localPart.length - 2) +
    localPart[localPart.length - 1];
  return `${maskedLocal}@${domain}`;
};

  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 4) return phone;

  const visible = cleaned.slice(-4);
  const masked = "*".repeat(cleaned.length - 4);
  return masked + visible;
};

  const cleaned = cardNumber.replace(/\D/g, "");
  if (cleaned.length < 8) return cardNumber;

  const visible = cleaned.slice(-4);
  const masked = "*".repeat(cleaned.length - 4);
  return masked.replace(/(.{4})/g, "$1 ").trim() + visible;
};

  text: string,
  searchTerm: string,
  className: string = "highlight",
): string => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, "gi");
  return text.replace(regex, `<span class="${className}">$1</span>`);
};

  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

  count: number,
  singular: string,
  plural?: string,
): string => {
  if (count === 1) return singular;
  return plural || singular + "s";
};

  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) {
    return num + "st";
  }
  if (j === 2 && k !== 12) {
    return num + "nd";
  }
  if (j === 3 && k !== 13) {
    return num + "rd";
  }
  return num + "th";
};

  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, maxLength);
};

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};


// Exports
export const slugify = (text: string): string => {
export const camelCase = (text: string): string => {
export const pascalCase = (text: string): string => {
export const kebabCase = (text: string): string => {
export const snakeCase = (text: string): string => {
export const titleCase = (text: string): string => {
export const sentenceCase = (text: string): string => {
export const truncate = (
export const truncateWords = (
export const stripHtml = (html: string): string => {
export const escapeHtml = (text: string): string => {
export const unescapeHtml = (text: string): string => {
export const removeAccents = (text: string): string => {
export const generateRandomString = (length: number = 8): string => {
export const generateRandomId = (prefix: string = ""): string => {
export const maskEmail = (email: string): string => {
export const maskPhone = (phone: string): string => {
export const maskCreditCard = (cardNumber: string): string => {
export const highlightText = (
export const escapeRegex = (text: string): string => {
export const pluralize = (
export const ordinal = (num: number): string => {
export const initials = (name: string, maxLength: number = 2): string => {
export const capitalize = (text: string): string => {
export const capitalizeWords = (text: string): string => {