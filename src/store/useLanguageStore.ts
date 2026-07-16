import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "../utils/safeStorage";

type Language = "en" | "ar" | "fr";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
}

const getInitialLang = (): Language => {
  try {
    const stored = safeLocalStorage.getItem("language-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.language || "ar";
    }
  } catch {
    // console.error('Error reading language from LS');
  }
  return "ar";
};

const initialLang = getInitialLang();
const initialDir = initialLang === "ar" ? "rtl" : "ltr";
if (typeof document !== "undefined") {
  document.documentElement.dir = initialDir;
  document.documentElement.lang = initialLang;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: initialLang,
      dir: initialDir,
      setLanguage: (lang) => {
        const dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
        set({ language: lang, dir });
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);
