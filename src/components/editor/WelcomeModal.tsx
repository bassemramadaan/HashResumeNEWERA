import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, SkipForward } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

export default function WelcomeModal({ isOpen, onStartTour, onSkip }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onSkip}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-orange-500 to-amber-600 opacity-10 dark:opacity-20"></div>
          
          <div className="relative p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mx-auto mb-6 rotate-3">
              <Sparkles className="text-white w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 font-display">
              Welcome to Hash Resume!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Let's take a quick tour to help you build your perfect resume in minutes. We'll show you the key features and how to get the most out of our editor.
            </p>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={onStartTour}
                className="w-full bg-[#ff4d2d] hover:bg-[#e63e1d] text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
              >
                <Play size={18} fill="currentColor" />
                Start Quick Tour
              </button>
              
              <button
                onClick={onSkip}
                className="w-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <SkipForward size={18} />
                Skip for Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
