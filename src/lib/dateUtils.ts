/**
 * Standardized date formatting and grouping keys for the Paddle Up application.
 */

/**
 * Returns a sortable key for grouping events by month (e.g., "2025-12").
 */
export const monthKey = (d: Date | string | number): string => {
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return 'unknown';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Returns a human-readable month/year label (e.g., "Dec 2025").
 */
export const monthLabel = (d: Date | string | number): string => {
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return 'Unknown Date';
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

/**
 * Returns a list of unique month keys and labels from a collection of dates,
 * sorted descending (newest first).
 */
export const getMonthOptions = (dates: (Date | undefined)[]) => {
  const map = new Map<string, Date>();

  dates.forEach((d) => {
    if (d instanceof Date && !isNaN(d.getTime())) {
      const key = monthKey(d);
      if (!map.has(key)) map.set(key, d);
    }
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1].getTime() - a[1].getTime())
    .map(([key, d]) => ({
      key,
      label: monthLabel(d),
    }));
};
