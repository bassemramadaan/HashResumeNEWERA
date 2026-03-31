import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Bookmark,
  X,
  Sparkles,
  Clock,
  Banknote,
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { useApplicationStore } from "../store/useApplicationStore";
import { translations } from "../i18n/translations";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { cn } from "../utils";
import { mockJobs, Job } from "../data/jobs";

const JobCard = React.forwardRef<
  HTMLDivElement,
  {
    job: Job;
    isSaved: boolean;
    onToggleSave: () => void;
    onOpenDetails: () => void;
    onApply: () => void;
    t: { [key: string]: string };
  }
>(({ job, isSaved, onToggleSave, onOpenDetails, onApply, t }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-300 transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden"
      onClick={onOpenDetails}
    >
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"></div>

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xl overflow-hidden shrink-0 border border-slate-100 group-hover:border-indigo-100 transition-colors">
            {job.logo ? (
              <img
                src={job.logo}
                alt={job.company}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              job.company.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {job.company}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className={cn(
            "p-2 rounded-xl border transition-all duration-300",
            isSaved
              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "bg-white border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50",
          )}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5 relative z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-bold border border-slate-100">
          <MapPin size={12} className="text-slate-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
          <Briefcase size={12} className="text-indigo-400" />
          {job.type}
        </div>
      </div>

      {job.description && (
        <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed flex-grow relative z-10">
          {job.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
            {t.jobCode}
          </span>
          <span className="font-mono text-indigo-600 font-bold text-xs">
            {job.code || "N/A"}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-sm active:scale-95"
        >
          {t.applyNow}
        </button>
      </div>
    </motion.div>
  );
});

const JobDetailsModal: React.FC<{
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  t: { [key: string]: string };
}> = ({ job, isOpen, onClose, isSaved, onToggleSave, t }) => {
  const applyUrl = "https://forms.gle/h1UNQfD55dc2o8wM6";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
          >
            <div className="absolute top-6 end-6 z-20 flex gap-2">
              <button
                onClick={onToggleSave}
                className={cn(
                  "p-2.5 rounded-xl border transition-all duration-300 active:scale-90 bg-white shadow-sm",
                  isSaved
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50",
                )}
              >
                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 mb-12">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 font-bold text-4xl border border-slate-100 shadow-sm shrink-0 overflow-hidden group">
                  {job.logo ? (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    job.company.charAt(0)
                  )}
                </div>
                <div className="flex-1 text-center sm:text-start">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold mb-6 border border-indigo-100 uppercase tracking-widest">
                    <Sparkles size={12} />
                    {job.type}
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 text-slate-500 font-semibold text-sm">
                    <span className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Building2 size={16} className="text-slate-400" />
                      </div>
                      {job.company}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <MapPin size={16} className="text-slate-400" />
                      </div>
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                {[
                  {
                    label: t.salaryRange,
                    value: job.salary || "Competitive",
                    icon: Banknote,
                    color: "text-emerald-500",
                  },
                  {
                    label: t.posted,
                    value: job.postedAt || "Recently",
                    icon: Clock,
                    color: "text-blue-500",
                  },
                  { 
                    label: t.jobType, 
                    value: job.type, 
                    icon: Briefcase,
                    color: "text-purple-500",
                  },
                  {
                    label: t.jobCode,
                    value: job.code || "N/A",
                    icon: Search,
                    color: "text-indigo-500",
                    isMono: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={14} className={item.color} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-slate-900 font-bold text-sm",
                        item.isMono && "font-mono text-indigo-600",
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-12">
                <div className="prose prose-slate max-w-none">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                    {t.jobDescription}
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                    {t.requirements}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "3+ years of experience in the field",
                      "Strong problem-solving skills",
                      "Excellent communication and teamwork",
                      "Ability to work in a fast-paced environment",
                      "Proficiency in modern tech stacks",
                      "Strong analytical thinking",
                    ].map((req, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 text-slate-600 text-sm font-medium shadow-sm hover:border-indigo-100 transition-colors"
                      >
                        <CheckCircle2
                          size={18}
                          className="text-indigo-500 shrink-0 mt-0.5"
                        />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="text-center sm:text-start">
                <p className="text-lg text-slate-900 font-bold mb-1">
                  {t.readyToTakeNextStep}
                </p>
                <p className="text-sm text-slate-500">
                  {t.mentionCode}{" "}
                  <span className="font-mono font-bold text-indigo-600">
                    {job.code}
                  </span>{" "}
                  {t.inYourApplication}
                </p>
              </div>
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 text-white hover:bg-indigo-600 px-10 py-4 rounded-2xl text-base font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 group"
              >
                {t.applyNow}
                <ExternalLink
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function HashHuntPage() {
  const { language, dir } = useLanguageStore();
  const { addApplication } = useApplicationStore();
  const t = translations[language].hashHunt;
  const [jobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedJobs");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const newSaved = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem("savedJobs", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // No longer need to fetch from API in pure frontend version
  useEffect(() => {
    // We could still simulate a fetch if we wanted, but for now we just use mockJobs
    setLoading(false);
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "All" || job.type === selectedType;
      const matchesSaved = !showSavedOnly || savedJobIds.includes(job.jobId);

      return matchesSearch && matchesType && matchesSaved;
    });
  }, [jobs, searchQuery, selectedType, showSavedOnly, savedJobIds]);

  const jobTypes = [
    { value: "All", label: t.allLocations || "All" },
    { value: "Full-time", label: t.fullTime || "Full-time" },
    { value: "Part-time", label: t.partTime || "Part-time" },
    { value: "Remote", label: t.remote || "Remote" },
    { value: "Contract", label: t.contract || "Contract" },
    { value: "Hybrid", label: t.hybrid || "Hybrid" },
    { value: "On-site", label: t.onSite || "On-site" },
  ];

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900 :bg-indigo-900 :text-indigo-100 transition-colors duration-300"
      dir={dir}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#e0e7ff_0%,transparent_50%)]"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-8 border border-indigo-100"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles size={12} />
        {t.heroBadge}
      </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-8 leading-[0.9] max-w-4xl"
            >
              {t.heroTitlePart1} <br />
              <span className="text-indigo-600 italic font-serif">
                {t.heroTitlePart2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-medium"
            >
              {t.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-2xl shadow-indigo-100 border border-slate-200 flex flex-col md:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-12 pe-4 py-4 bg-transparent border-none rounded-xl focus:ring-0 text-slate-900 font-medium text-sm placeholder:text-slate-300"
                />
              </div>
              <div className="flex items-center gap-1 w-full md:w-auto p-1 bg-slate-50 rounded-xl">
                {jobTypes.slice(0, 4).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                      selectedType === type.value
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600",
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.1]">
                {t.whyJoinTitle}
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map(
                  (benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
                        <CheckCircle2 size={20} />
                      </div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {benefit}
                      </p>
                    </motion.div>
                  ),
                )}
              </div>
              <div className="mt-12">
                <a
                  href="https://forms.gle/5kEp1zSjMz3f4HyJ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-slate-900 text-white hover:bg-indigo-600 px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-lg active:scale-95 group"
                >
                  {t.joinTalentPool}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-100 rounded-[2.5rem] -rotate-2"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                alt="Team collaboration"
                className="relative rounded-[2rem] shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Grid Section */}
      <section className="py-24 bg-white min-h-[800px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 border border-slate-200">
                <Briefcase size={12} />
                {loading
                  ? t.loadingJobs
                  : `${filteredJobs.length} ${t.jobsFound}`}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[0.9]">
                {t.latestOpportunities}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all font-bold uppercase tracking-widest text-[10px]",
                  showSavedOnly
                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600",
                )}
              >
                <Bookmark
                  size={14}
                  fill={showSavedOnly ? "currentColor" : "none"}
                />
                {t.savedOnly} ({savedJobIds.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse h-[380px] flex flex-col"
                >
                  <div className="flex gap-4 mb-8">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl"></div>
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-5 bg-slate-50 rounded-full w-4/5"></div>
                      <div className="h-3 bg-slate-50 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    <div className="h-3 bg-slate-50 rounded-full w-full"></div>
                    <div className="h-3 bg-slate-50 rounded-full w-4/5"></div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="h-4 w-20 bg-slate-50 rounded-full"></div>
                    <div className="h-10 w-28 bg-slate-50 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-slate-100">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                <X size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{error}</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Something went wrong while fetching the latest jobs. Please try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all active:scale-95"
              >
                {t.tryRefreshing}
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-slate-100">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 border border-slate-100">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t.noJobsFound}</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setShowSavedOnly(false);
                }}
                className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] hover:text-indigo-700 underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.jobId}
                    job={job}
                    isSaved={savedJobIds.includes(job.jobId)}
                    onToggleSave={() => toggleSaveJob(job.jobId)}
                    onOpenDetails={() => setSelectedJob(job)}
                    onApply={() => {
                      addApplication({
                        jobId: job.jobId,
                        jobTitle: job.title,
                        company: job.company,
                        status: "Applied",
                      });
                      window.open("https://forms.gle/h1UNQfD55dc2o8wM6", "_blank", "noopener,noreferrer");
                    }}
                    t={t}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            isSaved={savedJobIds.includes(selectedJob.jobId)}
            onToggleSave={() => toggleSaveJob(selectedJob.jobId)}
            t={t}
          />
        )}
      </section>

      {/* How it works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-[1.1]">
                {t.howItWorksTitle}
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                {t.howItWorksSubtitle}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-1 bg-indigo-600 rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Briefcase,
                title: t.step1Title,
                desc: t.step1Desc,
              },
              {
                icon: Search,
                title: t.step2Title,
                desc: t.step2Desc,
              },
              {
                icon: Building2,
                title: t.step3Title,
                desc: t.step3Desc,
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -start-4 -top-4 text-8xl font-black text-slate-100 group-hover:text-indigo-50 transition-colors duration-500 select-none">
                  0{i + 1}
                </div>
                <div className="relative pt-8">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-200 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
