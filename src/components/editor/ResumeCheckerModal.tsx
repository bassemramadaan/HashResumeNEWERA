import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { cn } from '../../lib/utils';

interface ResumeCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
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
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-100 dark:text-slate-700"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251}
                      strokeDashoffset={251 - (251 * score) / 100}
                      className={cn(
                        "transition-all duration-1000 ease-out",
                        score >= 80 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-rose-500"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white">
                    {score}%
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
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Keep Editing
              </button>
              <button 
                onClick={onProceed}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 transition-colors shadow-sm",
                  criticalFailures.length > 0 
                    ? "bg-rose-600 hover:bg-rose-700" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                )}
              >
                {criticalFailures.length > 0 ? 'Ignore & Export' : 'Continue to Export'}
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
