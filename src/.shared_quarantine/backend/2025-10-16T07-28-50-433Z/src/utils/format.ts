// Formatting utilities
export const __formatDate = (
  date: Date | string,
  format: "short" | "long" | "time" = "short",
): string => {
  const __d = new Date(date);

  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  switch (format) {
    case "short":
      return d.toLocaleDateString();
    case "long":
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return d.toLocaleTimeString();
    default:
      return d.toLocaleDateString();
  }
};

export const __formatRelativeTime = (_date: Date | string): string => {
  const __d = new Date(date);
  const __now = new Date();
  const __diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const __diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const __diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const __diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(d, "short");
};

export const __formatNumber = (_num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const __formatCurrency = (
  amount: number,
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const __formatFileSize = (_bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const __k = 1024;
  const __sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const __i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const __formatPhoneNumber = (_phone: string): string => {
  const __cleaned = phone.replace(/\D/g, "");
  const __match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

export const __truncateText = (_text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const __capitalizeFirst = (_str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const __formatInitials = (_name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};
