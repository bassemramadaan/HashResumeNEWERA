import React from "react";
import { Users2, Target, Briefcase, ShieldCheck } from "lucide-react";

interface StatsSectionProps {
  language: string;
}

export function StatsSection({ language }: StatsSectionProps) {
  const isAr = language === "ar";
  const isFr = language === "fr";

  const stats = [
    { 
      num: "480+", 
      label: isAr ? "باحث عن عمل تم تمكينه" : isFr ? "Candidats placés" : "Candidates matched", 
      icon: Users2 
    },
    { 
      num: "35+", 
      label: isAr ? "شركة شريكة نشطة" : isFr ? "Entreprises partenaires" : "Active partner companies", 
      icon: Target 
    },
    { 
      num: "40+", 
      label: isAr ? "وظيفة شاغرة مباشرة" : isFr ? "Postes actifs" : "Active job roles", 
      icon: Briefcase 
    }
  ];

  const trustText = isAr
    ? "إحصاءات توظيف حقيقية وموثوقة من واقع منصتنا وشبكة شركائنا المباشرة"
    : isFr
      ? "Statistiques réelles et synchronisées avec notre réseau de partenaires"
      : "Real-time verified placements and active job feeds synchronized daily";

  const partnersTitle = isAr ? "شراكات توظيف موثوقة مع" : "Trusted by recruiters at";

  return (
    <section className="py-16 bg-[#FAFAF6] border-y border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-center gap-5 shadow-xs hover:border-slate-300 transition-colors"
                id={`stat-card-${i}`}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-600/5 text-brand-600 flex items-center justify-center shrink-0">
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

        {/* Brand Partner Ribbon for Visual Social Proof */}
        <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">
            {partnersTitle}
          </span>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-50 grayscale hover:opacity-75 transition-opacity">
            {["TechNova", "CreativeSolutions", "DataSystems", "GrowthHackers", "InnovateEG"].map((brand, bIdx) => (
              <span 
                key={bIdx} 
                className="text-xs sm:text-sm font-black text-slate-600 tracking-wider font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/40"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Trust Verification Badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>{trustText}</span>
        </div>
      </div>
    </section>
  );
}
