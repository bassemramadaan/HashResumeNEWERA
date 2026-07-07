/**
 * A safe, crash-proof proxy wrapper for localStorage.
 * If localStorage is blocked or unavailable (e.g., inside third-party iframes
 * or private browsing), it falls back to a temporary in-memory storage.
 */

let isStorageSupported = false;

try {
  if (typeof window !== "undefined" && window.localStorage) {
    const testKey = "__storage_test_key__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    isStorageSupported = true;
  }
} catch {
  isStorageSupported = false;
}

const memoryStore: Record<string, string> = {};

export const safeLocalStorage = isStorageSupported
  ? window.localStorage
  : {
      getItem: (key: string): string | null => {
        return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
      },
      setItem: (key: string, value: string): void => {
        memoryStore[key] = value;
      },
      removeItem: (key: string): void => {
        delete memoryStore[key];
      },
      clear: (): void => {
        for (const key in memoryStore) {
          if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
            delete memoryStore[key];
          }
        }
      },
      key: (index: number): string | null => {
        const keys = Object.keys(memoryStore);
        return keys[index] || null;
      },
      get length(): number {
        return Object.keys(memoryStore).length;
      },
    };
