import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { cn } from '../utils';
import { motion } from 'framer-motion';

export default function LanguageSwitcher({ className, size = 16 }: { className?: string; size?: number }) {
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageSwitch = () => {
    if (language === 'en') setLanguage('ar');
    else if (language === 'ar') setLanguage('fr');
    else setLanguage('en');
  };

  const getLabel = () => {
    if (language === 'en') return 'العربية';
    if (language === 'ar') return 'Français';
    return 'English';
  };

  const getTitle = () => {
    if (language === 'en') return 'Switch to Arabic';
    if (language === 'ar') return 'Switch to French';
    return 'Switch to English';
  };

  return (
    <button
      onClick={handleLanguageSwitch}
      className={cn(
        "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300",
        "bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-900/20",
        "text-slate-700 dark:text-slate-200 hover:text-[#f16529] dark:hover:text-orange-400",
        "border border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800/50 shadow-sm",
        "text-sm font-medium",
        className
      )}
      title={getTitle()}
    >
      <motion.div
        whileHover={{ rotate: 15, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Globe size={size} strokeWidth={2} />
      </motion.div>
      <span className="font-bold tracking-wide">
        {getLabel()}
      </span>
    </button>
  );
}
