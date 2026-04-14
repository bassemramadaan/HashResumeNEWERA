import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../utils";

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export default function ThemeToggle({ className, size = 18 }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
        "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
        "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
        "border border-slate-200 dark:border-slate-700 shadow-sm",
        className
      )}
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 360 : 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {theme === "light" ? (
          <Sun size={size} strokeWidth={2.5} />
        ) : (
          <Moon size={size} strokeWidth={2.5} />
        )}
      </motion.div>
    </button>
  );
}
