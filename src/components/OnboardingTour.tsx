import React, { useEffect, useState } from 'react';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, User, Briefcase, Star, Eye, Download, Sparkles, Target } from 'lucide-react';
import { cn } from '../utils/utils';

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
    title: 'Start with Profile',
    content: 'Enter your personal details and contact info. This is the first thing recruiters see.',
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
    target: '[data-tour="education-skills-section"]',
    title: 'Education & Skills',
    content: 'Add your academic background and technical skills. Tailor these to the job description.',
    placement: 'right',
    icon: Star,
  },
  {
    target: '[data-tour="review-section"]',
    title: 'Review & Export',
    content: 'Check your ATS score, optimize your content, and download your professional resume.',
    placement: 'right',
    icon: Target,
  },
  {
    target: '[data-tour="preview-pane"]',
    title: 'Live Preview',
    content: 'See your resume update in real-time as you type. You can also change templates here.',
    placement: 'left',
    icon: Eye,
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

      if (element instanceof HTMLElement) {
        // Ensure element is visible (not hidden by display: none)
        if (element.offsetParent === null) {
          // If the element is hidden (e.g. mobile preview not open), try to find it again
          // but don't loop infinitely if it's truly gone
          return;
        }

        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Calculate tooltip position
        let top = 0;
        let left = 0;
        const tooltipWidth = 360; 
        const tooltipHeight = 280; 
        const gap = 20;

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

        // Keep within viewport with safe margins
        const margin = 20;
        if (left < margin) left = margin;
        if (left + tooltipWidth > window.innerWidth - margin) left = window.innerWidth - tooltipWidth - margin;
        if (top < margin) top = margin;
        if (top + tooltipHeight > window.innerHeight - margin) top = window.innerHeight - tooltipHeight - margin;

        setPosition({ top, left });
        
        // Scroll into view with better options
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      } else {
        setTargetRect(null);
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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-all duration-300 overflow-hidden" 
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
            >
              {/* Background Ambient Graphics */}
              <motion.div 
                className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-orange-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
                animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-red-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
                animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            </div>
            {/* Highlight border */}
            <motion.div 
              className="absolute border-2 border-[#f16529] dark:border-orange-400 rounded-xl shadow-[0_0_20px_rgba(241,101,41,0.4)] dark:shadow-[0_0_20px_rgba(251,146,60,0.4)]"
              initial={false}
              animate={{
                top: targetRect.top - 6,
                left: targetRect.left - 6,
                width: targetRect.width + 12,
                height: targetRect.height + 12,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#f16529] rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#f16529] rounded-full"></div>
            </motion.div>
          </div>

          {/* Tooltip */}
          <motion.div
            className="fixed z-50 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 w-[360px] max-w-[calc(100vw-40px)] transition-colors overflow-hidden"
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
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Abstract Graphic */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20 dark:opacity-10 pointer-events-none"
            >
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L100 50L50 100L0 50L50 0Z" stroke="url(#paint0_linear_onboarding)" strokeWidth="2" strokeDasharray="4 4"/>
                <defs>
                  <linearGradient id="paint0_linear_onboarding" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f16529" />
                    <stop offset="1" stopColor="#e44d26" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -10, 0], x: [0, 10, 0] }} 
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 -mb-4 -ml-4 opacity-20 dark:opacity-10 pointer-events-none"
            >
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="url(#paint1_linear_onboarding)" strokeWidth="2" strokeDasharray="4 4"/>
                <defs>
                  <linearGradient id="paint1_linear_onboarding" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f59e0b" />
                    <stop offset="1" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <div className="relative z-10">
              {/* Arrow Pointer */}
              <div 
                className={cn(
                  "absolute w-4 h-4 bg-white dark:bg-slate-900 rotate-45 border border-slate-100 dark:border-slate-800 -z-10",
                  step.placement === 'top' && "bottom-[-8px] left-1/2 -translate-x-1/2 border-t-0 border-l-0",
                  step.placement === 'bottom' && "top-[-8px] left-1/2 -translate-x-1/2 border-b-0 border-r-0",
                  step.placement === 'left' && "right-[-8px] top-1/2 -translate-y-1/2 border-b-0 border-l-0",
                  step.placement === 'right' && "left-[-8px] top-1/2 -translate-y-1/2 border-t-0 border-r-0"
                )}
              />
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 flex items-center justify-center text-[#f16529] dark:text-orange-400 shadow-inner border border-orange-200/50 dark:border-orange-700/50">
                    <motion.div
                      key={currentStep}
                      initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <StepIcon size={20} strokeWidth={2.5} />
                    </motion.div>
                    <div className="absolute inset-0 bg-[#f16529] opacity-20 blur-md rounded-xl"></div>
                  </div>
                  <span className="text-xs font-bold text-[#f16529] dark:text-orange-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} />
                    Step {currentStep + 1} of {STEPS.length}
                  </span>
                </div>
                <button onClick={skipOnboarding} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X size={16} />
                </button>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 font-display tracking-tight">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">{step.content}</p>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
                <motion.div 
                  className="h-full bg-[#f16529] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="flex justify-between items-center">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`text-sm font-bold flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full ${currentStep === 0 ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-400 hover:text-[#f16529] dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30'}`}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                
                <button 
                  onClick={isLastStep ? stopOnboarding : nextStep}
                  className="bg-[#f16529] hover:bg-[#e44d26] text-white px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 shadow-lg shadow-[#f16529]/20 hover:shadow-[#f16529]/40 hover:-translate-y-0.5 active:scale-95 group"
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
