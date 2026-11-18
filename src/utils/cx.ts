import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * BoardUI Canonical Class Merger:
 * Merges Tailwind CSS classes with clsx and twMerge, eliminating conflicts cleanly.
 */
export function cx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export default cx;
