import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, FileText, CheckCircle2, ArrowRight, MessageCircle, Facebook, Instagram, AtSign, PenTool, TrendingUp, Users, Calendar, Clock, Target, Plus, Briefcase } from 'lucide-react';
import Logo from '../components/Logo';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';
import WizardShowcase from '../components/WizardShowcase';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import FeedbackModal from '../components/FeedbackModal';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';
import { blogPosts } from '../data/blogPosts';

export default function LandingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      {/* Floating Dock Navbar */}
      <div className="sticky top-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none mb-8">
        <nav className="pointer-events-auto flex items-center gap-3 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] max-w-full overflow-x-auto scrollbar-hide">
          
          {/* Logo / Home */}
          <Link to="/" className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform shrink-0">
            <Logo className="w-7 h-7" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center px-2 gap-1">
            <a href="#features" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all whitespace-nowrap">{t.features}</a>
            <a href="#process" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all whitespace-nowrap">{t.howItWorks}</a>
            <Link to="/cover-letter" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all whitespace-nowrap flex items-center gap-2">
              <PenTool size={14} />
              {t.coverLetter}
            </Link>
            <Link to="/blog" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all whitespace-nowrap">{t.blog}</Link>
            <Link to="/hash-hunt" className="px-4 py-2 text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 hover:opacity-80 transition-opacity flex items-center gap-2 whitespace-nowrap">
              <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
              {t.hashHuntJobs}
            </Link>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>

          {/* Secondary Actions */}
          <div className="flex items-center gap-2 px-1">
            <ThemeToggle size={20} className="p-2.5" />
            <LanguageSwitcher size={18} className="text-sm px-4 py-2" />
          </div>

          {/* Primary Action (Build Resume) */}
          <Link 
            to="/editor" 
            className="flex items-center gap-3 bg-[#E2FF6F] hover:bg-[#D4FF3F] text-black font-bold py-1.5 pl-5 pr-1.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all group shrink-0"
          >
            <span className="text-sm tracking-tight hidden sm:inline">{t.buildResume}</span>
            <div className="bg-black rounded-full p-2 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight size={18} className="text-white" />
            </div>
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/4 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-20 dark:opacity-30 blur-[120px]"></div>
        <div className="absolute right-1/4 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-500 opacity-20 dark:opacity-30 blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Column: Text & CTA */}
            <div className="flex-1 text-center lg:text-left rtl:lg:text-right">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 font-display"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 block mb-2 md:mb-4 text-4xl md:text-5xl">{t.heroTitle1}</span>
                {t.heroTitle2}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">{t.heroTitle3}</span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-10"
              >
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-lg shadow-indigo-500/5 inline-block lg:block">
                  <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {t.heroSubtitle}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
              >
                <Link to="/editor" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group">
                  {t.buildResume}
                  <ArrowRight size={20} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/cover-letter" className="w-full sm:w-auto bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2 group">
                  <PenTool size={20} />
                  {t.createCoverLetter}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 flex flex-col lg:flex-row items-center lg:items-start gap-6"
              >
                {/* Stats Badge */}
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-indigo-100 dark:shadow-none border border-indigo-50 dark:border-slate-800">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {i === 3 ? '91%' : <Users size={14} />}
                      </div>
                    ))}
                  </div>
                  <div className="text-left rtl:text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <TrendingUp size={14} className="text-emerald-500 dark:text-emerald-400" />
                      {t.statsText}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:items-start items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium border border-emerald-100 dark:border-emerald-800">
                    <ShieldCheck size={16} />
                    {t.privacyBadge}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Abstract Composition */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[450px] aspect-square"
              >
                {/* Main Abstract Shape - Simple Gradient Card */}
                <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-[3rem] rotate-6 blur-3xl"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-indigo-50 via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-[2.5rem] border border-white/60 dark:border-slate-700 shadow-2xl shadow-indigo-500/10 overflow-hidden">
                   {/* Subtle Inner Grid */}
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                   
                   {/* Abstract Resume Representation */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-50">
                      <div className="w-3/4 h-3/4 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/50 dark:border-slate-700/50 p-6 space-y-4 backdrop-blur-sm">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-3 w-1/2 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                            <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                          </div>
                        </div>
                        <div className="space-y-2 pt-4">
                          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                          <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                          <div className="h-2 w-4/6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Floating Card 1: ATS Score (Top Left) */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 bg-white dark:bg-slate-800 p-3 pr-5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-20"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                     <Target className="text-emerald-500 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">ATS Score</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">98/100</p>
                  </div>
                </motion.div>

                {/* Floating Card 2: Job Offer (Bottom Right) */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -right-2 bg-white dark:bg-slate-800 p-3 pr-5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-20"
                >
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">New Offer</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Senior Designer</p>
                  </div>
                </motion.div>

                {/* Floating Card 3: Resume File (Middle Right) */}
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 hidden sm:flex items-center gap-3"
                >
                   <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500">
                      <FileText size={20} />
                   </div>
                   <div className="space-y-1.5 pr-2">
                      <div className="h-1.5 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="h-1.5 w-8 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                   </div>
                </motion.div>

              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">{t.featuresTitle}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.featuresSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: t.feature1Title, desc: t.feature1Desc, color: "from-amber-400 to-orange-500", bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
              { icon: ShieldCheck, title: t.feature2Title, desc: t.feature2Desc, color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
              { icon: FileText, title: t.feature3Title, desc: t.feature3Desc, color: "from-indigo-400 to-blue-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
              { icon: CheckCircle2, title: t.feature4Title, desc: t.feature4Desc, color: "from-cyan-400 to-blue-500", bg: "bg-cyan-50 dark:bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400" }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 dark:opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
                <div className={`w-14 h-14 ${feature.bg} ${feature.text} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cover Letter Section */}
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                <PenTool size={16} />
                {t.coverLetterNew}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display leading-tight">
                {t.coverLetterTitle}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.coverLetterDesc}
              </p>
              <ul className="space-y-4">
                {[
                  t.coverLetterList1,
                  t.coverLetterList2,
                  t.coverLetterList3,
                  t.coverLetterList4
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/cover-letter" className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                {t.tryCoverLetter}
                <ArrowRight size={18} className="rtl:rotate-180" />
              </Link>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-cyan-100 dark:from-indigo-900/30 dark:to-cyan-900/30 rounded-3xl transform rotate-3 scale-95 -z-10"></div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4 opacity-50 pointer-events-none select-none">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-full mt-8"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-11/12"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/5"></div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link to="/cover-letter" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                    {t.startWriting}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wizard Showcase (Replaces Process) */}
      <section id="process">
        <WizardShowcase />
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Latest Blog Posts */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">
                {language === 'ar' ? 'أحدث المقالات' : 'Latest from the Blog'}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                {language === 'ar' 
                  ? 'نصائح مهنية لمساعدتك في الحصول على وظيفتك التالية.' 
                  : 'Career advice to help you land your next job.'}
              </p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:gap-3 transition-all">
              {language === 'ar' ? 'عرض كل المقالات' : 'View all articles'}
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post, index) => (
              <div key={post.id} className="group cursor-pointer">
                <Link to={`/blog/${post.id}`} className="block overflow-hidden rounded-2xl mb-4 h-48 relative">
                  <img 
                    src={post.image} 
                    alt={post.title[language]} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime[language]}
                  </span>
                </div>
                <Link to={`/blog/${post.id}`} className="block mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {post.title[language]}
                  </h3>
                </Link>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                  {post.excerpt[language]}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
              {language === 'ar' ? 'عرض كل المقالات' : 'View all articles'}
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="flex flex-col items-start mb-6">
                <Logo className="w-10 h-10 text-indigo-500 mb-2" />
                <span className="text-2xl font-black text-white font-display">Hash Resume</span>
                <span className="text-sm text-slate-500 mt-1">A part of Hash Social Media Marketing Agency</span>
              </div>
              <p className="text-sm max-w-sm">{t.footerDesc}</p>
            </div>
            <div className="flex flex-col md:items-end">
              <h4 className="text-white font-semibold mb-4">{t.connect}</h4>
              <div className="flex gap-4 mb-8">
                <a href="https://www.facebook.com/hashsocialmarketing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-500 transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/hashsocialmarketing/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://www.threads.com/@hashsocialmarketing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Threads">
                  <AtSign size={20} />
                </a>
                <a href="https://wa.me/201101007965" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-500 transition-colors" aria-label="WhatsApp">
                  <MessageCircle size={20} />
                </a>
              </div>

              <h4 className="text-white font-semibold mb-4">{t.product}</h4>
              <ul className="space-y-2 text-sm md:text-right">
                <li><Link to="/editor" className="hover:text-white transition-colors">{t.resumeBuilder}</Link></li>
                <li><Link to="/cover-letter" className="hover:text-white transition-colors">{t.coverLetter}</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">{t.blog}</Link></li>
                <li><Link to="/hash-hunt" className="hover:text-white transition-colors">{t.hashHuntJobs}</Link></li>
                <li>
                  <button 
                    onClick={() => setShowFeedbackModal(true)} 
                    className="hover:text-white transition-colors text-left w-full md:text-right"
                  >
                    {t.feedback}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} {t.rightsReserved}</p>
            <div className="flex gap-4">
              <p>{t.privateFooter}</p>
            </div>
          </div>
        </div>
      </footer>
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </div>
  );
}
