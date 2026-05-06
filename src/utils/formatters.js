import { format, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(dateStr, fmt = 'MMM d, yyyy') {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatPercent(value, decimals = 1) {
  return `${Number(value).toFixed(decimals)}%`;
}

export function formatShortNumber(num) {
  if (Math.abs(num) >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (Math.abs(num) >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return formatCurrency(num);
}

export function getDateRange(period) {
  const now = new Date();
  switch (period) {
    case 'daily':   return { start: startOfDay(now), end: endOfDay(now) };
    case 'weekly':  return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'monthly': return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'yearly':  return { start: startOfYear(now), end: endOfYear(now) };
    default:        return { start: startOfYear(now), end: endOfYear(now) };
  }
}

export function isInPeriod(dateStr, period) {
  try {
    const date = parseISO(dateStr);
    const { start, end } = getDateRange(period);
    return isWithinInterval(date, { start, end });
  } catch {
    return false;
  }
}
