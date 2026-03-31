import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { cn } from "../utils";

interface LanguageSwitcherProps {
  className?: string;
  size?: number;
  variant?: "default" | "ghost";
}

export default function LanguageSwitcher({
  className,
  size = 16,
  variant = "default",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageSwitch = () => {
    if (language === "en") setLanguage("ar");
    else if (language === "ar") setLanguage("fr");
    else setLanguage("en");
  };

  const getLabel = () => {
    if (language === "en") return "العربية";
    if (language === "ar") return "Français";
    return "English";
  };

  const getTitle = () => {
    if (language === "en") return "Switch to Arabic";
    if (language === "ar") return "Switch to French";
    return "Switch to English";
  };

  return (
    <button
      onClick={handleLanguageSwitch}
      className={cn(
        "flex items-center gap-2 px-4 sm:px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium",
        variant === "default" && [
          "bg-white hover:bg-orange-50 :bg-orange-900/20",
          "text-slate-700 hover:text-[#ff4d2d] :text-orange-400",
          "border border-slate-200 hover:border-orange-200 :border-orange-800/50 shadow-sm",
        ],
        variant === "ghost" && [
          "bg-transparent hover:bg-slate-800",
          "text-slate-400 hover:text-white",
          "border border-transparent",
        ],
        className,
      )}
      title={getTitle()}
    >
      <motion.div
        animate={{ rotate: language === "ar" ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex items-center"
      >
        <Globe size={size} strokeWidth={2} />
      </motion.div>
      <span className="font-bold tracking-wide">{getLabel()}</span>
    </button>
  );
}
