// src/lib/utils.ts — بدون أي مكتبات خارجية
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
