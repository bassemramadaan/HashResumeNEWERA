import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "ar" | "fr";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
}

const getInitialLang = (): Language => {
  try {
    const stored = localStorage.getItem("language-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.language || "en";
    }
  } catch (e) {
    // console.error('Error reading language from LS', e);
  }
  return "en";
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
    }
  )
);
