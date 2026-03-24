import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, CheckCircle2, ArrowRight, MessageCircle, Facebook, Instagram, AtSign, TrendingUp, Calendar, Clock, Target, Plus, Search, Sparkles, Layout, ArrowUp } from 'lucide-react';
import Logo from '../components/Logo';
import FAQ from '../components/FAQ';
import ProductShowcase from '../components/ProductShowcase';
import ParticleAnimation from '../components/ParticleAnimation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import FeedbackModal from '../components/FeedbackModal';
import SmallWallOfLove from '../components/SmallWallOfLove';
import SarIcon from '../components/payment/SarIcon';
import AedIcon from '../components/payment/AedIcon';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';
import { blogPosts } from '../data/blogPosts';


import Navbar from '../components/Navbar';

export default function LandingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Fixed count as requested
  const displayCount = "1k";

  const currencies = {
    EGP: { symbol: 'EGP', price: 25 },
    SAR: { symbol: <SarIcon className="w-[1em] h-[1em] inline-block shrink-0" />, price: 2 },
    AED: { symbol: <AedIcon className="w-[1em] h-[1em] inline-block shrink-0" />, price: 2 },
    EUR: { symbol: '€', price: 1 },
    USD: { symbol: '$', price: 1 },
  };

  const [currency, setCurrency] = useState<keyof typeof currencies>('EGP');
  const selectedCurrency = currencies[currency];

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-40 overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-slate-950 dark:to-slate-900">
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
                <span>{t.aiPowered}</span>
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
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                {t.heroSubtitle}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex items-center justify-center lg:justify-start gap-4 mb-10"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">4.9/5</span> from over 2,000+ reviews
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row flex-wrap items-center lg:justify-start justify-center gap-4 mb-12"
              >
                <Link to="/editor" className="w-full sm:w-auto bg-gradient-to-r from-[#f16529] to-orange-600 hover:from-[#e44d26] hover:to-orange-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95">
                   <Plus size={20} />
                   {t.startFromScratch}
                </Link>
                <Link to="/templates" className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-[#f16529] dark:hover:border-orange-500 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2 group hover:scale-105 active:scale-95">
                   <Layout size={20} className="text-slate-400 group-hover:text-[#f16529] transition-colors" />
                   {t.chooseTemplate}
                </Link>
              </motion.div>

              {/* Stats Section */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                {[
                  { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, text: t.interviewIncrease },
                  { icon: <Clock className="w-5 h-5 text-blue-500" />, text: t.timeSaved },
                  { icon: <ShieldCheck className="w-5 h-5 text-purple-500" />, text: t.atsPassRate },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
                  >
                    {stat.icon}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{stat.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Dynamic Resume Graphic */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end mt-12 lg:mt-0 perspective-1000">
              <motion.div
                initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
                whileInView={{ opacity: 1, rotateY: -10, rotateX: 5, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[380px] aspect-[3/4] transform-style-3d"
              >
                {/* Glassmorphism Backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10 animate-pulse"></div>
                
                {/* Main Resume Document Mockup */}
                <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
                  <div className="p-8 flex-1 flex flex-col gap-6">
                    {/* Header Mockup */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="h-3 w-1/2 bg-slate-50 dark:bg-slate-800/50 rounded" />
                      </div>
                    </div>
                    {/* Content Mockup */}
                    <div className="space-y-4">
                      <div className="h-2 w-full bg-slate-50 dark:bg-slate-800/50 rounded" />
                      <div className="h-2 w-full bg-slate-50 dark:bg-slate-800/50 rounded" />
                      <div className="h-2 w-2/3 bg-slate-50 dark:bg-slate-800/50 rounded" />
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-50 dark:bg-slate-800/50 rounded" />
                        <div className="h-2 w-5/6 bg-slate-50 dark:bg-slate-800/50 rounded" />
                      </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800" />
                        <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800" />
                      </div>
                      <div className="h-8 w-24 bg-orange-500/10 rounded-full" />
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
                        <Sparkles size={12} className="text-white" />
                      </div>
                    </div>
                  </div>
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
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.atsScore}</p>
                    <p className="text-xs text-emerald-500 font-medium">{t.excellent}</p>
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
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{displayCount} user</p>
                    <p className="text-xs text-slate-500">{t.joinedThisMonth}</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <SmallWallOfLove />

      <ProductShowcase />

      {/* ATS Audit Showcase */}
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2rem] blur-3xl -z-10"></div>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                {/* Mockup of ATS Audit */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Target className="text-indigo-500" size={20} />
                    <span className="font-bold text-slate-900 dark:text-white">{t.atsAuditReport}</span>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">95/100</div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle2 className="text-emerald-500" size={18} />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{t.keywordsMatched}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'TypeScript', 'AWS', 'Agile'].map(kw => (
                        <span key={kw} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md border border-emerald-100 dark:border-emerald-800/50">{kw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="text-indigo-500" size={18} />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{t.improvementSuggestions}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400">Add more quantifiable metrics to your experience descriptions.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 text-emerald-600 dark:text-emerald-400 font-medium line-through opacity-50">Missing LinkedIn profile URL.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Score Improvement */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="absolute bottom-6 right-6 bg-[#f16529] text-white p-4 rounded-2xl shadow-xl flex flex-col items-center"
                >
                  <span className="text-xs font-bold uppercase tracking-widest mb-1">{t.scoreBoost}</span>
                  <span className="text-3xl font-black">+40%</span>
                </motion.div>
              </div>
            </div>

            <div className="flex-1 space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/30 text-[#f16529] text-sm font-bold border border-orange-100 dark:border-orange-800">
                <Target size={16} />
                {t.beatAts}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white font-display leading-tight">
                {t.resumesHumansLove}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.atsDescription}
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Search size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t.keywordAnalysis}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.keywordAnalysisDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Layout size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t.compliantStructure}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.compliantStructureDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hash Hunt Integration Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'جديد: Hash Hunt' : 'New: Hash Hunt'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {language === 'ar' ? 'لا تبحث عن الوظائف، دعها تجدك.' : 'Don\'t hunt for jobs, let them find you.'}
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                {language === 'ar' 
                  ? 'بمجرد انتهائك من إنشاء سيرتك الذاتية، يمكنك إضافتها بضغطة زر واحدة إلى Hash Hunt. سيقوم أصحاب العمل برؤية ملفك الشخصي والتواصل معك مباشرة.' 
                  : 'Once you finish your resume, add it with one click to Hash Hunt. Employers will see your profile and contact you directly.'}
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { title: language === 'ar' ? 'تقديم بضغطة زر' : 'One-Click Apply', desc: language === 'ar' ? 'اربط سيرتك الذاتية مباشرة بطلبات التوظيف.' : 'Connect your resume directly to job applications.' },
                  { title: language === 'ar' ? 'ملف شخصي موحد' : 'Unified Profile', desc: language === 'ar' ? 'لا حاجة للتسجيل مرة أخرى، بياناتك جاهزة.' : 'No need to register again, your data is ready.' },
                  { title: language === 'ar' ? 'تنبيهات ذكية' : 'Smart Alerts', desc: language === 'ar' ? 'احصل على إشعارات عندما يهتم صاحب عمل بملفك.' : 'Get notified when an employer is interested in your profile.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-blue-100">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/hash-hunt" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95">
                  {language === 'ar' ? 'اكتشف Hash Hunt' : 'Explore Hash Hunt'}
                </Link>
                <Link to="/editor" className="px-8 py-4 bg-blue-500/30 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold text-lg transition-all hover:bg-blue-500/40">
                  {language === 'ar' ? 'أنشئ سيرتك الذاتية أولاً' : 'Create Your Resume First'}
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                <img 
                  src="https://picsum.photos/seed/dashboard/800/600" 
                  alt="Hash Hunt Dashboard" 
                  className="rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        HR
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Hash Recruiters</div>
                        <div className="text-sm text-slate-500">Active now</div>
                      </div>
                    </div>
                    <div className="text-slate-700 font-medium italic">
                      "We found our last 3 senior developers through Hash Hunt. The quality of resumes is outstanding."
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">
              {t.pricingTitle}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t.pricingSubtitle}
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner backdrop-blur-sm">
              {Object.keys(currencies).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c as keyof typeof currencies)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${currency === c ? 'bg-white dark:bg-slate-800 text-[#f16529] shadow-md ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 max-w-5xl mx-auto">
            {/* Competitor Comparison */}
            <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                {t.whyChooseUs}
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Zety / Resume.io</span>
                  <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1">
                    {currency === 'EGP' ? (
                      <>{15 * selectedCurrency.price} - {25 * selectedCurrency.price} {selectedCurrency.symbol}</>
                    ) : (
                      <>{selectedCurrency.symbol}{15 * selectedCurrency.price} - {25 * selectedCurrency.price}</>
                    )} / month
                  </span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Canva Pro</span>
                  <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1">
                    {currency === 'EGP' ? (
                      <>{(12.99 * selectedCurrency.price).toFixed(2)} {selectedCurrency.symbol}</>
                    ) : (
                      <>{selectedCurrency.symbol}{(12.99 * selectedCurrency.price).toFixed(2)}</>
                    )} / month
                  </span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>
                <div className="flex items-center justify-between">
                  <span className="text-[#f16529] font-bold text-lg">Hash Resume</span>
                  <span className="text-[#f16529] font-black text-xl flex items-center gap-1">
                    {currency === 'EGP' ? (
                      <>{selectedCurrency.price} {selectedCurrency.symbol}</>
                    ) : (
                      <>{selectedCurrency.symbol}{selectedCurrency.price}</>
                    )} / download
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 text-center">
                {t.noSubscriptions}
              </p>
            </div>

            {/* Single Download Plan */}
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-[#f16529] overflow-hidden group hover:scale-105 transition-transform duration-300 w-full max-w-md">
              <div className="absolute top-0 right-0 bg-[#f16529] text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                {t.mostPopular}
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  {t.singleDownload}
                </h3>

                <div className="flex flex-col items-center justify-center gap-2 mb-2">
                  <span className="text-5xl font-black text-[#f16529] flex items-center gap-2">
                    {currency === 'EGP' ? (
                      <>{selectedCurrency.price} {selectedCurrency.symbol}</>
                    ) : (
                      <>{selectedCurrency.symbol}{selectedCurrency.price}</>
                    )}
                  </span>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 size={14} />
                    {t.noSubscriptionPayOnce}
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  t.payOncePerResume,
                  t.includesPdfWord,
                  t.unlimitedFreeEdits,
                  t.allPremiumTemplates,
                  t.noWatermark,
                  t.noHiddenFees
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="text-[#f16529] shrink-0 mt-0.5" size={20} />
                    <span className="text-sm leading-tight font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/templates" 
                className="block w-full bg-[#f16529] hover:bg-[#e44d26] text-white text-center font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                {t.getStartedNow}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">
                {t.latestBlog}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                {t.blogSubtitle}
              </p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center gap-2 text-[#f16529] font-medium hover:gap-3 transition-all">
              {t.viewAllArticles}
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <Link to={`/blog/${post.id}`} className="block overflow-hidden rounded-2xl mb-4 h-48 relative">
                  <img 
                    src={post.image} 
                    alt={post.title[language]} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
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
              {t.viewAllArticles}
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Scroll to Top & Floating CTA */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-90"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
        
        <Link 
          to="/editor" 
          className="md:hidden bg-[#f16529] text-white p-4 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center active:scale-90 transition-all"
        >
          <Plus size={24} />
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12 border-t border-slate-800 pb-safe">
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

              <h4 className="text-white font-semibold mb-4 mt-8">{t.product}</h4>
              <ul className="space-y-2 text-sm md:text-right">
                <li><Link to="/templates" className="hover:text-white transition-colors">{t.resumeBuilder || 'Resume Builder'}</Link></li>
                <li><Link to="/cover-letter" className="hover:text-white transition-colors">{t.coverLetter || 'Cover Letter'}</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">{t.blog || 'Blog'}</Link></li>
                <li><Link to="/hash-hunt" className="hover:text-white transition-colors">{t.hashHuntJobs || 'Hash Hunt'}</Link></li>
                <li>
                  <button 
                    onClick={() => setShowFeedbackModal(true)} 
                    className="hover:text-white transition-colors text-left w-full md:text-right"
                  >
                    {t.feedback}
                  </button>
                </li>
              </ul>

              <h4 className="text-white font-semibold mb-4 mt-8">{language === 'ar' ? 'الثقة والأمان' : 'Trust & Safety'}</h4>
              <ul className="space-y-2 text-sm md:text-right">
                <li><Link to="/privacy" className="hover:text-white transition-colors">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
                <li><Link to="/how-ats-works" className="hover:text-white transition-colors">{language === 'ar' ? 'كيف يعمل ATS' : 'How ATS Works'}</Link></li>
                <li><Link to="/why-no-signup" className="hover:text-white transition-colors">{language === 'ar' ? 'لماذا لا نطلب التسجيل؟' : 'Why No Sign-up?'}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} {t.rightsReserved}</p>
            <div className="flex items-center gap-6">
              <LanguageSwitcher size={16} variant="ghost" className="px-0 py-0" />
              <p>{t.privateFooter}</p>
            </div>
          </div>
        </div>
      </footer>
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </div>
  );
}
