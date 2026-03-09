import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Zap, FileText, CheckCircle2, ArrowRight, MessageCircle, Facebook, Instagram, AtSign, PenTool, TrendingUp, Users, Calendar, Clock, Target, Plus, Briefcase, GraduationCap, Search, Sparkles, Layout, Download, User } from 'lucide-react';
import Logo from '../components/Logo';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';
import WizardShowcase from '../components/WizardShowcase';
import BeforeAfter from '../components/BeforeAfter';
import ProductShowcase from '../components/ProductShowcase';
import ParticleAnimation from '../components/ParticleAnimation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import FeedbackModal from '../components/FeedbackModal';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';
import { blogPosts } from '../data/blogPosts';

import { useScrollDirection } from '../hooks/useScrollDirection';

export default function LandingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { scrollDirection, isScrolled } = useScrollDirection();

  // Fixed count as requested
  const displayCount = "50,000";

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
      <div 
        className={`sticky left-0 right-0 flex justify-center z-50 px-4 pointer-events-none mb-8 transition-all duration-500 ease-in-out ${
          scrollDirection === 'down' && isScrolled ? '-top-24 opacity-0' : 'top-6 opacity-100'
        }`}
      >
        <nav className="pointer-events-auto flex items-center gap-3 p-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] max-w-full overflow-x-auto scrollbar-hide">
          
          {/* Logo / Home */}
          <Link to="/" className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#f16529] hover:scale-105 transition-transform shrink-0">
            <Logo className="w-7 h-7" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center px-2 gap-1">
            <a href="#features" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all whitespace-nowrap">{t.features}</a>
            <a href="#process" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all whitespace-nowrap">{t.howItWorks}</a>
            <a href="#pricing" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all whitespace-nowrap">{language === 'ar' ? 'الأسعار' : 'Pricing'}</a>
            <Link to="/templates" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-full transition-all whitespace-nowrap">{t.templates}</Link>
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
            to="/templates" 
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
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-40 overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-slate-950 dark:to-slate-900">
        <ParticleAnimation />
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#f16529] opacity-20 blur-[100px] animate-pulse"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-10 blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Column: Text & CTA */}
            <div className="flex-1 text-center lg:text-left rtl:lg:text-right">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-[#f16529] text-xs font-bold uppercase tracking-wider mb-6 border border-orange-100 dark:border-orange-800/30 shadow-sm"
              >
                <Zap size={14} className="fill-current" />
                <span>AI-Powered Resume Builder</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display mb-6"
              >
                <span className="text-slate-900 dark:text-white block text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-2">
                  {t.heroTitle1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f16529] to-orange-600">{t.heroTitle2}</span>
                </span>
                <span className="text-slate-400 dark:text-slate-500 block text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  {t.heroTitle3}
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                {t.heroSubtitle}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 mb-12"
              >
                <Link to="/templates" className="w-full sm:w-auto bg-gradient-to-r from-[#f16529] to-orange-600 hover:from-[#e44d26] hover:to-orange-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95">
                  {t.buildResume}
                  <ArrowRight size={20} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/cover-letter" className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 group hover:scale-105 active:scale-95">
                  <PenTool size={20} className="text-[#f16529]" />
                  {t.createCoverLetter}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-8 text-slate-500 dark:text-slate-400 text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  </div>
                  <span>ATS-Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-purple-500" />
                  </div>
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-blue-500" />
                  </div>
                  <span>Free Templates</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Dynamic Resume Graphic */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end mt-12 lg:mt-0 perspective-1000">
              <motion.div
                initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
                whileInView={{ opacity: 1, rotateY: -10, rotateX: 5, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[480px] aspect-[3/4] transform-style-3d"
              >
                {/* Glassmorphism Backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10 animate-pulse"></div>
                
                {/* Main Resume Document */}
                <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
                  <div className="flex-1 p-6 flex flex-col gap-4">
                    {/* Header Mockup */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                      </div>
                    </div>
                    
                    {/* Experience Section Mockup */}
                    <div className="space-y-4">
                      <div className="h-4 bg-indigo-50 dark:bg-indigo-900/30 rounded w-1/4 mb-2"></div>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                        </div>
                      ))}
                    </div>

                    {/* Skills Section Mockup */}
                    <div className="mt-6">
                      <div className="h-4 bg-indigo-50 dark:bg-indigo-900/30 rounded w-1/4 mb-4"></div>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-16"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Editor UI Elements Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 z-30">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                      <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
                        <Download size={12} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Mockup */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-20 gap-6 z-20">
                    <User size={18} className="text-indigo-500" />
                    <Briefcase size={18} className="text-slate-400" />
                    <GraduationCap size={18} className="text-slate-400" />
                    <Target size={18} className="text-slate-400" />
                  </div>
                  
                  {/* Scanning Line Animation */}
                  <motion.div 
                    animate={{ top: ['-10%', '110%', '-10%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-[#f16529]/20 to-transparent border-b border-[#f16529]/50 z-40 pointer-events-none"
                    style={{ top: '0%' }}
                  />
                </div>

                {/* Floating Badge 1: ATS Score */}
                <motion.div 
                  animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 flex items-center gap-4 z-30"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset="12.56" className="text-emerald-500" />
                    </svg>
                    <span className="absolute text-xs font-bold text-slate-900 dark:text-white">95</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">ATS Score</p>
                    <p className="text-xs text-emerald-500 font-medium">Excellent</p>
                  </div>
                </motion.div>

                {/* Floating Badge 2: Users */}
                <motion.div 
                  animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-12 -left-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 flex items-center gap-4 z-30"
                >
                  <div className="flex -space-x-3 rtl:space-x-reverse">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700"></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{displayCount}+ Users</p>
                    <p className="text-xs text-slate-500">Joined this month</p>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: t.feature1Title, desc: t.feature1Desc, color: "from-orange-400 to-[#f16529]", bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-[#f16529]" },
              { icon: ShieldCheck, title: t.feature2Title, desc: t.feature2Desc, color: "from-slate-400 to-slate-600", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },
              { icon: FileText, title: t.feature3Title, desc: t.feature3Desc, color: "from-orange-400 to-[#f16529]", bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-[#f16529]" },
              { icon: CheckCircle2, title: t.feature4Title, desc: t.feature4Desc, color: "from-slate-400 to-slate-600", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },
              { icon: Sparkles, title: "AI Content Generation", desc: "Overcome writer's block with our AI assistant that generates professional summaries and bullet points tailored to your industry.", color: "from-orange-400 to-[#f16529]", bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-[#f16529]" },
              { icon: Layout, title: "Multiple Premium Templates", desc: "Choose from a variety of professionally designed templates that stand out while remaining ATS-compliant and easy to read.", color: "from-slate-400 to-slate-600", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 dark:opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out`}></div>
                <div className={`w-14 h-14 ${feature.bg} ${feature.text} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ring-1 ring-inset ring-black/5 dark:ring-white/5`}>
                  <feature.icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[#f16529] transition-colors duration-300">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BeforeAfter />
      <ProductShowcase />

      {/* Cover Letter Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-[#f16529] dark:text-orange-400 text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm">
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

      {/* Hash Hunt Section */}
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                <Briefcase size={16} />
                {language === 'ar' ? 'جديد' : 'New Feature'}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display leading-tight">
                {language === 'ar' ? 'دع الوظائف تبحث عنك مع Hash Hunt' : 'Let the jobs find you with Hash Hunt'}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'لا تكتفِ بإنشاء سيرة ذاتية رائعة. انضم إلى مجموعة المواهب الحصرية الخاصة بنا ودع الشركات الشريكة لنا تتواصل معك مباشرة.' 
                  : 'Don\'t just build a great resume. Join our exclusive talent pool and let our partner companies reach out to you directly.'}
              </p>
              <ul className="space-y-4">
                {[
                  language === 'ar' ? 'وصول مباشر لمديري التوظيف' : 'Direct access to hiring managers',
                  language === 'ar' ? 'وظائف حصرية غير معلنة' : 'Exclusive unlisted roles',
                  language === 'ar' ? 'مجاني 100% للباحثين عن عمل' : '100% free for job seekers'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 shrink-0" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                to="/hash-hunt" 
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
              >
                {language === 'ar' ? 'استكشف Hash Hunt' : 'Explore Hash Hunt'}
                <ArrowRight size={20} className="rtl:rotate-180" />
              </Link>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                    <Search className="text-indigo-600 dark:text-indigo-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Senior Product Designer</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">TechNova Solutions • Remote</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-5/6"></div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-4/5"></div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">Figma</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">UI/UX</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">Design Systems</span>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
              {language === 'ar' ? 'باقات الأسعار' : 'Simple, Transparent Pricing'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {language === 'ar' ? 'ادفع فقط عندما تكون جاهزاً للتحميل. لا توجد رسوم خفية.' : 'Pay only when you\'re ready to download. No hidden fees.'}
            </p>
          </div>

          <div className="flex justify-center max-w-4xl mx-auto">
            {/* Single Download Plan */}
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-[#f16529] overflow-hidden group hover:scale-105 transition-transform duration-300 w-full max-w-md">
              <div className="absolute top-0 right-0 bg-[#f16529] text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                {language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'ar' ? 'تحميل واحد' : 'Single Download'}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-5xl font-black text-[#f16529]">25 EGP</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  language === 'ar' ? 'تحميل بصيغة PDF عالية الجودة' : 'High-quality PDF Download',
                  language === 'ar' ? 'تحميل بصيغة Word قابلة للتعديل' : 'Editable Word Download',
                  language === 'ar' ? 'قوالب احترافية مميزة' : 'Premium Professional Templates',
                  language === 'ar' ? 'بدون علامة مائية' : 'No Watermark'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="text-[#f16529] shrink-0" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/templates" 
                className="block w-full bg-[#f16529] hover:bg-[#e44d26] text-white text-center font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                {language === 'ar' ? 'ابدأ الآن' : 'Get Started Now'}
              </Link>
            </div>
          </div>
        </div>
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
                <li><Link to="/templates" className="hover:text-white transition-colors">{t.resumeBuilder}</Link></li>
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
