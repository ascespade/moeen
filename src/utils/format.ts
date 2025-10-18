
// Formatting utilities
  date: Date | string,
  format: "short" | "long" | "time" = "short",
): string => {
  const d = new Date(date);

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

  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(d, "short");
};

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

  amount: number,
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};


// Exports
export const formatDate = (
export const formatRelativeTime = (date: Date | string): string => {
export const formatNumber = (num: number, decimals: number = 0): string => {
export const formatCurrency = (
export const formatFileSize = (bytes: number): string => {
export const formatPhoneNumber = (phone: string): string => {
export const truncateText = (text: string, maxLength: number): string => {
export const capitalizeFirst = (str: string): string => {
export const formatInitials = (name: string): string => {