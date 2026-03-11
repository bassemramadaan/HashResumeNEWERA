import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Building2, Search, ArrowRight, CheckCircle2, ExternalLink, MapPin, Clock, DollarSign, Bookmark, ArrowLeft, Filter, X, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface Job {
  jobId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedAt?: string;
  description?: string;
  url?: string;
  logo?: string;
  code?: string;
}

const JobCard: React.FC<{ job: Job; isSaved: boolean; onToggleSave: () => void; onOpenDetails: () => void; t: any }> = ({ job, isSaved, onToggleSave, onOpenDetails, t }) => {
  const applyUrl = "https://forms.gle/h1UNQfD55dc2o8wM6";
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-indigo-900/20 transition-all duration-300 hover:border-indigo-100 dark:hover:border-indigo-900/50 group flex flex-col h-full relative overflow-hidden cursor-pointer"
      onClick={onOpenDetails}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 dark:from-indigo-900/20 to-transparent rounded-bl-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/30 transition-colors shadow-sm">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              job.company.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">{job.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <Building2 size={14} />
              {job.company}
            </p>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className={`p-2.5 rounded-xl shadow-sm border transition-all duration-200 ${
            isSaved 
              ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' 
              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
          title={isSaved ? "Remove from saved" : "Save job"}
        >
          <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-5 relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:border-indigo-100 dark:group-hover:border-indigo-800 transition-colors">
          <MapPin size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:border-indigo-100 dark:group-hover:border-indigo-800 transition-colors">
          <Briefcase size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
          {job.type}
        </div>
        {job.postedAt && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
            <Clock size={14} />
            {job.postedAt}
          </div>
        )}
      </div>

      {job.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-grow leading-relaxed relative z-10 font-medium">
          {job.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50 dark:border-slate-800 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-0.5">{t.useCode}</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50 dark:bg-indigo-900/50 px-2 py-0.5 rounded text-sm">{job.code || 'N/A'}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            {t.viewDetails}
          </button>
          <a 
            href={applyUrl}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 group/btn"
          >
            {t.applyNow}
            <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

const JobDetailsModal: React.FC<{ job: Job; isOpen: boolean; onClose: () => void; isSaved: boolean; onToggleSave: () => void; t: any }> = ({ job, isOpen, onClose, isSaved, onToggleSave, t }) => {
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              <button 
                onClick={onToggleSave}
                className={`p-3 rounded-2xl shadow-sm border transition-all duration-200 ${
                  isSaved 
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 text-center sm:text-left">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-4xl border border-slate-100 dark:border-slate-700 shadow-sm shrink-0">
                  {job.logo ? (
                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                  ) : (
                    job.company.charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{job.title}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={18} className="text-indigo-500" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={18} className="text-indigo-500" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={18} className="text-indigo-500" />
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Salary Range</span>
                  <span className="text-slate-900 dark:text-white font-black">{job.salary || 'Competitive'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Posted</span>
                  <span className="text-slate-900 dark:text-white font-black">{job.postedAt || 'Recently'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Job Type</span>
                  <span className="text-slate-900 dark:text-white font-black">{job.type}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Job Code</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">{job.code || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                    {t.jobDescription}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                {/* Mock requirements if not present */}
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                    {t.requirements}
                  </h3>
                  <ul className="space-y-3">
                    {['3+ years of experience in the field', 'Strong problem-solving skills', 'Excellent communication and teamwork', 'Ability to work in a fast-paced environment'].map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 font-medium">
                        <CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-1">Ready to take the next step?</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Mention code <span className="font-mono font-bold text-indigo-500">{job.code}</span> in your application</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <a 
                  href={applyUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl text-lg font-black shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 group"
                >
                  {t.applyNow}
                  <ExternalLink size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function HashHuntPage() {
  const { language } = useLanguageStore();
  const t = translations[language].hashHunt;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { scrollDirection, isScrolled } = useScrollDirection();
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

  useEffect(() => {
    async function fetchJobs() {
      try {
        const apiUrl = "/api/jobs";
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        const jobsArray = Array.isArray(data) ? data : (data.jobs || []);
        setJobs(jobsArray);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(t.tryRefreshing);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [t.tryRefreshing]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>Hash Hunt - Find Your Dream Job</title>
        <meta name="description" content="Discover exclusive job opportunities tailored for you. Submit your resume and let top companies find you." />
        <link rel="canonical" href="https://hashresume.com/hash-hunt" />
      </Helmet>

      {/* Floating Dock Navbar */}
      <div 
        className={`fixed left-0 right-0 flex justify-center z-50 px-4 pointer-events-none transition-all duration-500 ease-in-out ${
          scrollDirection === 'down' && isScrolled ? '-top-24 opacity-0' : 'top-6 opacity-100'
        }`}
      >
        <nav className="pointer-events-auto flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] max-w-full">
          <Link to="/" className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-transform shrink-0">
            <ArrowLeft size={20} className="sm:size-6" />
          </Link>
          <div className="flex items-center justify-center px-2 sm:px-4">
            <Logo className="w-8 h-8 sm:w-10 sm:h-10 text-[#f16529]" />
          </div>
          <div className="w-px h-6 sm:h-8 bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1"></div>
          <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
            <ThemeToggle />
            <a 
              href="https://forms.gle/5kEp1zSjMz3f4HyJ9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#f16529] hover:bg-[#e44d26] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap group hover:scale-105 active:scale-95"
            >
              {t.submitResume}
              <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ExternalLink size={12} className="sm:size-3.5 text-white" />
              </div>
            </a>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-indigo-500 opacity-10 blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-black mb-10 border border-indigo-100 dark:border-indigo-800 shadow-sm"
          >
            <Sparkles size={16} className="animate-pulse" />
            {t.heroBadge}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-[100px] font-black tracking-tighter text-slate-900 dark:text-white mb-10 leading-[0.9] font-display"
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
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide px-2 md:px-0">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                    selectedType === type 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {type === 'All' ? t.allTypes : type}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Jobs List Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display mb-2">{t.latestOpportunities}</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {loading ? t.loadingJobs : `${filteredJobs.length} ${t.jobsFound}`}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all shadow-sm ${
                  showSavedOnly 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-800'
                }`}
              >
                <Bookmark size={18} fill={showSavedOnly ? "currentColor" : "none"} />
                <span className="text-sm font-bold">{t.savedOnly} ({savedJobIds.length})</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse h-[320px] flex flex-col">
                  <div className="flex gap-4 mb-6">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4"></div>
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-5/6"></div>
                  </div>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-10 w-28 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <X size={40} className="text-red-500" />
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                {t.tryRefreshing}
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search size={48} className="text-slate-300" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mb-4">{t.noJobsFound}</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedType('All'); }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
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

      {/* How it works */}
      <section className="py-32 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 font-display tracking-tight">{t.howItWorksTitle}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">{t.howItWorksSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
            
            {[
              { icon: Briefcase, title: t.step1Title, desc: t.step1Desc },
              { icon: Search, title: t.step2Title, desc: t.step2Desc },
              { icon: Building2, title: t.step3Title, desc: t.step3Desc }
            ].map((item, i) => (
              <div key={i} className="text-center relative group">
                <div className="w-32 h-32 mx-auto bg-white dark:bg-slate-900 border-8 border-slate-50 dark:border-slate-950 group-hover:border-indigo-50 dark:group-hover:border-indigo-900/30 rounded-[2.5rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 shadow-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <item.icon size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-950 dark:bg-slate-900 rounded-[4rem] p-10 md:p-24 text-center md:text-left flex flex-col lg:flex-row items-center gap-16 shadow-3xl overflow-hidden relative border border-white/5">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20"></div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-10 font-display tracking-tight leading-tight">{t.whyJoinTitle}</h2>
              <ul className="space-y-6">
                {[t.benefit1, t.benefit2, t.benefit3, t.benefit4].map((benefit, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 text-indigo-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 size={20} className="text-emerald-400" />
                    </div>
                    <span className="text-xl font-medium leading-relaxed">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-16">
                <a 
                  href="https://forms.gle/5kEp1zSjMz3f4HyJ9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-indigo-950 hover:bg-indigo-50 px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-2xl hover:scale-105 active:scale-95 group"
                >
                  {t.joinTalentPool}
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            
            <div className="flex-1 relative z-10 hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] blur-2xl opacity-30 animate-pulse"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                  alt="Team collaboration" 
                  className="rounded-[2.5rem] shadow-2xl border-4 border-white/10 relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-20 border-t border-white/5 pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center mb-10">
            <Logo className="w-12 h-12 text-indigo-500 mb-4" />
            <span className="text-3xl font-black text-white font-display tracking-tighter">Hash Resume</span>
          </div>
          <p className="text-lg mb-12 max-w-md mx-auto font-medium">Professional resumes, simplified. Built with privacy in mind.</p>
          <div className="pt-10 border-t border-white/5 text-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-bold">© {new Date().getFullYear()} Hash Resume. All rights reserved.</p>
            <div className="flex gap-8 font-bold">
              <Link to="/" className="hover:text-white transition-colors">Resume Builder</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

