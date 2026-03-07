import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function LanguageSwitcher({ className, size = 20 }: { className?: string; size?: number }) {
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageSwitch = () => {
    if (language === 'en') setLanguage('ar');
    else if (language === 'ar') setLanguage('fr');
    else setLanguage('en');
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
        "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
        "text-slate-500 hover:text-[#f16529] dark:text-slate-400 dark:hover:text-orange-400",
        "hover:bg-orange-50 dark:hover:bg-orange-900/20",
        "border border-transparent hover:border-orange-200 dark:hover:border-orange-800/50",
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
      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[9px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
        {language.toUpperCase()}
      </span>
    </button>
  );
}
