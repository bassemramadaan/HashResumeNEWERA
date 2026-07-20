import React from "react";
import { Users2, Target, Briefcase, Info } from "lucide-react";

interface StatsSectionProps {
  language: string;
}

export function StatsSection({ language }: StatsSectionProps) {
  const isAr = language === "ar";
  const isFr = language === "fr";

  const stats = [
    { 
      num: "2,400+", 
      label: isAr ? "مترشح تم توظيفه" : isFr ? "Candidats placés" : "Candidates placed", 
      icon: Users2 
    },
    { 
      num: "85+", 
      label: isAr ? "شركة شريكة" : isFr ? "Entreprises partenaires" : "Partner companies", 
      icon: Target 
    },
    { 
      num: "120+", 
      label: isAr ? "وظيفة شاغرة" : isFr ? "Postes actifs" : "Active job roles", 
      icon: Briefcase 
    }
  ];

  const disclaimerText = isAr
    ? "• الأرقام الموضحة أعلاه هي أرقام توضيحية لبيان حجم الشبكة والنشاط."
    : isFr
      ? "• Les chiffres ci-dessus sont présentés à titre indicatif pour illustrer la portée de notre réseau."
      : "• The figures shown above are illustrative numbers representing our active recruitment talent loop.";

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center gap-5 shadow-xs hover:border-slate-300 transition-colors"
                id={`stat-card-${i}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#001639]/5 text-[#001639] flex items-center justify-center shrink-0">
                  <Icon size={24} className="stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {stat.num}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-500">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
          <Info size={12} className="text-slate-300" />
          <span>{disclaimerText}</span>
        </div>
      </div>
    </section>
  );
}
