
// Date utilities
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

  const result = new Date(date);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
};

  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  result.setDate(diff);
  return startOfDay(result);
};

  const result = startOfWeek(date);
  return endOfDay(addDays(result, 6));
};

  const result = new Date(date);
  result.setDate(1);
  return startOfDay(result);
};

  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return endOfDay(result);
};

  const result = new Date(date);
  result.setMonth(0, 1);
  return startOfDay(result);
};

  const result = new Date(date);
  result.setMonth(11, 31);
  return endOfDay(result);
};

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

  const start1 = startOfWeek(date1);
  const start2 = startOfWeek(date2);
  return isSameDay(start1, start2);
};

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

  return date1.getFullYear() === date2.getFullYear();
};

  return isSameDay(date, new Date());
};

  const yesterday = addDays(new Date(), -1);
  return isSameDay(date, yesterday);
};

  const tomorrow = addDays(new Date(), 1);
  return isSameDay(date, tomorrow);
};

  return date < new Date();
};

  return date > new Date();
};

  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

  const year = date.getFullYear();
  return isLeapYear(year) ? 366 : 365;
};

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

  return Math.floor(date.getMonth() / 3) + 1;
};

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};


// Exports
export const addDays = (date: Date, days: number): Date => {
export const addHours = (date: Date, hours: number): Date => {
export const addMinutes = (date: Date, minutes: number): Date => {
export const addSeconds = (date: Date, seconds: number): Date => {
export const startOfDay = (date: Date): Date => {
export const endOfDay = (date: Date): Date => {
export const startOfWeek = (date: Date): Date => {
export const endOfWeek = (date: Date): Date => {
export const startOfMonth = (date: Date): Date => {
export const endOfMonth = (date: Date): Date => {
export const startOfYear = (date: Date): Date => {
export const endOfYear = (date: Date): Date => {
export const isSameDay = (date1: Date, date2: Date): boolean => {
export const isSameWeek = (date1: Date, date2: Date): boolean => {
export const isSameMonth = (date1: Date, date2: Date): boolean => {
export const isSameYear = (date1: Date, date2: Date): boolean => {
export const isToday = (date: Date): boolean => {
export const isYesterday = (date: Date): boolean => {
export const isTomorrow = (date: Date): boolean => {
export const isPast = (date: Date): boolean => {
export const isFuture = (date: Date): boolean => {
export const getDaysInMonth = (date: Date): number => {
export const getDaysInYear = (date: Date): number => {
export const isLeapYear = (year: number): boolean => {
export const getWeekNumber = (date: Date): number => {
export const getQuarter = (date: Date): number => {
export const getAge = (birthDate: Date): number => {
export const getTimeAgo = (date: Date): string => {