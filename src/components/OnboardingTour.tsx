import React, { useEffect, useState } from 'react';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, User, Briefcase, Star, Eye, Download, Sparkles } from 'lucide-react';

interface Step {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    target: '[data-tour="personal-info"]',
    title: 'Start with Basics',
    content: 'Enter your personal details here. Make sure your contact info is accurate so recruiters can reach you.',
    placement: 'right',
    icon: User,
  },
  {
    target: '[data-tour="experience-section"]',
    title: 'Add Experience',
    content: 'List your work history. Use strong action verbs and quantify your achievements.',
    placement: 'right',
    icon: Briefcase,
  },
  {
    target: '[data-tour="skills-section"]',
    title: 'Showcase Skills',
    content: 'Add relevant skills. Tailor these to the job description for better ATS ranking.',
    placement: 'right',
    icon: Star,
  },
  {
    target: '[data-tour="preview-pane"]',
    title: 'Live Preview',
    content: 'See your resume update in real-time as you type. You can also change templates here.',
    placement: 'left',
    icon: Eye,
  },
  {
    target: '[data-tour="export-button"]',
    title: 'Download PDF',
    content: 'Once you are happy, download your resume as a PDF. It is free and ATS-friendly.',
    placement: 'bottom',
    icon: Download,
  },
];

export default function OnboardingTour() {
  const { isActive, currentStep, nextStep, prevStep, skipOnboarding, stopOnboarding } = useOnboardingStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      const step = STEPS[currentStep];
      const element = document.querySelector(step.target);

      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Calculate tooltip position
        let top = 0;
        let left = 0;
        const tooltipWidth = 340; // Approximate width
        const tooltipHeight = 220; // Approximate height
        const gap = 16;

        switch (step.placement) {
          case 'top':
            top = rect.top - tooltipHeight - gap;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'bottom':
            top = rect.bottom + gap;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'left':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.left - tooltipWidth - gap;
            break;
          case 'right':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.right + gap;
            break;
          default: // bottom
            top = rect.bottom + gap;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        }

        // Keep within viewport
        if (left < 10) left = 10;
        if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;
        if (top < 10) top = 10;
        if (top + tooltipHeight > window.innerHeight - 10) top = window.innerHeight - tooltipHeight - 10;

        setPosition({ top, left });
        
        // Scroll into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStep]);

  if (!isActive) return null;

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const StepIcon = step.icon;

  return (
    <AnimatePresence>
      {isActive && targetRect && (
        <>
          {/* Overlay with hole */}
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-all duration-300" 
                 style={{
                   clipPath: `polygon(
                     0% 0%, 
                     0% 100%, 
                     100% 100%, 
                     100% 0%, 
                     0% 0%, 
                     ${targetRect.left}px ${targetRect.top}px, 
                     ${targetRect.right}px ${targetRect.top}px, 
                     ${targetRect.right}px ${targetRect.bottom}px, 
                     ${targetRect.left}px ${targetRect.bottom}px, 
                     ${targetRect.left}px ${targetRect.top}px
                   )`
                 }}
            />
            {/* Highlight border */}
            <motion.div 
              className="absolute border-2 border-indigo-500 dark:border-indigo-400 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] dark:shadow-[0_0_20px_rgba(129,140,248,0.4)]"
              initial={false}
              animate={{
                top: targetRect.top - 6,
                left: targetRect.left - 6,
                width: targetRect.width + 12,
                height: targetRect.height + 12,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full"></div>
            </motion.div>
          </div>

          {/* Tooltip */}
          <motion.div
            className="fixed z-50 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-80 max-w-[90vw] transition-colors overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              top: position.top,
              left: position.left
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <StepIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} />
                    Step {currentStep + 1} of {STEPS.length}
                  </span>
                </div>
                <button onClick={skipOnboarding} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X size={16} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">{step.content}</p>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`text-sm font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-md ${currentStep === 0 ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                
                <button 
                  onClick={isLastStep ? stopOnboarding : nextStep}
                  className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-95 group"
                >
                  {isLastStep ? 'Finish Tour' : 'Next Step'}
                  {!isLastStep && (
                    <div className="bg-white/20 rounded-full p-0.5 group-hover:translate-x-0.5 transition-transform ml-1">
                      <ChevronRight size={14} className="text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
