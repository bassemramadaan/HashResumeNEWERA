import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hapticFeedback(pattern: number | number[] = 50) {
  if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Ignore
    }
  }
}
