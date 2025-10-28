// String utilities
export const __slugify = (_text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const __camelCase = (_text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const __pascalCase = (_text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
    .replace(/\s+/g, '');
};

export const __kebabCase = (_text: string): string => {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

export const __snakeCase = (_text: string): string => {
  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

export const __titleCase = (_text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const __sentenceCase = (_text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const __truncate = (
  text: string,
  length: number,
  suffix: string = '...'
): string => {
  if (text.length <= length) return text;
  return text.slice(0, length - suffix.length) + suffix;
};

export const __truncateWords = (
  text: string,
  wordCount: number,
  suffix: string = '...'
): string => {
  const __words = text.split(' ');
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + suffix;
};

export const __stripHtml = (_html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export const __escapeHtml = (_text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m] || m);
};

export const __unescapeHtml = (_text: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  return text.replace(/&(amp|lt|gt|quot|#039);/g, m => map[m] || m);
};

export const __removeAccents = (_text: string): string => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const __generateRandomString = (_length: number = 8): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const __generateRandomId = (_prefix: string = ''): string => {
  const __timestamp = Date.now().toString(36);
  const __random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`;
};

export const __maskEmail = (_email: string): string => {
  const [localPart, domain] = email.split('@');
  if (!localPart || localPart.length <= 2) return email;

  const maskedLocal =
    localPart[0] +
    '*'.repeat(localPart.length - 2) +
    localPart[localPart.length - 1];
  return `${maskedLocal}@${domain}`;
};

export const __maskPhone = (_phone: string): string => {
  const __cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;

  const __visible = cleaned.slice(-4);
  const __masked = '*'.repeat(cleaned.length - 4);
  return masked + visible;
};

export const __maskCreditCard = (_cardNumber: string): string => {
  const __cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 8) return cardNumber;

  const __visible = cleaned.slice(-4);
  const __masked = '*'.repeat(cleaned.length - 4);
  return masked.replace(/(.{4})/g, '$1 ').trim() + visible;
};

export const __highlightText = (
  text: string,
  searchTerm: string,
  className: string = 'highlight'
): string => {
  if (!searchTerm) return text;

  const __regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
};

export const __escapeRegex = (_text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const __pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  if (count === 1) return singular;
  return plural || singular + 's';
};

export const __ordinal = (_num: number): string => {
  const __j = num % 10;
  const __k = num % 100;

  if (j === 1 && k !== 11) {
    return num + 'st';
  }
  if (j === 2 && k !== 12) {
    return num + 'nd';
  }
  if (j === 3 && k !== 13) {
    return num + 'rd';
  }
  return num + 'th';
};

export const __initials = (_name: string, maxLength: number = 2): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, maxLength);
};

export const __capitalize = (_text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const __capitalizeWords = (_text: string): string => {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};
