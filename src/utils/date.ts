// Date utilities
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

export const addSeconds = (date: Date, seconds: number): Date => {
  const result = new Date(date);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
};

export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  result.setDate(diff);
  return startOfDay(result);
};

export const endOfWeek = (date: Date): Date => {
  const result = startOfWeek(date);
  return endOfDay(addDays(result, 6));
};

export const startOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  return startOfDay(result);
};

export const endOfMonth = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return endOfDay(result);
};

export const startOfYear = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(0, 1);
  return startOfDay(result);
};

export const endOfYear = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(11, 31);
  return endOfDay(result);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isSameWeek = (date1: Date, date2: Date): boolean => {
  const start1 = startOfWeek(date1);
  const start2 = startOfWeek(date2);
  return isSameDay(start1, start2);
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

export const isSameYear = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear();
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = addDays(new Date(), -1);
  return isSameDay(date, yesterday);
};

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = addDays(new Date(), 1);
  return isSameDay(date, tomorrow);
};

export const isPast = (date: Date): boolean => {
  return date < new Date();
};

export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getDaysInYear = (date: Date): number => {
  const year = date.getFullYear();
  return isLeapYear(year) ? 366 : 365;
};

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getQuarter = (date: Date): number => {
  return Math.floor(date.getMonth() / 3) + 1;
};

export const getAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;

    return age;

  export const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
          return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

          const diffInDays = Math.floor(diffInHours / 24);
          if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

            const diffInWeeks = Math.floor(diffInDays / 7);
            if (diffInWeeks < 4) {
              return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

              const diffInMonths = Math.floor(diffInDays / 30);
              if (diffInMonths < 12) {
                return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;

                const diffInYears = Math.floor(diffInDays / 365);
                return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
              }
            }
          }
        }
      }
    }
  };
};
