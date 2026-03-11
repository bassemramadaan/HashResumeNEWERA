import React from 'react';
import { cn } from '../../utils/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Stepper({ tabs, activeTab, onTabChange }: StepperProps) {
  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-6">
      <div className="relative flex items-center justify-between">
        {/* Progress Line Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-slate-200 dark:bg-slate-800 z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-indigo-600 transition-all duration-500 z-0" 
          style={{ width: `${(activeIndex / (tabs.length - 1)) * 100}%` }}
        />

        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCompleted = activeIndex > index;
          
          return (
            <div key={tab.id} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isActive 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110" 
                    : isCompleted 
                      ? "bg-white dark:bg-slate-900 border-indigo-600 text-indigo-600"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <span className="text-sm font-black">{index + 1}</span>
                )}
              </button>
              <span className={cn(
                "absolute -bottom-5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              )}>
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
