// Date utilities
export const __addDays = (_date: Date, days: number): Date => {
  const __result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const __addHours = (_date: Date, hours: number): Date => {
  const __result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const __addMinutes = (_date: Date, minutes: number): Date => {
  const __result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

export const __addSeconds = (_date: Date, seconds: number): Date => {
  const __result = new Date(date);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
};

export const __startOfDay = (_date: Date): Date => {
  const __result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const __endOfDay = (_date: Date): Date => {
  const __result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const __startOfWeek = (_date: Date): Date => {
  const __result = new Date(date);
  const __day = result.getDay();
  const __diff = result.getDate() - day;
  result.setDate(diff);
  return startOfDay(result);
};

export const __endOfWeek = (_date: Date): Date => {
  const __result = startOfWeek(date);
  return endOfDay(addDays(result, 6));
};

export const __startOfMonth = (_date: Date): Date => {
  const __result = new Date(date);
  result.setDate(1);
  return startOfDay(result);
};

export const __endOfMonth = (_date: Date): Date => {
  const __result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return endOfDay(result);
};

export const __startOfYear = (_date: Date): Date => {
  const __result = new Date(date);
  result.setMonth(0, 1);
  return startOfDay(result);
};

export const __endOfYear = (_date: Date): Date => {
  const __result = new Date(date);
  result.setMonth(11, 31);
  return endOfDay(result);
};

export const __isSameDay = (_date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const __isSameWeek = (_date1: Date, date2: Date): boolean => {
  const __start1 = startOfWeek(date1);
  const __start2 = startOfWeek(date2);
  return isSameDay(start1, start2);
};

export const __isSameMonth = (_date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

export const __isSameYear = (_date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear();
};

export const __isToday = (_date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const __isYesterday = (_date: Date): boolean => {
  const __yesterday = addDays(new Date(), -1);
  return isSameDay(date, yesterday);
};

export const __isTomorrow = (_date: Date): boolean => {
  const __tomorrow = addDays(new Date(), 1);
  return isSameDay(date, tomorrow);
};

export const __isPast = (_date: Date): boolean => {
  return date < new Date();
};

export const __isFuture = (_date: Date): boolean => {
  return date > new Date();
};

export const __getDaysInMonth = (_date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const __getDaysInYear = (_date: Date): number => {
  const __year = date.getFullYear();
  return isLeapYear(year) ? 366 : 365;
};

export const __isLeapYear = (_year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const __getWeekNumber = (_date: Date): number => {
  const __firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const __pastDaysOfYear =
    (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const __getQuarter = (_date: Date): number => {
  return Math.floor(date.getMonth() / 3) + 1;
};

export const __getAge = (_birthDate: Date): number => {
  const __today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const __monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const __getTimeAgo = (_date: Date): string => {
  const __now = new Date();
  const __diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const __diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const __diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const __diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const __diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const __diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const __diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};
