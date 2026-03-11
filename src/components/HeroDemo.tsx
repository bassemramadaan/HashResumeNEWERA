import React from 'react';
import { motion } from 'framer-motion';

export default function HeroDemo() {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-12 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="bg-slate-100 dark:bg-slate-800 p-3 flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
      </div>
      <div className="p-8 h-80 flex items-center justify-center">
        {/* Placeholder for GIF/Demo */}
        <div className="text-center text-slate-500 dark:text-slate-400">
          <p className="font-bold text-2xl mb-2">Interactive Demo</p>
          <p>Resume building in seconds</p>
        </div>
      </div>
    </div>
  );
}
