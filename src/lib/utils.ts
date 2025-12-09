import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a Date object to YYYY-MM-DD string format
 * Useful for API requests that expect date strings
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateToAPI(
  date: Date | string | null | undefined
): string | null {
  if (!date) return null;

  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) return null;

  return dateObj.toISOString().split("T")[0];
}
