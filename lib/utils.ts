import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx for conditional styling.
 * Handles class conflicts properly by removing duplicate utilities.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a localized, human-readable format.
 * Handles invalid dates and null/undefined values gracefully.
 */
export function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Extract initials from a name string.
 * Returns up to 2 characters from the first 2 words.
 * Defaults to "SL" if no name provided.
 */
export function getInitials(value?: string | null) {
  if (!value) {
    return "SL";
  }

  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
