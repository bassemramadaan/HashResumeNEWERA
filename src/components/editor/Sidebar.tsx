import React from "react";
import { cn } from "../../utils";
import { useLanguageStore } from "../../store/useLanguageStore";
import { motion } from "framer-motion";

interface SidebarProps {
  tabs: {
    id: string;
    label: string;
    icon: React.ElementType;
    tourId?: string;
  }[];
  activeTab: string;
  onTabChange: (id: any) => void;
  progressPercent: number;
}

const Sidebar: React.FC<SidebarProps> = ({ tabs, activeTab, onTabChange, progressPercent }) => {
  const { language } = useLanguageStore();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 shrink-0 transition-all duration-300 overflow-hidden border-r border-white/5">
      <div className="p-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">
          {language === "ar" ? "أقسام السيرة الذاتية" : "Resume Sections"}
        </h2>
        
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                data-tour={tab.tourId}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-[#ff4d2d] text-white shadow-lg shadow-orange-600/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={18} className={cn("shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                <span className="truncate">{tab.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-y-0 start-0 w-1 bg-white rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>{language === "ar" ? "التقدم الإجمالي" : "Overall Progress"}</span>
            <span className={cn(progressPercent === 100 ? "text-emerald-500" : "text-[#ff4d2d]")}>
              {progressPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className={cn(
                "h-full transition-all duration-500",
                progressPercent === 100 ? "bg-emerald-500" : "bg-[#ff4d2d]"
              )}
            />
          </div>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
            {progressPercent < 100 
              ? (language === "ar" ? "أكمل الأقسام المتبقية للحصول على أفضل نتيجة ATS." : "Complete the remaining sections for the best ATS score.")
              : (language === "ar" ? "سيرتك الذاتية تبدو رائعة الآن!" : "Your resume looks great now!")
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
