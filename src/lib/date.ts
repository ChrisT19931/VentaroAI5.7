/**
 * Date utility functions
 */

/**
 * Converts a date value to ISO string format
 * @param d Date value (string, Date object, or null/undefined)
 * @returns ISO string or undefined if input is invalid
 */
export const toIso = (d: string | Date | null | undefined) =>
  d instanceof Date ? d.toISOString() : (typeof d === 'string' ? d : undefined);

/**
 * Formats a date string for display
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};