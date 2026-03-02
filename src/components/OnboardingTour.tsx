import React, { useEffect, useState, useRef } from 'react';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface Step {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: Step[] = [
  {
    target: '[data-tour="personal-info"]',
    title: 'Start with Basics',
    content: 'Enter your personal details here. Make sure your contact info is accurate so recruiters can reach you.',
    placement: 'right',
  },
  {
    target: '[data-tour="experience-section"]',
    title: 'Add Experience',
    content: 'List your work history. Use strong action verbs and quantify your achievements.',
    placement: 'right',
  },
  {
    target: '[data-tour="skills-section"]',
    title: 'Showcase Skills',
    content: 'Add relevant skills. Tailor these to the job description for better ATS ranking.',
    placement: 'right',
  },
  {
    target: '[data-tour="preview-pane"]',
    title: 'Live Preview',
    content: 'See your resume update in real-time as you type. You can also change templates here.',
    placement: 'left',
  },
  {
    target: '[data-tour="export-button"]',
    title: 'Download PDF',
    content: 'Once you are happy, download your resume as a PDF. It is free and ATS-friendly.',
    placement: 'bottom',
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
        const tooltipWidth = 320; // Approximate width
        const tooltipHeight = 200; // Approximate height
        const gap = 12;

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
      } else {
        // If element not found, skip to next step or stop if last
        if (currentStep < STEPS.length - 1) {
            // nextStep(); // Potential infinite loop if no elements found, better to just log or stop
        }
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

  return (
    <AnimatePresence>
      {isActive && targetRect && (
        <>
          {/* Overlay with hole */}
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute inset-0 bg-black/50 transition-all duration-300" 
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
              className="absolute border-2 border-indigo-500 rounded-lg shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
              initial={false}
              animate={{
                top: targetRect.top - 4,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Tooltip */}
          <motion.div
            className="fixed z-50 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-80 max-w-[90vw]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              top: position.top,
              left: position.left
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <button onClick={skipOnboarding} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">{step.content}</p>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`text-sm font-medium flex items-center gap-1 ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                <ChevronLeft size={16} />
                Back
              </button>
              
              <button 
                onClick={isLastStep ? stopOnboarding : nextStep}
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight size={16} />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
