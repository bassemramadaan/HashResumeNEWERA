import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Plus,
  Search,
  Sparkles,
  Layout,
  ArrowUp,
  PenTool,
} from "lucide-react";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import SmallWallOfLove from "../components/SmallWallOfLove";
import SarIcon from "../components/payment/SarIcon";
import AedIcon from "../components/payment/AedIcon";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import { blogPosts } from "../data/blogPosts";

import Navbar from "../components/Navbar";

export default function LandingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  // Fixed count as requested
  const displayCount = "1k";

  const currencies = {
    EGP: { symbol: "EGP", price: 25 },
    SAR: {
      symbol: <SarIcon className="w-[1em] h-[1em] inline-block shrink-0" />,
      price: 2,
    },
    AED: {
      symbol: <AedIcon className="w-[1em] h-[1em] inline-block shrink-0" />,
      price: 2,
    },
    EUR: { symbol: "€", price: 1 },
    USD: { symbol: "$", price: 1 },
  };

  const [currency, setCurrency] = useState<keyof typeof currencies>("EGP");
  const selectedCurrency = currencies[currency];

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 selection:text-indigo-900 :bg-indigo-900 :text-indigo-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute end-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-10 blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
            {/* Left Column: Text & CTA */}
            <div className="flex-1 text-center lg:text-start rtl:lg:text-end">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#ff4d2d] text-xs font-bold uppercase tracking-wider mb-8 border border-orange-100 shadow-sm"
              >
                <Zap size={16} className="fill-current" />
                <span>{t.aiPowered}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display mb-6"
              >
                <span className="text-slate-900 block text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-2">
                  {t.heroTitle1}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d2d] to-orange-600">
                    {t.heroTitle2}
                  </span>
                </span>
                <span className="text-slate-400 block text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  {t.heroTitle3}
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-600 mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                {t.heroSubtitle}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex items-center justify-center lg:justify-start gap-4 mb-8"
              >
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-6 h-6 text-amber-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900">4.9/5</span> {t.reviews}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row flex-wrap items-center lg:justify-start justify-center gap-4 mb-12"
              >
                <Link
                  to="/editor"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#ff4d2d] to-orange-600 hover:from-[#e63e1d] hover:to-orange-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-4 group hover:scale-105 active:scale-95"
                >
                  <Plus size={24} />
                  {t.startFromScratch}
                </Link>
                <Link
                  to="/templates"
                  className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 hover:border-[#ff4d2d] :border-orange-500 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-sm flex items-center justify-center gap-4 group hover:scale-105 active:scale-95"
                >
                  <Layout
                    size={24}
                    className="text-slate-400 group-hover:text-[#ff4d2d] transition-colors"
                  />
                  {t.chooseTemplate}
                </Link>
              </motion.div>

              {/* Stats Section */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                {[
                  {
                    icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
                    text: t.interviewIncrease,
                  },
                  {
                    icon: <Clock className="w-6 h-6 text-blue-500" />,
                    text: t.timeSaved,
                  },
                  {
                    icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
                    text: t.atsPassRate,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm"
                  >
                    {stat.icon}
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                      {stat.text}
                    </span>
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
                <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
                  <div className="p-8 flex-1 flex flex-col gap-6">
                    {/* Header Mockup */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-4/5 bg-slate-100 rounded-lg" />
                        <div className="h-4 w-1/2 bg-slate-50 rounded-lg" />
                      </div>
                    </div>
                    {/* Content Mockup */}
                    <div className="space-y-4">
                      <div className="h-2 w-full bg-slate-50 rounded-lg" />
                      <div className="h-2 w-full bg-slate-50 rounded-lg" />
                      <div className="h-2 w-2/3 bg-slate-50 rounded-lg" />
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-50 rounded-lg" />
                        <div className="h-2 w-4/5 bg-slate-50 rounded-lg" />
                      </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-50" />
                        <div className="w-8 h-8 rounded-lg bg-slate-50" />
                      </div>
                      <div className="h-8 w-24 bg-orange-500/10 rounded-full" />
                    </div>
                  </div>

                  {/* Editor UI Elements Overlay */}
                  <div className="absolute top-4 start-4 end-4 flex justify-between items-center bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-200/50 z-30">
                    <div className="flex gap-2">
                      <div className="w-4 h-4 rounded-full bg-rose-400"></div>
                      <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                      <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-slate-200 rounded-lg"></div>
                      <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: ATS Score */}
                <motion.div
                  animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 -end-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 z-30"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-slate-100"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray="125.6"
                        strokeDashoffset="12.56"
                        className="text-emerald-500"
                      />
                    </svg>
                    <span className="absolute text-xs font-bold text-slate-900">
                      95
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {t.atsScore}
                    </p>
                    <p className="text-xs text-emerald-500 font-medium">
                      {t.excellent}
                    </p>
                  </div>
                </motion.div>

                {/* Floating Badge 2: Users */}
                <motion.div
                  animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute bottom-12 -start-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 z-30"
                >
                  <div className="flex -space-x-4 rtl:space-x-reverse">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"
                      ></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {displayCount} {t.joinedThisMonth.includes("inscrit") || t.joinedThisMonth.includes("user") ? "utilisateurs" : "مستخدم"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.joinedThisMonth}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <SmallWallOfLove />

      {/* ATS Audit Showcase */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2rem] blur-3xl -z-10"></div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden">
                {/* Mockup of ATS Audit */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Target className="text-indigo-500" size={24} />
                    <span className="font-bold text-slate-900">
                      {t.atsAuditReport}
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full">
                    95/100
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <CheckCircle2 className="text-emerald-500" size={24} />
                      <span className="text-sm font-bold text-slate-900">
                        {t.keywordsMatched}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Node.js", "TypeScript", "AWS", "Agile"].map(
                        (kw) => (
                          <span
                            key={kw}
                            className="px-2 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100"
                          >
                            {kw}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <TrendingUp className="text-indigo-500" size={24} />
                      <span className="text-sm font-bold text-slate-900">
                        {t.improvementSuggestions}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <p className="text-xs text-slate-600">
                          {t.quantifiableMetrics}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <p className="text-xs text-slate-600 text-emerald-600 font-medium line-through opacity-50">
                          {t.missingLinkedin}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Score Improvement */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="absolute bottom-6 end-6 bg-[#ff4d2d] text-white p-4 rounded-2xl shadow-xl flex flex-col items-center"
                >
                  <span className="text-xs font-bold uppercase tracking-widest mb-1">
                    {t.scoreBoost}
                  </span>
                  <span className="text-3xl font-black">+40%</span>
                </motion.div>
              </div>
            </div>

            <div className="flex-1 space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#ff4d2d] text-sm font-bold border border-orange-100">
                <Target size={16} />
                {t.beatAts}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-display leading-tight">
                {t.resumesHumansLove}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t.atsDescription}
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Search size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">
                      {t.keywordAnalysis}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {t.keywordAnalysisDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Layout size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">
                      {t.compliantStructure}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {t.compliantStructureDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hash Hunt Integration Section */}
      <section className="py-24 bg-white text-slate-900 overflow-hidden relative">
        {/* Subtle Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8">
                <Sparkles className="w-4 h-4" />
                {t.newHashHunt}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] tracking-tight text-slate-900">
                {t.hashHuntTagline}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                {t.hashHuntDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  {
                    title: t.oneClickApply,
                    desc: t.oneClickApplyDesc,
                    icon: Target,
                  },
                  {
                    title: t.unifiedProfile,
                    desc: t.unifiedProfileDesc,
                    icon: Layout,
                  },
                  {
                    title: t.smartAlerts,
                    desc: t.smartAlertsDesc,
                    icon: Zap,
                  },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                      <item.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/hash-hunt"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:-translate-y-1 flex items-center justify-center gap-4"
                >
                  <Search size={20} />
                  {t.exploreHashHunt}
                </Link>
                <Link
                  to="/editor"
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-base transition-all hover:border-indigo-300 hover:-translate-y-1 flex items-center justify-center gap-4"
                >
                  <PenTool size={20} />
                  {t.createResumeFirst}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative lg:h-[600px] flex items-center justify-center perspective-1000"
            >
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-md aspect-[4/5] bg-white backdrop-blur-2xl border border-slate-100 rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200 transform-style-3d group"
              >
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent bg-gradient-to-b from-indigo-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" style={{ maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }}></div>

                {/* Mock UI Header */}
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-inner">
                      <Sparkles className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">{t.hashHuntMatch}</div>
                      <div className="text-xs text-emerald-600 font-bold tracking-wide uppercase mt-2">98% {t.compatibility}</div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  </div>
                </div>

                {/* Mock UI Content */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                      className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group/item"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0 group-hover/item:bg-indigo-50 transition-colors" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-slate-200 rounded-full group-hover/item:bg-indigo-200 transition-colors" />
                        <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                      </div>
                      <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover/item:border-indigo-200 group-hover/item:bg-indigo-50 transition-all">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600 group-hover/item:-rotate-45 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating Notification */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute -bottom-8 -start-8 -end-8 bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-2xl shadow-2xl shadow-indigo-900/20 border border-indigo-400/30 flex items-center gap-4 z-20"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/20">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm mb-2">{t.interviewRequest}</div>
                    <div className="text-indigo-100 text-xs font-medium">{t.interviewRequestDesc}</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display tracking-tight">
              {t.pricingTitle}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t.pricingSubtitle}
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-2 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner backdrop-blur-sm">
              {Object.keys(currencies).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c as keyof typeof currencies)}
                  className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${currency === c ? "bg-white text-[#ff4d2d] shadow-md ring-1 ring-black/5 " : "text-slate-500 hover:text-slate-700 :text-slate-200"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 max-w-5xl mx-auto">
            {/* Competitor Comparison */}
            <div className="w-full max-w-md bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
                {t.whyChooseUs}
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">
                    Zety / Resume.io
                  </span>
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    {currency === "EGP" ? (
                      <>
                        {15 * selectedCurrency.price} -{" "}
                        {25 * selectedCurrency.price} {selectedCurrency.symbol}
                      </>
                    ) : (
                      <>
                        {selectedCurrency.symbol}
                        {15 * selectedCurrency.price} -{" "}
                        {25 * selectedCurrency.price}
                      </>
                    )}{" "}
                    / {t.month}
                  </span>
                </div>
                <div className="h-px bg-slate-200 w-full"></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Canva Pro</span>
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    {currency === "EGP" ? (
                      <>
                        {(12.99 * selectedCurrency.price).toFixed(2)}{" "}
                        {selectedCurrency.symbol}
                      </>
                    ) : (
                      <>
                        {selectedCurrency.symbol}
                        {(12.99 * selectedCurrency.price).toFixed(2)}
                      </>
                    )}{" "}
                    / {t.month}
                  </span>
                </div>
                <div className="h-px bg-slate-200 w-full"></div>
                <div className="flex items-center justify-between">
                  <span className="text-[#ff4d2d] font-bold text-lg">
                    Hash Resume
                  </span>
                  <span className="text-[#ff4d2d] font-black text-xl flex items-center gap-2">
                    {currency === "EGP" ? (
                      <>
                        {selectedCurrency.price} {selectedCurrency.symbol}
                      </>
                    ) : (
                      <>
                        {selectedCurrency.symbol}
                        {selectedCurrency.price}
                      </>
                    )}{" "}
                    / {t.download}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-8 text-center">
                {t.noSubscriptions}
              </p>
            </div>

            {/* Single Download Plan */}
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-[#ff4d2d] overflow-hidden group hover:scale-105 transition-transform duration-300 w-full max-w-md">
              <div className="absolute top-0 end-0 bg-[#ff4d2d] text-white text-xs font-bold px-4 py-2 rounded-es-2xl uppercase tracking-wider">
                {t.mostPopular}
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  {t.singleDownload}
                </h3>

                <div className="flex flex-col items-center justify-center gap-2 mb-2">
                  <span className="text-5xl font-black text-[#ff4d2d] flex items-center gap-2">
                    {currency === "EGP" ? (
                      <>
                        {selectedCurrency.price} {selectedCurrency.symbol}
                      </>
                    ) : (
                      <>
                        {selectedCurrency.symbol}
                        {selectedCurrency.price}
                      </>
                    )}
                  </span>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                    <CheckCircle2 size={16} />
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
                  t.noHiddenFees,
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700">
                    <CheckCircle2
                      className="text-[#ff4d2d] shrink-0 mt-0"
                      size={24}
                    />
                    <span className="text-sm leading-tight font-medium">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/templates"
                className="block w-full bg-[#ff4d2d] hover:bg-[#e63e1d] text-white text-center font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                {t.getStartedNow}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Latest Blog Posts */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
                {t.latestBlog}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                {t.blogSubtitle}
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden sm:flex items-center gap-2 text-[#ff4d2d] font-medium hover:gap-4 transition-all"
            >
              {t.viewAllArticles}
              <ArrowRight size={24} className="rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <Link
                  to={`/blog/${post.id}`}
                  className="block overflow-hidden rounded-2xl mb-4 h-48 relative"
                >
                  <img
                    src={post.image}
                    alt={post.title[language]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {post.readTime[language]}
                  </span>
                </div>
                <Link to={`/blog/${post.id}`} className="block mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#ff4d2d] transition-colors line-clamp-2">
                    {post.title[language]}
                  </h3>
                </Link>
                <p className="text-slate-600 text-sm line-clamp-2">
                  {post.excerpt[language]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#ff4d2d] font-medium"
            >
              {t.viewAllArticles}
              <ArrowRight size={24} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll to Top & Floating CTA */}
      <div className="fixed bottom-8 end-8 z-40 flex flex-col gap-4">
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-white text-slate-900 rounded-full shadow-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 :bg-slate-700 transition-all active:scale-90"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}

        <Link
          to="/editor"
          className="md:hidden bg-[#ff4d2d] text-white p-4 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center active:scale-90 transition-all"
        >
          <Plus size={24} />
        </Link>
      </div>

      <Footer />
    </div>
  );
}
