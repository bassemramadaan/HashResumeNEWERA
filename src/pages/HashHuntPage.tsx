import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Bookmark,
  X,
  Sparkles,
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
    t: { [key: string]: string };
  }
>(({ job, isSaved, onToggleSave, onOpenDetails, t }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
      className="group relative bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_30px_60px_rgba(79,70,229,0.12)] hover:border-indigo-200 transition-all duration-700 flex flex-col h-full cursor-pointer overflow-hidden"
      onClick={onOpenDetails}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-transparent to-indigo-50/0 group-hover:from-indigo-50/40 group-hover:to-white transition-colors duration-700" />
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-100/30 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Logo & Save */}
        <div className="flex justify-between items-start mb-8">
          <div className="relative">
            <div className="absolute -inset-2 bg-indigo-100/50 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-sm">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-11 h-11 object-contain"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <span className="text-2xl font-black text-slate-300">{job.company.charAt(0)}</span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className={cn(
              "p-3 rounded-2xl transition-all duration-500 border backdrop-blur-sm",
              isSaved
                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-white/80 border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white"
            )}
          >
            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600 bg-indigo-50/80 px-3 py-1 rounded-lg border border-indigo-100/50">
              {job.type}
            </span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              {job.posted}
            </span>
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2 font-display">
            {job.title}
          </h3>
          <p className="text-slate-500 font-semibold mb-6 flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-indigo-400" />
            {job.company}
          </p>

          <div className="grid grid-cols-1 gap-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                <Banknote className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="font-mono font-bold text-slate-900">{job.salary}</span>
            </div>
          </div>
        </div>

        {/* Footer: Apply & Code */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">
              {t.jobCode}
            </span>
            <span className="text-sm font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
              {job.code}
            </span>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-sm group-hover:gap-3 transition-all">
            <span className="uppercase tracking-widest">{t.viewDetails}</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-white/20"
          >
            {/* Left Side: Main Info (Scrollable) */}
            <div className="flex-grow overflow-y-auto p-8 md:p-16 custom-scrollbar">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8 mb-16">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-indigo-100/50 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-24 h-24 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-xl">
                      {job.logo ? (
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-16 h-16 object-contain"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-4xl font-black text-slate-200">{job.company.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black tracking-[0.2em] uppercase shadow-lg shadow-indigo-200">
                        {job.type}
                      </span>
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-100 px-3 py-1.5 rounded-xl">
                        {t.posted} {job.posted}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight font-display">
                      {job.title}
                    </h2>
                    <p className="text-xl text-slate-500 font-bold mt-2 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-indigo-400" />
                      {job.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={onToggleSave}
                    className={cn(
                      "p-5 rounded-2xl transition-all duration-500 border shadow-sm",
                      isSaved
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-200"
                        : "bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600"
                    )}
                  >
                    <Bookmark
                      className={cn("w-6 h-6", isSaved && "fill-current")}
                    />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-5 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all border border-slate-200 shadow-sm active:scale-95"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-16">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-grow bg-slate-100" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                      {t.jobDescription}
                    </h3>
                    <div className="h-px flex-grow bg-slate-100" />
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xl font-medium font-serif italic">
                    {job.description}
                  </p>
                </section>

                <div className="grid lg:grid-cols-2 gap-16">
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 mb-8 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      {t.requirements}
                    </h3>
                    <ul className="space-y-5">
                      {[
                        "3+ years of experience in the field",
                        "Strong problem-solving skills",
                        "Excellent communication and teamwork",
                        "Ability to work in a fast-paced environment",
                        "Proficiency in modern tech stacks",
                        "Strong analytical thinking",
                      ].map((req, i) => (
                        <li key={i} className="flex items-start gap-4 text-slate-600 text-base font-bold">
                          <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={14} className="text-indigo-600" />
                          </div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 mb-8 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      {t.responsibilities}
                    </h3>
                    <ul className="space-y-5">
                      {[
                        "Develop and maintain high-quality code",
                        "Collaborate with cross-functional teams",
                        "Participate in code reviews and architecture discussions",
                        "Optimize application for maximum speed and scalability",
                        "Implement security and data protection",
                      ].map((resp, i) => (
                        <li key={i} className="flex items-start gap-4 text-slate-600 text-base font-bold">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          </div>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="relative z-10 text-xs font-black uppercase tracking-[0.25em] text-indigo-600 mb-8 flex items-center gap-3">
                    <Sparkles size={16} />
                    {t.aboutCompany}
                  </h3>
                  <p className="relative z-10 text-slate-600 leading-relaxed text-lg font-medium font-serif italic">
                    {job.aboutCompany}
                  </p>
                </section>
              </div>
            </div>

            {/* Right Side: Sidebar (Fixed on Desktop) */}
            <div className="w-full md:w-[22rem] bg-slate-50 border-l border-slate-100 p-8 md:p-12 flex flex-col">
              <div className="space-y-10 flex-grow">
                <div className="group">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-4 font-sans">
                    {t.salaryRange}
                  </span>
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
                    {job.salary || "Competitive"}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-4">
                    {t.jobType}
                  </span>
                  <div className="flex items-center gap-3 text-slate-900 font-black text-lg">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    {job.type}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-4">
                    {t.allLocations}
                  </span>
                  <div className="flex items-center gap-3 text-slate-900 font-black text-lg">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    {job.location}
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-60 block mb-3">
                    {t.jobCode}
                  </span>
                  <div className="relative z-10 text-3xl font-mono font-black mb-6 tracking-tighter">
                    {job.code}
                  </div>
                  <p className="relative z-10 text-[11px] opacity-70 leading-relaxed font-bold">
                    {t.mentionCode} <span className="text-indigo-400 underline decoration-2 underline-offset-4">{job.code}</span> {t.inYourApplication}
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-slate-200">
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group"
                >
                  {t.applyNow}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="text-center text-[10px] text-slate-400 font-bold mt-6 uppercase tracking-widest">
                  Secure Application via Google Forms
                </p>
              </div>
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

  const trendingKeywords = ["React", "Node.js", "UI/UX", "Marketing", "Sales", "Remote"];

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
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden bg-white">
        {/* Editorial Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[140px] -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[140px] translate-y-1/2" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
          
          {/* Floating Geometric Accents */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-[10%] w-12 h-12 border-2 border-indigo-200 rounded-xl rotate-12 hidden lg:block"
          />
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 left-[10%] w-16 h-16 border-2 border-blue-200 rounded-full hidden lg:block"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl shadow-slate-200"
            >
              <Sparkles size={14} className="text-indigo-400" />
              {t.heroBadge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-7xl md:text-[10rem] font-black tracking-[-0.05em] text-slate-900 mb-10 leading-[0.85] max-w-5xl font-display"
            >
              {t.heroTitlePart1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-[length:200%_auto] animate-gradient italic font-serif font-light tracking-tight">
                {t.heroTitlePart2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-slate-500 max-w-3xl mb-16 leading-relaxed font-medium"
            >
              {t.heroSubtitle}
            </motion.p>

            {/* Premium Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-full max-w-4xl"
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000" />
                <div className="relative flex flex-col md:flex-row items-center gap-4 p-4 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                  <div className="flex-grow flex items-center gap-5 px-6 w-full">
                    <Search className="w-7 h-7 text-indigo-600" />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 text-xl font-bold py-4"
                    />
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="h-12 w-px bg-slate-200 hidden md:block" />
                    <button className="flex-grow md:flex-none px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 group">
                      <span className="flex items-center gap-2">
                        {t.submitResume}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Trending Keywords */}
              <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Trending:
                </span>
                {trendingKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setSearchQuery(kw)}
                    className="text-[11px] font-black text-slate-600 hover:text-white bg-slate-100 hover:bg-indigo-600 px-5 py-2 rounded-xl transition-all duration-300 uppercase tracking-widest"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-indigo-600 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 tracking-tighter leading-[0.9] font-display">
                  {t.whyJoinTitle}
                </h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map(
                    (benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] hover:border-indigo-100 transition-all duration-500"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <p className="text-lg font-black text-slate-900 leading-tight tracking-tight">
                          {benefit}
                        </p>
                      </motion.div>
                    ),
                  )}
                </div>
                <div className="mt-16">
                  <a
                    href="https://forms.gle/5kEp1zSjMz3f4HyJ9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-slate-900 text-white hover:bg-indigo-600 px-10 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-200 active:scale-95 group"
                  >
                    {t.joinTalentPool}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <div className="absolute -inset-6 bg-indigo-600/5 rounded-[3.5rem] rotate-3" />
                <div className="absolute -inset-6 bg-blue-600/5 rounded-[3.5rem] -rotate-3" />
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                  alt="Team collaboration"
                  className="relative rounded-[3rem] shadow-2xl grayscale-[0.4] hover:grayscale-0 transition-all duration-1000 object-cover aspect-[4/5]"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Floating Stats Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 hidden md:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">500+</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Roles</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Grid Section */}
      <section className="py-24 bg-white min-h-[800px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-20 gap-12">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-slate-200"
              >
                <Briefcase size={14} className="text-indigo-600" />
                {loading
                  ? t.loadingJobs
                  : `${filteredJobs.length} ${t.jobsFound}`}
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-8 font-display">
                {t.latestOpportunities}
              </h2>
              
              {/* Technical Filter Bar */}
              <div className="flex flex-wrap gap-3">
                {jobTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border",
                      selectedType === type.value
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105"
                        : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl border transition-all font-black uppercase tracking-[0.2em] text-[11px] shadow-sm",
                  showSavedOnly
                    ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200 scale-105"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600",
                )}
              >
                <Bookmark
                  size={16}
                  fill={showSavedOnly ? "currentColor" : "none"}
                />
                {t.savedOnly}
                <span className={cn(
                  "ml-2 px-2 py-0.5 rounded-md text-[10px]",
                  showSavedOnly ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {savedJobIds.length}
                </span>
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
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-6"
            >
              Process
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9] max-w-3xl font-display">
              {t.howItWorksTitle}
            </h2>
            <p className="text-xl text-slate-500 font-bold max-w-2xl">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                icon: Briefcase,
                title: t.step1Title,
                desc: t.step1Desc,
                color: "indigo"
              },
              {
                icon: Search,
                title: t.step2Title,
                desc: t.step2Desc,
                color: "blue"
              },
              {
                icon: Building2,
                title: t.step3Title,
                desc: t.step3Desc,
                color: "emerald"
              },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                {/* Connection Line */}
                {i < 2 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent z-0" />
                )}
                
                <div className="absolute -start-8 -top-8 text-[12rem] font-black text-slate-100/50 group-hover:text-indigo-50/50 transition-colors duration-700 select-none z-0 font-display">
                  {i + 1}
                </div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-slate-200 border border-slate-100 text-indigo-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight font-display">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-bold text-lg">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
