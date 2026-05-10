import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, ArrowRight, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t.landing.templates || "Templates", path: "/templates" },
    {
      name: t.landing.coverLetter || "Cover Letter",
      path: "/cover-letter",
    },
  ];

  const moreLinks = [
    {
      name: t.landing.hashHuntJobs || "Hash Hunt",
      path: "/hash-hunt",
      icon: <Target size={16} className="text-[#ff4d2d]" />,
    },
    { name: t.landing.blog || "Blog", path: "/blog" },
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
            "grid grid-cols-3 items-center px-4 py-2 rounded-2xl transition-all duration-500",
            isScrolled
              ? "bg-slate-50/80 backdrop-blur-xl shadow-lg shadow-slate-200/20 border border-slate-200/20"
              : "bg-transparent",
          )}
        >
          {/* Left Navigation (Desktop) */}
          <div className="flex items-center">
            <nav className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50 w-fit">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-1.5 text-sm font-semibold rounded-full transition-all flex items-center gap-2 relative group",
                    location.pathname === link.path
                      ? "text-white bg-[#ff4d2d] shadow-md"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm shadow-transparent hover:shadow-slate-200/50",
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* More Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsMoreOpen(true)}
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <button
                  className={cn(
                    "px-4 py-1.5 text-sm font-semibold rounded-full transition-all flex items-center gap-1 relative group text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm shadow-transparent hover:shadow-slate-200/50",
                    moreLinks.some(link => location.pathname === link.path) && "text-slate-900 bg-slate-50 shadow-slate-200/50"
                  )}
                >
                  {t.landing.more || "More"}
                  <ChevronDown size={14} className={cn("transition-transform duration-200", isMoreOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full start-0 mt-2 w-48 bg-slate-50 rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 z-50"
                    >
                      {moreLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={cn(
                            "px-4 py-3 text-sm font-bold transition-all flex items-center gap-3 hover:bg-slate-50",
                            location.pathname === link.path ? "text-[#ff4d2d] bg-orange-50/50" : "text-slate-600"
                          )}
                        >
                          {link.icon && <span className="text-slate-500">{link.icon}</span>}
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
            
            {/* Mobile Menu Toggle (Left side for balance when logo is centered) */}
            <div className="lg:hidden text-slate-900">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-slate-900 bg-slate-100 rounded-xl transition-all active:scale-90 flex items-center justify-center min-w-[40px] min-h-[40px]"
                  aria-label="Toggle Menu"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
          </div>

          {/* Logo (Centered) */}
          <div className="flex justify-center pl-4 md:pl-6">
            <Link to="/" className="flex items-center gap-1 flex-shrink-0 group">
              <Logo iconOnly width="auto" height={60} variant="gradient" />
            </Link>
          </div>

          {/* Actions (Right) */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50 ">
              <LanguageSwitcher
                size={18}
                className="text-xs px-4 py-1.5 hover:bg-slate-100 rounded-full transition-colors"
              />
            </div>

            <Link
              to="/editor"
              className="flex items-center gap-2 bg-gradient-to-b from-[#ff4d2d] to-orange-600 shadow-[0_8px_16px_-6px_rgba(255,77,45,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] text-white font-bold py-2 px-4 sm:px-6 rounded-full hover:scale-105 active:scale-95 transition-all group animate-[pulse_3s_infinite]"
            >
              <Sparkles
                size={16}
                className="text-white drop-shadow-sm group-hover:rotate-12 transition-transform hidden xs:block"
              />
              <span className="text-xs sm:text-sm tracking-tight font-black uppercase whitespace-nowrap">
                {t.startBuildingNow}
              </span>
            </Link>
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
            className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40"
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
            className="lg:hidden absolute top-full start-4 end-4 mt-2 bg-slate-50/95 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-end px-2 mb-2">
                <div className="flex items-center gap-2">
                  <LanguageSwitcher size={18} className="text-sm" />
                </div>
              </div>

              <div className="h-px bg-slate-200 my-2"></div>

              {[...navLinks, ...moreLinks].map((link, i) => (
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
                      "px-6 py-4 text-base font-semibold rounded-2xl transition-all flex items-center justify-between group",
                      location.pathname === link.path
                        ? "text-white bg-[#ff4d2d]"
                        : link.highlight
                          ? "text-[#ff4d2d] bg-orange-50"
                          : "text-slate-600 hover:bg-slate-50",
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

              <div className="h-px bg-slate-200 my-2"></div>

              <Link
                to="/editor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 bg-gradient-to-b from-[#ff4d2d] to-orange-600 shadow-[0_8px_16px_-6px_rgba(255,77,45,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] text-white font-bold py-4 px-6 rounded-2xl text-center active:scale-95 transition-all group"
              >
                <Sparkles size={18} className="text-white drop-shadow-sm group-hover:scale-110 transition-transform" />
                {t.startBuildingNow}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
