import { parseISO, isValid, format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export const safeParseDate = (dateString: string): Date | null => {
  try {
    if (!dateString) return null;
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const safeDateFormat = (date: Date | null, formatString: string): string => {
  if (!date || !isValid(date)) return 'Invalid Date';
  return format(date, formatString);
};

export const isInMonth = (date: Date | null, targetMonth: Date): boolean => {
  if (!date || !isValid(date)) return false;
  return isSameMonth(date, targetMonth);
};

export const getMonthBounds = (date: Date) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  };
};