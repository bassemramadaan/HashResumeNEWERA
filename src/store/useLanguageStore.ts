import { create } from "zustand";

type Language = "en" | "ar" | "fr";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  dir: "ltr",
  setLanguage: (lang) => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    set({ language: lang, dir });
  },
}));
