import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { cn } from '../../lib/utils';

interface ResumeCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (format: 'pdf' | 'docx' | 'txt') => void;
}

const ACTION_VERBS = new Set([
  'led', 'managed', 'developed', 'created', 'designed', 'implemented', 'improved', 'increased', 'decreased', 'saved',
  'achieved', 'launched', 'built', 'engineered', 'architected', 'coordinated', 'collaborated', 'mentored', 'trained',
  'analyzed', 'resolved', 'negotiated', 'presented', 'wrote', 'authored', 'published', 'researched', 'investigated',
  'optimized', 'streamlined', 'automated', 'transformed', 'expanded', 'generated', 'delivered', 'executed', 'planned'
]);

export default function ResumeCheckerModal({ isOpen, onClose, onProceed }: ResumeCheckerModalProps) {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills } = data;

  const checks = [
    {
      id: 'contact',
      title: 'Contact Information',
      passed: !!(personalInfo.email && personalInfo.phone && personalInfo.address),
      message: 'Add email, phone, and location.',
      severity: 'high'
    },
    {
      id: 'summary',
      title: 'Professional Summary',
      passed: !!(personalInfo.summary && personalInfo.summary.length > 50),
      message: 'Add a summary of at least 50 characters.',
      severity: 'medium'
    },
    {
      id: 'experience_bullets',
      title: 'Bullet Points',
      passed: experience.length > 0 && experience.every(exp => exp.description.includes('•') || exp.description.includes('-')),
      message: 'Use bullet points for all experience entries.',
      severity: 'high'
    },
    {
      id: 'action_verbs',
      title: 'Action Verbs',
      passed: experience.length > 0 && experience.some(exp => {
        const words = exp.description.toLowerCase().split(/\s+/);
        return words.some(w => ACTION_VERBS.has(w));
      }),
      message: 'Start bullet points with strong action verbs (e.g., Led, Developed).',
      severity: 'medium'
    },
    {
      id: 'skills',
      title: 'Skills Section',
      passed: skills.length >= 5,
      message: 'List at least 5 relevant skills.',
      severity: 'medium'
    },
    {
      id: 'education',
      title: 'Education',
      passed: education.length > 0,
      message: 'Include your educational background.',
      severity: 'high'
    }
  ];

  const failedChecks = checks.filter(c => !c.passed);
  const criticalFailures = failedChecks.filter(c => c.severity === 'high');
  const score = Math.round(((checks.length - failedChecks.length) / checks.length) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resume Check</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Review these items before exporting</p>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-center mb-10 mt-4">
                <div className="relative flex items-center justify-center">
                  {/* Glow Effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-full blur-3xl opacity-20 transform scale-75 transition-colors duration-500",
                    score >= 80 ? "bg-gradient-to-r from-indigo-500 to-cyan-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
                  )} />

                  <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90 drop-shadow-sm">
                      <defs>
                        <linearGradient id="modal-score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" className="text-indigo-600 dark:text-indigo-400" stopColor="currentColor" />
                          <stop offset="100%" className="text-cyan-600 dark:text-cyan-400" stopColor="currentColor" />
                        </linearGradient>
                      </defs>
                      {/* Background Track */}
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="currentColor"
                        className="text-slate-100 dark:text-slate-800/50 fill-white dark:fill-slate-800"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={score >= 80 ? "url(#modal-score-gradient)" : "currentColor"}
                        strokeWidth="16"
                        fill="transparent"
                        strokeDasharray={553} // 2 * pi * 88
                        strokeDashoffset={553 - (553 * score) / 100}
                        strokeLinecap="round"
                        className={cn(
                          "transition-all duration-1000 ease-out",
                          score < 80 ? (score >= 50 ? "text-amber-500" : "text-rose-500") : ""
                        )}
                      />
                    </svg>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn(
                        "text-5xl font-black tracking-tighter transition-colors duration-500",
                        score >= 80 ? "bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent" : score >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"
                      )}>
                        {score}%
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                        Resume Score
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {checks.map((check) => (
                  <div 
                    key={check.id} 
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border transition-colors",
                      check.passed 
                        ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30" 
                        : "bg-rose-50/50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 shrink-0",
                      check.passed ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {check.passed ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div>
                      <h4 className={cn(
                        "text-sm font-semibold",
                        check.passed ? "text-emerald-900 dark:text-emerald-100" : "text-rose-900 dark:text-rose-100"
                      )}>
                        {check.title}
                      </h4>
                      {!check.passed && (
                        <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                          {check.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Keep Editing
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">Export as:</span>
                <button 
                  onClick={() => onProceed('pdf')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2 transition-all shadow-sm",
                    criticalFailures.length > 0 
                      ? "bg-rose-600 hover:bg-rose-700" 
                      : "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  PDF
                </button>
                <button 
                  onClick={() => onProceed('docx')}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm"
                >
                  DOCX
                </button>
                <button 
                  onClick={() => onProceed('txt')}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm"
                >
                  TXT
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
