import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils";

interface SectionTooltipProps {
  title: string;
  content: string;
  example?: string;
  className?: string;
}

export default function SectionTooltip({
  title,
  content,
  example,
  className,
}: SectionTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-400 hover:text-indigo-500 transition-colors p-1"
        title="Click for tips"
      >
        <HelpCircle size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute start-0 bottom-full mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-[70] pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle size={14} className="text-indigo-500" />
                  {title}
                </h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 :text-slate-300"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {content}
              </p>

              {example && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
                    Example
                  </span>
                  <p className="text-[11px] text-slate-700 italic leading-relaxed">
                    "{example}"
                  </p>
                </div>
              )}

              {/* Arrow */}
              <div className="absolute start-4 top-full w-4 h-4 bg-white border-e border-b border-slate-200 rotate-45 -translate-y-1.5" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
