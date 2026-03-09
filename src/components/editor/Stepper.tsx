import React from 'react';
import { cn } from '../../lib/utils';

interface StepperProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Stepper({ tabs, activeTab, onTabChange }: StepperProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-200/50 dark:border-slate-700/50">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isCompleted = tabs.findIndex(t => t.id === activeTab) > index;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
              isActive 
                ? "bg-indigo-600 text-white" 
                : isCompleted 
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px]", isActive ? "bg-white text-indigo-600" : "bg-slate-200 dark:bg-slate-700")}>
              {index + 1}
            </span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
