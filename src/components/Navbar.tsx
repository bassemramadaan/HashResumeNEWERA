import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Target, ArrowRight, Menu, X, Sparkles, Sun, Moon } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguageStore } from "../store/useLanguageStore";
import { useThemeStore } from "../store/useThemeStore";
import { translations } from "../i18n/translations";
import { cn } from "../utils";

export default function Navbar() {
  const { language } = useLanguageStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const t = translations[language];
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const navLinks = [
    { name: t.landing.templates || "Templates", path: "/templates" },
    {
      name: t.landing.coverLetter || "Cover Letter",
      path: "/cover-letter",
      icon: <PenTool size={14} />,
    },
    { name: t.landing.blog || "Blog", path: "/blog" },
    {
      name: t.landing.hashHuntJobs || "Hash Hunt",
      path: "/hash-hunt",
      icon: <Target size={18} className="text-accent-500" />,
      highlight: true,
    },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 start-0 end-0 z-50 transition-all duration-500",
        isScrolled ? "py-4" : "py-6",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2 rounded-2xl transition-all duration-500",
            isScrolled
              ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-slate-200/20 dark:shadow-black/20 border border-white/20 dark:border-slate-800/20"
              : "bg-transparent",
          )}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl shadow-lg shadow-accent-500/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Hash<span className="text-accent-500">Resume</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 text-sm font-bold rounded-full transition-all flex items-center gap-2 relative group",
                  location.pathname === link.path
                    ? "text-white bg-accent-500 shadow-md"
                    : link.highlight
                      ? "text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 shadow-sm shadow-transparent hover:shadow-slate-200/50 dark:hover:shadow-black/50",
                )}
              >
                {link.icon}
                {link.name}
                {link.highlight && !location.pathname.includes(link.path) && (
                  <span className="absolute -top-1 -end-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <LanguageSwitcher
                size={18}
                className="text-xs px-4 py-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors"
              />
            </div>

            <Link
              to="/editor"
              className="flex items-center gap-2 bg-slate-900 dark:bg-accent-500 text-white hover:bg-accent-500 dark:hover:bg-accent-600 font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all group"
            >
              <Sparkles
                size={16}
                className="text-accent-400 group-hover:text-white transition-colors"
              />
              <span className="text-sm tracking-tight">
                {t.landing.buildResume || "Build Resume"}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all active:scale-90"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-full start-4 end-4 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-6 py-4 text-base font-bold rounded-2xl transition-all flex items-center justify-between group",
                      location.pathname === link.path
                        ? "text-white bg-accent-500"
                        : link.highlight
                          ? "text-accent-500 bg-accent-50 dark:bg-accent-900/20"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {link.icon}
                      {link.name}
                    </div>
                    <ArrowRight
                      size={18}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-all rtl:rotate-180",
                        location.pathname === link.path && "opacity-100",
                      )}
                    />
                  </Link>
                </motion.div>
              ))}

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>

              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-sm font-bold text-slate-500">
                  Language
                </span>
                <LanguageSwitcher size={18} className="text-sm" />
              </div>

              <Link
                to="/editor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-4 bg-slate-900 dark:bg-accent-500 text-white font-bold py-4 px-6 rounded-2xl text-center shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
              >
                <Sparkles size={18} className="text-accent-400" />
                {t.landing.buildResume || "Build Resume"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
