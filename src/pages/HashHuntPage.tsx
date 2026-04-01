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
  Info,
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
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300/50 transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden"
      onClick={onOpenDetails}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 end-0 w-32 h-32 bg-gradient-to-br from-indigo-50/80 to-transparent rounded-es-full -me-16 -mt-16 group-hover:scale-[2] transition-transform duration-700 ease-out"></div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-500 font-bold text-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
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
            <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
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
            "p-2 rounded-2xl border transition-all duration-200",
            isSaved
              ? "bg-indigo-50 border-indigo-200 text-indigo-600"
              : "bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200",
          )}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-semibold text-slate-600 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">
          {job.location}
        </span>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100/50">
          {job.type}
        </span>
      </div>

      {job.description && (
        <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed flex-grow">
          {job.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
            {t.useCode}
          </span>
          <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg text-xs border border-indigo-100/50">
            {job.code || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl transition-all border border-slate-200 hover:border-slate-300 shadow-sm"
            title={t.viewDetails}
          >
            <Info size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-sm hover:shadow-md"
          >
            {t.applyNow}
          </button>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/50"
          >
            <div className="absolute top-6 end-6 z-20 flex gap-4">
              <button
                onClick={onToggleSave}
                className={cn(
                  "p-4 rounded-2xl shadow-sm border transition-all duration-300 active:scale-95 bg-white/80 backdrop-blur-md hover:bg-white",
                  isSaved
                    ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 hover:border-indigo-700"
                    : "border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200",
                )}
              >
                <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button
                onClick={onClose}
                className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white hover:border-slate-300 transition-all shadow-sm active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar relative">
              {/* Decorative background blur inside modal */}
              <div className="absolute top-0 start-0 w-full h-64 bg-gradient-to-b from-slate-50 to-transparent -z-10"></div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 text-center sm:text-start relative z-10">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-slate-400 font-bold text-4xl border border-slate-200 shadow-sm shrink-0 overflow-hidden">
                  {job.logo ? (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    job.company.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-100/50">
                    <Sparkles size={14} />
                    {job.type}
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-600 font-medium text-sm">
                    <span className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-lg">
                      <Building2 size={16} className="text-indigo-500" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-lg">
                      <MapPin size={16} className="text-indigo-500" />
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
                    color: "text-emerald-600",
                    bg: "bg-emerald-50/80",
                    border: "border-emerald-100/50"
                  },
                  {
                    label: t.posted,
                    value: job.postedAt || "Recently",
                    icon: Clock,
                    color: "text-blue-600",
                    bg: "bg-blue-50/80",
                    border: "border-blue-100/50"
                  },
                  { 
                    label: t.jobType, 
                    value: job.type, 
                    icon: Briefcase,
                    color: "text-purple-600",
                    bg: "bg-purple-50/80",
                    border: "border-purple-100/50"
                  },
                  {
                    label: t.jobCode,
                    value: job.code || "N/A",
                    icon: Search,
                    color: "text-orange-600",
                    bg: "bg-orange-50/80",
                    border: "border-orange-100/50",
                    isMono: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={cn("p-4 rounded-2xl border flex flex-col gap-2 transition-transform hover:-translate-y-1 duration-300", item.bg, item.border)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("p-2 rounded-lg bg-white shadow-sm", item.color)}>
                        <item.icon size={16} />
                      </div>
                      <span className="block text-xs font-semibold text-slate-600">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-slate-900 font-bold text-sm mt-1",
                        item.isMono && "font-mono text-indigo-700",
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                    {t.jobDescription}
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                    {t.requirements}
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                      "3+ years of experience in the field",
                      "Strong problem-solving skills",
                      "Excellent communication and teamwork",
                      "Ability to work in a fast-paced environment",
                      "Proficiency in modern tech stacks",
                      "Strong analytical thinking",
                    ].map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-medium text-sm transition-colors hover:bg-slate-100/80"
                      >
                        <CheckCircle2
                          size={24}
                          className="text-emerald-500 shrink-0 mt-0.5"
                        />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-20">
              <div className="text-center sm:text-start">
                <p className="text-lg text-slate-900 font-bold mb-1.5">
                  {t.readyToTakeNextStep}
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-2 justify-center sm:justify-start">
                  {t.mentionCode}
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-lg border border-indigo-200/50">
                    {job.code}
                  </span>
                  {t.inYourApplication}
                </p>
              </div>
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-slate-900 text-white hover:bg-indigo-600 px-8 py-4 rounded-2xl text-base font-bold shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95 group"
              >
                {t.applyNow}
                <ExternalLink
                  size={24}
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
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.jobs && data.jobs.length > 0) {
            setJobs(data.jobs);
          } else {
            setJobs(mockJobs);
          }
        } catch (e) {
          // Response is not JSON (likely source code), fallback to mock data silently
          setJobs(mockJobs);
        }
      } catch (err) {
        console.warn("Error fetching jobs, falling back to mock data.");
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
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
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute start-1/2 top-0 -translate-x-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
          >
            <Sparkles size={14} className="text-indigo-500" />
            {t.heroBadge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]"
          >
            {t.heroTitlePart1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {t.heroTitlePart2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-slate-200/60 flex flex-col md:flex-row items-center gap-4"
          >
            <div className="relative flex-1 w-full group">
              <Search
                className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={24}
              />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-12 pe-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-indigo-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 text-slate-900 font-medium text-base placeholder:text-slate-400 transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide pb-2 md:pb-0 px-1">
              {jobTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={cn(
                    "px-6 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200",
                    selectedType === type.value
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50/50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 end-0 w-1/2 h-full bg-indigo-50/50 -skew-x-12 translate-x-1/4 -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
            {/* Inner decorative blur */}
            <div className="absolute -top-24 -start-24 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl"></div>

            <div className="flex-1 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]"
              >
                {t.whyJoinTitle}
              </motion.h2>
              <ul className="space-y-5">
                {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map(
                  (benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 text-slate-700 group"
                    >
                      <div className="w-8 h-8 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors duration-300">
                        <CheckCircle2 size={16} className="text-indigo-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-base font-medium leading-relaxed pt-1">
                        {benefit}
                      </span>
                    </motion.li>
                  ),
                )}
              </ul>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <a
                  href="https://forms.gle/5kEp1zSjMz3f4HyJ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-slate-900 text-white hover:bg-indigo-600 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95 group"
                >
                  {t.joinTalentPool}
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1 w-full lg:w-auto relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-3xl -rotate-3 scale-105 -z-10 blur-sm"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl border border-white/50"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Jobs Grid Section */}
      <section className="py-24 bg-white min-h-[800px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="text-center md:text-start">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 border border-slate-200">
                <Briefcase size={12} />
                {loading
                  ? t.loadingJobs
                  : `${filteredJobs.length} ${t.jobsFound}`}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display tracking-tighter leading-none">
                {t.latestOpportunities}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl border transition-all shadow-xl font-black uppercase tracking-widest text-xs",
                  showSavedOnly
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/30"
                    : "bg-white border-slate-100 text-slate-700 hover:border-indigo-200 :border-indigo-800",
                )}
              >
                <Bookmark
                  size={16}
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
                  className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 animate-pulse h-[400px] flex flex-col"
                >
                  <div className="flex gap-6 mb-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
                    <div className="flex-1 space-y-4 py-2">
                      <div className="h-6 bg-slate-100 rounded-full w-4/5"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-4 mb-10">
                    <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-4/5"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-4/6"></div>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-50">
                    <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
                    <div className="h-12 w-32 bg-slate-100 rounded-2xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-2xl">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <X size={48} className="text-rose-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
              >
                {t.tryRefreshing}
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-2xl">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10">
                <Search size={64} className="text-slate-200" />
              </div>
              <p className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
                {t.noJobsFound}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setShowSavedOnly(false);
                }}
                className="text-indigo-600 font-black uppercase tracking-widest text-sm hover:underline"
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
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              {t.howItWorksTitle}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              {t.howItWorksSubtitle}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 start-[15%] end-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10"></div>

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
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="bg-white p-8 sm:p-12 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group hover:-translate-y-2 relative"
              >
                <div className="absolute -top-4 -start-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
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
