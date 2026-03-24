import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Building2, Search, ArrowRight, CheckCircle2, ExternalLink, 
  MapPin, Bookmark, X, Sparkles, SlidersHorizontal, Info
} from 'lucide-react';
import Logo from '../components/Logo';
import { useLanguageStore } from '../store/useLanguageStore';
import { useApplicationStore } from '../store/useApplicationStore';
import { translations } from '../i18n/translations';
import Navbar from '../components/Navbar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { cn } from '../utils';
import { mockJobs, Job } from '../data/jobs';

const JobCard = React.forwardRef<HTMLDivElement, { 
  job: Job; 
  isSaved: boolean; 
  onToggleSave: () => void; 
  onOpenDetails: () => void; 
  onApply: () => void;
  t: { [key: string]: string }
}>(({ job, isSaved, onToggleSave, onOpenDetails, onApply, t }, ref) => {
  
  return (
    <motion.div 
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-indigo-900/20 transition-all duration-500 flex flex-col h-full cursor-pointer overflow-hidden"
      onClick={onOpenDetails}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 group-hover:border-indigo-500/30 transition-colors shadow-sm">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
            ) : (
              job.company.charAt(0)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-0.5 tracking-tight">
              {job.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <Building2 size={12} className="text-indigo-500" />
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
            "p-2.5 rounded-xl shadow-sm border transition-all duration-300 active:scale-90",
            isSaved 
              ? 'bg-indigo-600 border-indigo-600 text-white' 
              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
          )}
          title={isSaved ? "Remove from saved" : "Save job"}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
          <MapPin size={12} className="text-indigo-500" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
          <Briefcase size={12} className="text-indigo-500" />
          {job.type}
        </div>
      </div>

      {job.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 flex-grow leading-relaxed relative z-10 font-medium italic opacity-80">
          "{job.description}"
        </p>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800/50 relative z-10">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 mb-1">{t.useCode}</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50 dark:bg-indigo-900/50 px-2 py-0.5 rounded text-xs ring-1 ring-indigo-100 dark:ring-indigo-900/50">{job.code || 'N/A'}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Apply
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
            title={t.viewDetails}
          >
            <Info size={18} />
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
  t: { [key: string]: string }
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
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10"
          >
            <div className="absolute top-8 right-8 z-20 flex gap-3">
              <button 
                onClick={onToggleSave}
                className={cn(
                  "p-3 rounded-2xl shadow-xl border transition-all duration-300 active:scale-90",
                  isSaved 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                )}
              >
                <Bookmark size={22} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-xl active:scale-90"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-8 sm:p-16 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12 text-center sm:text-left">
                <div className="w-28 h-28 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-5xl border border-slate-100 dark:border-slate-700 shadow-2xl shrink-0 overflow-hidden">
                  {job.logo ? (
                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                  ) : (
                    job.company.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100 dark:border-indigo-800">
                    <Sparkles size={12} />
                    {job.type}
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-[0.9] tracking-tighter">{job.title}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-slate-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-2">
                      <Building2 size={20} className="text-indigo-500" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={20} className="text-indigo-500" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                {[
                  { label: 'Salary Range', value: job.salary || 'Competitive', color: 'indigo' },
                  { label: 'Posted', value: job.postedAt || 'Recently', color: 'emerald' },
                  { label: 'Job Type', value: job.type, color: 'purple' },
                  { label: 'Job Code', value: job.code || 'N/A', color: 'orange', isMono: true },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                    <span className="block text-[9px] uppercase tracking-widest font-black text-slate-400 mb-2">{item.label}</span>
                    <span className={cn(
                      "text-slate-900 dark:text-white font-black text-sm",
                      item.isMono && "font-mono text-indigo-600 dark:text-indigo-400"
                    )}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                    {t.jobDescription}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-line opacity-90">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                    {t.requirements}
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                      '3+ years of experience in the field', 
                      'Strong problem-solving skills', 
                      'Excellent communication and teamwork', 
                      'Ability to work in a fast-paced environment',
                      'Proficiency in modern tech stacks',
                      'Strong analytical thinking'
                    ].map((req, i) => (
                      <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-900 dark:bg-slate-950 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="text-center sm:text-left">
                <p className="text-lg text-white font-black mb-1">Ready to take the next step?</p>
                <p className="text-sm text-slate-400 font-medium">Mention code <span className="font-mono font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">{job.code}</span> in your application</p>
              </div>
              <a 
                href={applyUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-indigo-50 px-12 py-5 rounded-2xl text-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 group"
              >
                {t.applyNow}
                <ExternalLink size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function HashHuntPage() {
  const { language, dir } = useLanguageStore();
  const { addApplication } = useApplicationStore();
  const t = translations[language].hashHunt;
  const [jobs] = useState<Job[]>(mockJobs);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => {
      const newSaved = prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem('savedJobs', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // No longer need to fetch from API in pure frontend version
  useEffect(() => {
    // We could still simulate a fetch if we wanted, but for now we just use mockJobs
    setLoading(false);
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'All' || job.type === selectedType;
      const matchesSaved = !showSavedOnly || savedJobIds.includes(job.jobId);
      
      return matchesSearch && matchesType && matchesSaved;
    });
  }, [jobs, searchQuery, selectedType, showSavedOnly, savedJobIds]);

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Hybrid', 'On-site'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300" dir={dir}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[800px] w-[800px] rounded-full bg-indigo-500 opacity-[0.03] blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12 border border-indigo-100 dark:border-indigo-800 shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            {t.heroBadge}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-[110px] font-black tracking-tighter text-slate-900 dark:text-white mb-10 leading-[0.85] font-display"
          >
            {t.heroTitlePart1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
              {t.heroTitlePart2}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-20 leading-relaxed font-medium"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/20 dark:border-slate-800/50 flex flex-col lg:flex-row items-center gap-4"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[1.8rem] focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-bold text-lg placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto scrollbar-hide px-2 lg:px-0 py-1">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-[1.8rem] border border-slate-100 dark:border-slate-800/50">
                <SlidersHorizontal size={18} className="mx-3 text-slate-400" />
                {jobTypes.slice(0, 4).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "px-6 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
                      selectedType === type 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {type === 'All' ? t.allTypes : type}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 dark:bg-slate-900/50 rounded-[4rem] p-10 md:p-24 text-center md:text-left flex flex-col lg:flex-row items-center gap-20 shadow-3xl overflow-hidden relative border border-white/5">
            <div className="absolute top-0 right-0 -mt-40 -mr-40 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[160px] opacity-10"></div>
            <div className="absolute bottom-0 left-0 -mb-40 -ml-40 w-[600px] h-[600px] bg-purple-500 rounded-full blur-[160px] opacity-10"></div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-10 font-display tracking-tighter leading-[0.9]">{t.whyJoinTitle}</h2>
              <ul className="space-y-6">
                {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map((benefit, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-5 text-slate-300"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 mt-1 border border-indigo-500/20">
                      <CheckCircle2 size={24} className="text-indigo-400" />
                    </div>
                    <span className="text-xl font-bold leading-relaxed opacity-90">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-16">
                <a 
                  href="https://forms.gle/5kEp1zSjMz3f4HyJ9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-white text-slate-900 hover:bg-indigo-50 px-12 py-6 rounded-2xl text-xl font-black transition-all shadow-2xl hover:scale-105 active:scale-95 group uppercase tracking-widest"
                >
                  {t.joinTalentPool}
                  <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </a>
              </div>
            </div>
            
            <div className="flex-1 relative z-10 hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80" 
                  alt="Team collaboration" 
                  className="rounded-[3.5rem] shadow-3xl border-8 border-white/5 relative z-10 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Grid Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[800px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-slate-200 dark:border-slate-700">
                <Briefcase size={12} />
                {loading ? t.loadingJobs : `${filteredJobs.length} ${t.jobsFound}`}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white font-display tracking-tighter leading-none">{t.latestOpportunities}</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all shadow-xl font-black uppercase tracking-widest text-xs",
                  showSavedOnly 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/30' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-800'
                )}
              >
                <Bookmark size={18} fill={showSavedOnly ? "currentColor" : "none"} />
                {t.savedOnly} ({savedJobIds.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse h-[400px] flex flex-col">
                  <div className="flex gap-6 mb-8">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                    <div className="flex-1 space-y-4 py-2">
                      <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4"></div>
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-4 mb-10">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-5/6"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-4/6"></div>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="h-5 w-20 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-12 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
              <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <X size={48} className="text-rose-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
              >
                {t.tryRefreshing}
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
              <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-10">
                <Search size={64} className="text-slate-200" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t.noJobsFound}</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedType('All'); setShowSavedOnly(false); }}
                className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
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
                        status: 'Applied'
                      });
                      alert('Applied successfully!');
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
      <section className="py-32 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 font-display tracking-tighter leading-none">{t.howItWorksTitle}</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-bold">{t.howItWorksSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
            
            {[
              { icon: Briefcase, title: t.step1Title, desc: t.step1Desc, color: 'indigo' },
              { icon: Search, title: t.step2Title, desc: t.step2Desc, color: 'purple' },
              { icon: Building2, title: t.step3Title, desc: t.step3Desc, color: 'emerald' }
            ].map((item, i) => (
              <div key={i} className="text-center relative group">
                <div className={cn(
                  "w-32 h-32 mx-auto bg-white dark:bg-slate-900 border-8 border-slate-50 dark:border-slate-950 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110",
                  item.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30' :
                  item.color === 'purple' ? 'text-purple-600 dark:text-purple-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30' :
                  'text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30'
                )}>
                  <item.icon size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-32 border-t border-white/5 pb-safe">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-6">
                <Logo className="w-12 h-12 text-[#ff4d2d]" />
                <span className="text-4xl font-black text-white font-display tracking-tighter">Hash Resume</span>
              </div>
              <p className="text-xl max-w-sm font-bold opacity-80 leading-relaxed">Professional resumes, simplified. Built with privacy in mind.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Product</h4>
                <Link to="/" className="block hover:text-white transition-colors font-bold">Resume Builder</Link>
                <Link to="/editor" className="block hover:text-white transition-colors font-bold">Editor</Link>
                <Link to="/hash-hunt" className="block hover:text-white transition-colors font-bold">Hash Hunt</Link>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Support</h4>
                <a href="#" className="block hover:text-white transition-colors font-bold">Feedback</a>
                <a href="#" className="block hover:text-white transition-colors font-bold">Privacy Policy</a>
                <a href="#" className="block hover:text-white transition-colors font-bold">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="font-black text-sm uppercase tracking-widest">© {new Date().getFullYear()} Hash Resume. All rights reserved.</p>
            <div className="flex items-center gap-10">
              <LanguageSwitcher size={18} variant="ghost" className="px-0 py-0 text-white font-black" />
              <div className="flex items-center gap-6">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
