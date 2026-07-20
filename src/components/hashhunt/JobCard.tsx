import React from "react";
import { motion } from "motion/react";
import { ExternalLink, Briefcase, MapPin } from "lucide-react";
import { Job } from "../../data/jobs";

interface JobCardProps {
  job: Job;
  language: string;
  onApply: (title: string) => void;
}

export function JobCard({ job, language, onApply }: JobCardProps) {
  const isAr = language === "ar";
  const isFr = language === "fr";

  const deptText = isAr ? (job.arabicTitle || job.title) : job.title;
  const locationText = isAr 
    ? (job.location?.includes("Cairo") ? "القاهرة، مصر" : job.location) 
    : job.location;
  
  const expLabel = isAr ? "الخبرة:" : isFr ? "Expérience:" : "Experience:";
  const expValue = isAr 
    ? (job.exp?.replace("Years", "سنوات")?.replace("Year", "سنة") || "غير محدد")
    : job.exp || "Not specified";

  const applyText = isAr ? "قدّم الآن عبر وظائف هاش" : isFr ? "Postuler via Hash Hunt" : "Apply Via Hash Hunt";
  const viewOfficialText = isAr ? "عرض الإعلان الرسمي للمسافر" : isFr ? "Voir l'annonce officielle" : "View Official Almosafer Post";

  // Safeguard: make sure bullets exist
  const bullets = job.bullets || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#001639]/20 hover:shadow-xl hover:shadow-slate-100/60 transition-all duration-300"
      id={`job-card-${job.jobId}`}
    >
      <div>
        {/* Header/Company Row */}
        <div className="flex items-center gap-4 mb-5">
          <img 
            src={job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=001639&color=fff`} 
            alt={job.company} 
            className="w-11 h-11 rounded-xl object-contain border border-slate-150 p-1 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <h4 className="font-extrabold text-[#001639] text-xs sm:text-sm tracking-wide uppercase">
              {job.company}
            </h4>
            <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug truncate">
              {deptText}
            </h3>
          </div>
        </div>

        {/* Badges Info */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px] font-bold">
            <Briefcase size={12} className="text-slate-400 shrink-0" />
            <span>{job.dept || job.type}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 text-[11px] font-bold">
            <MapPin size={12} className="text-slate-400 shrink-0" />
            <span>{locationText}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-850 text-[11px] font-bold">
            <span className="text-emerald-400 font-extrabold shrink-0">•</span>
            <span>{expLabel} {expValue}</span>
          </div>
        </div>

        {/* Bullets lists */}
        {bullets.length > 0 && (
          <div className="space-y-2 mb-6 bg-[#FAFAF6]/40 p-4 rounded-2xl border border-slate-100">
            {bullets.slice(0, 4).map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#001639] text-xs font-black select-none mt-0.5 shrink-0">›</span>
                <p className="text-xs text-slate-600 font-normal leading-relaxed select-text flex-1">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 mt-auto">
        <button
          onClick={() => onApply(job.title)}
          className="w-full bg-[#001639] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#001639]/15 active:scale-98 cursor-pointer"
        >
          <span>⚡</span>
          <span>{applyText}</span>
        </button>
        
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-200/60 cursor-pointer"
          >
            <span>{viewOfficialText}</span>
            <span className="text-[10px] text-slate-400 font-medium">(External)</span>
            <ExternalLink size={12} className="text-slate-450 shrink-0" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
