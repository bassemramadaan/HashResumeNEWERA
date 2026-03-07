import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Zap, FileText, CheckCircle2, ArrowRight, MessageCircle, Facebook, Instagram, AtSign, PenTool, TrendingUp, Users, Calendar, Clock, Target, Plus, Briefcase } from 'lucide-react';
import Logo from '../components/Logo';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';
import WizardShowcase from '../components/WizardShowcase';
import LanguageSwitcher from '../components/LanguageSwitcher';
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
      <Helmet>
        <title>Hash Resume - AI-Powered Resume Builder</title>
        <meta name="description" content="Create professional resumes and cover letters in minutes with our AI-powered builder. Optimize for ATS and land your dream job." />
        <meta name="keywords" content="resume builder, cv maker, cover letter, ai resume, ats friendly resume, job search" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hashresume.com/" />
        <meta property="og:title" content="Hash Resume - AI-Powered Resume Builder" />
        <meta property="og:description" content="Create professional resumes and cover letters in minutes with our AI-powered builder. Optimize for ATS and land your dream job." />
        <meta property="og:image" content="https://hashresume.com/og-image.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hashresume.com/" />
        <meta property="twitter:title" content="Hash Resume - AI-Powered Resume Builder" />
        <meta property="twitter:description" content="Create professional resumes and cover letters in minutes with our AI-powered builder. Optimize for ATS and land your dream job." />
        <meta property="twitter:image" content="https://hashresume.com/og-image.png" />
        <link rel="canonical" href="https://hashresume.com/" />
      </Helmet>
      {/* Floating Dock Navbar */}
      <div className="sticky top-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none mb-8">
        <nav className="pointer-events-auto flex items-center gap-3 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] max-w-full overflow-x-auto scrollbar-hide">
          
          {/* Logo / Home */}
          <Link to="/" className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#f16529] hover:scale-105 transition-transform shrink-0">
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
            <Link to="/hash-hunt" className="px-4 py-2 text-sm font-black text-[#f16529] hover:opacity-80 transition-opacity flex items-center gap-2 whitespace-nowrap">
              <Target size={18} className="text-[#f16529]" />
              {t.hashHuntJobs}
            </Link>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>

          {/* Secondary Actions */}
          <div className="flex items-center gap-2 px-1">
            <LanguageSwitcher size={18} className="text-sm px-4 py-2" />
          </div>

          {/* Primary Action (Build Resume) */}
          <Link 
            to="/editor" 
            className="flex items-center gap-3 bg-[#f16529] hover:bg-[#e44d26] text-white font-bold py-1.5 pl-5 pr-1.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all group shrink-0"
          >
            <span className="text-sm tracking-tight hidden sm:inline">{t.buildResume}</span>
            <div className="bg-white/20 rounded-full p-2 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight size={18} className="text-white" />
            </div>
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full bg-[#f16529] opacity-10 dark:opacity-20 blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Column: Text & CTA */}
            <div className="flex-1 text-center lg:text-left rtl:lg:text-right">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display mb-8"
              >
                <span className="text-[#f16529] block text-3xl md:text-4xl font-bold mb-4">{t.heroTitle1}</span>
                <span className="text-slate-900 dark:text-white block text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-1">{t.heroTitle2}</span>
                <span className="text-[#f16529] block text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">{t.heroTitle3}</span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-10 flex justify-center lg:justify-start"
              >
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm max-w-xl text-left rtl:text-right">
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {t.heroSubtitle}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 mb-12"
              >
                <Link to="/editor" className="w-full sm:w-auto bg-[#f16529] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#e44d26] transition-all shadow-lg shadow-[#f16529]/20 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95">
                  {t.buildResume}
                  <ArrowRight size={20} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/cover-letter" className="w-full sm:w-auto bg-white dark:bg-slate-900 text-[#f16529] border-2 border-[#f16529]/20 px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group hover:scale-105 active:scale-95">
                  <PenTool size={20} className="text-[#f16529]" />
                  {t.createCoverLetter}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
              >
                {/* Stats Badge */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-orange-100 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-sm">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-bold text-[#f16529]">
                        {i === 3 ? '91%' : <Users size={14} />}
                      </div>
                    ))}
                  </div>
                  <div className="text-left rtl:text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white max-w-[140px] leading-tight">
                      {t.statsText}
                    </p>
                  </div>
                </div>

                {/* Privacy Badge */}
                <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 px-5 py-3 rounded-2xl text-left rtl:text-right">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-[#f16529] shadow-sm shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <p className="text-xs font-bold text-[#f16529] max-w-[140px] leading-tight">
                    {t.privacyBadge}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Abstract Composition */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end mt-12 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[480px] aspect-square"
              >
                {/* Main Abstract Shape - White Rounded Square */}
                <div className="relative w-full h-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-orange-500/10 border border-slate-100 dark:border-slate-800 overflow-hidden">
                   {/* Subtle Inner Grid */}
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                   
                   {/* Abstract Resume Representation */}
                   <div className="absolute inset-0 p-12 flex flex-col gap-6 opacity-60">
                     <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                       <div className="space-y-3 flex-1">
                         <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                         <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                       </div>
                     </div>
                     <div className="space-y-4 pt-8">
                       <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                       <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                       <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                     </div>
                   </div>
                </div>

                {/* Floating Card 1: ATS Score (Top Left) */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 sm:-left-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 z-20"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                     <Target className="text-emerald-500 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-0.5">ATS Score</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white leading-none">98/100</p>
                  </div>
                </motion.div>

                {/* Floating Card 2: Job Offer (Bottom Right) */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -right-2 sm:-right-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 z-20"
                >
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-[#f16529]">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-0.5">New Offer</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Senior Designer</p>
                  </div>
                </motion.div>

                {/* Floating Card 3: Resume File (Middle Right) */}
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-1/2 -right-6 sm:-right-10 transform -translate-y-1/2 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 flex items-center gap-3"
                >
                   <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500">
                      <FileText size={20} />
                   </div>
                   <div className="space-y-2 pr-2">
                      <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="h-2 w-6 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/30 text-[#f16529] dark:text-orange-400 text-sm font-medium border border-orange-100 dark:border-orange-800">
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
                    <CheckCircle2 className="text-[#f16529] flex-shrink-0" size={20} />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-3xl transform rotate-3 scale-95 -z-10"></div>
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
                  <Link to="/cover-letter" className="bg-[#f16529] hover:bg-[#e44d26] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#f16529]/20 hover:scale-105 active:scale-95 transition-all">
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
            <Link to="/blog" className="hidden sm:flex items-center gap-2 text-[#f16529] font-medium hover:gap-3 transition-all">
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
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#f16529] transition-colors line-clamp-2">
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
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#f16529] font-medium">
              {language === 'ar' ? 'عرض كل المقالات' : 'View all articles'}
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display mb-6">
              {language === 'ar' ? 'دراسات حالة ومراجعات مستقلة' : 'Case Studies & Independent Reviews'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {language === 'ar' 
                ? 'اكتشف كيف ساعدت منصتنا الآلاف في الحصول على وظائف أحلامهم في كبرى الشركات التقنية.' 
                : 'Discover how our platform has helped thousands land their dream jobs at top tech companies.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "Google",
                role: "Senior Software Engineer",
                increase: "+45%",
                metric: language === 'ar' ? 'زيادة في الردود' : 'Interview Rate',
                story: language === 'ar' 
                  ? 'بعد استخدام Hash Resume لتحديث سيرتي الذاتية، ارتفعت نسبة الردود على طلبات التوظيف بشكل ملحوظ.'
                  : 'After using Hash Resume to optimize my CV for ATS, my interview callback rate increased significantly.'
              },
              {
                company: "Microsoft",
                role: "Product Manager",
                increase: "2x",
                metric: language === 'ar' ? 'سرعة التوظيف' : 'Faster Hiring',
                story: language === 'ar'
                  ? 'ميزة إنشاء الرسائل التعريفية بالذكاء الاصطناعي وفرت علي ساعات من الكتابة لكل طلب توظيف.'
                  : 'The AI cover letter generator saved me hours of writing for each application.'
              },
              {
                company: "Amazon",
                role: "Data Scientist",
                increase: "100%",
                metric: language === 'ar' ? 'تخطي نظام ATS' : 'ATS Pass Rate',
                story: language === 'ar'
                  ? 'تحليل ATS ساعدني في اكتشاف الكلمات المفتاحية المفقودة التي كانت تمنع سيرتي من الوصول للمدراء.'
                  : 'The ATS audit helped me discover missing keywords that were preventing my resume from reaching managers.'
              }
            ].map((study, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-bold text-slate-900 dark:text-white text-xl">{study.company}</div>
                  <div className="text-sm font-medium text-[#f16529] dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                    {study.role}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{study.increase}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">{study.metric}</div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">"{study.story}"</p>
              </div>
            ))}
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
                <Logo className="w-10 h-10 text-[#f16529] mb-2" />
                <span className="text-2xl font-black text-white font-display">Hash Resume</span>
                <span className="text-sm text-slate-500 mt-1">A part of Hash Social Media Marketing Agency</span>
              </div>
              <p className="text-sm max-w-sm">{t.footerDesc}</p>
            </div>
            <div className="flex flex-col md:items-end">
              <h4 className="text-white font-semibold mb-4">{t.connect}</h4>
              <div className="flex gap-4 mb-8">
                <a href="https://www.facebook.com/hashsocialmarketing" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#f16529] transition-colors" aria-label="Facebook">
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
