import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "../components/Footer";
import InterviewCoach from "../components/InterviewCoach";
import { useLanguageStore } from "../store/useLanguageStore";
import { Link } from "react-router-dom";
import { Sparkles, AlertCircle, ArrowLeft, ArrowRight, Compass, Rocket, GraduationCap, ArrowUpRight } from "lucide-react";

export default function InterviewCoachPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans relative overflow-hidden ${isAr ? "rtl" : "ltr"}`}>
      
      {/* Background Ambience Mesh Lights */}
      <div className="absolute top-[8%] left-[-15%] w-[500px] h-[500px] bg-gradient-to-tr from-[#FF4D2D]/[0.03] to-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[25%] right-[-10%] w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/[0.04] to-orange-400/[0.02] rounded-full blur-3xl pointer-events-none" />

      <Helmet>
        <title>
          {isAr
            ? "محاكي المقابلات الشخصية الذكي بالذكاء الاصطناعي | Hash Resume"
            : "AI Interview Practice Hub & Coach | Hash Resume"}
        </title>
        <meta
          name="description"
          content={
            isAr
              ? "تفوق في مقابلة العمل القادمة مع مستشار تفاعلي يولد أسئلة سلوكية وفنية مخصصة بمقاييس STAR المعتمدة."
              : "Master your upcoming job interview with an intelligent AI coach generating custom situational questions tailor-made for you."
          }
        />
      </Helmet>

      {/* Main Global Navbar */}
      <Navbar />

      {/* Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 py-10 md:py-16 relative z-10 space-y-10">
        
        {/* EXQUISITE MULTI-DIRECTIONAL SUB-NAVBAR (Resolves SPA Navigation Friction) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-3 px-4 shadow-3xs select-none">
          <div className="flex items-center gap-2">
            <Compass size={14} className="text-[#FF4D2D] animate-spin-slow" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">
              {isAr ? "طرق التنقل السريعة" : "Rapid transition pathways"}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Link 
              to="/" 
              className="text-[11px] font-black text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 hover:underline"
            >
              {isAr ? (
                <>
                  <ArrowLeft size={12} className="text-[#FF4D2D]" />
                  <span>العودة للرئيسية</span>
                </>
              ) : (
                <>
                  <ArrowLeft size={12} className="text-[#FF4D2D]" />
                  <span>Back to Home</span>
                </>
              )}
            </Link>

            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />

            <Link 
              to="/editor" 
              className="text-[11px] font-black text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1.5 hover:underline"
            >
              {isAr ? (
                <>
                  <span>محرر السيرة الذاتية</span>
                  <ArrowRight size={12} className="text-indigo-600" />
                </>
              ) : (
                <>
                  <span>Resume Editor</span>
                  <ArrowRight size={12} className="text-indigo-600" />
                </>
              )}
            </Link>
          </div>
        </div>

        {/* HERO TITLE AREA */}
        <div className="text-center max-w-3xl mx-auto space-y-4 select-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#FF4D2D]/20 text-[#FF4D2D] text-[10px] font-black uppercase tracking-wider shadow-2xs">
            <Sparkles size={11} className="text-[#FF4D2D] animate-pulse" />
            <span>{isAr ? "مستشار الاستعداد المهني الذكي" : "PREMIUM RECRUITMENT SIMULATOR"}</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-[40px] font-black text-slate-950 tracking-tight leading-none">
            {isAr ? (
              <>
                تفوق في مقابلتك القادمة وتحدّث <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] to-indigo-600">بثقة وثبات</span>
              </>
            ) : (
              <>
                Conquer Your Looming Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D2D] to-indigo-600">With Absolute Calm</span>
              </>
            )}
          </h1>
          
          <p className="text-slate-500 text-xs sm:text-[13px] font-semibold leading-relaxed max-w-xl mx-auto">
            {isAr
              ? "لا داعي للقلق من التلعثم أو طبيعة الأسئلة بعد اليوم. تدرب عملياً على سيناريوهات سلوكية مصممة خصيصاً لخلفيتك المهنية، لترفع من طلاقتك ومظهرك الكلي بنسبة 300%."
              : "No staging fright or unpredictable triggers. Practice live situational variables calibrated against real hiring matrices to significantly boost your callback metrics."}
          </p>
        </div>

        {/* HIGH-FASHION SPLIT CARDS (Quick Features) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none text-start max-w-4xl mx-auto">
          
          {/* Bento-card 1 */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-4.5 flex gap-3.5 items-start transition-all hover:border-slate-300 shadow-3xs hover:-translate-y-0.5 duration-350">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4D2D] flex items-center justify-center shrink-0 border border-orange-100">
              <Rocket size={17} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-850 text-xs sm:text-[13px]">
                {isAr ? "ملائمة ذكية فريدة" : "Role Configuration"}
              </h4>
              <p className="text-slate-450 text-[10px] sm:text-[11px] leading-normal font-medium">
                {isAr ? "مبني تماماً ليطابق لغة وسياق مسمى منصبك الوظيفي المستهدف." : "Matches technical vocabulary aligned with exact career roles."}
              </p>
            </div>
          </div>

          {/* Bento-card 2 */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-4.5 flex gap-3.5 items-start transition-all hover:border-slate-300 shadow-3xs hover:-translate-y-0.5 duration-350">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <GraduationCap size={17} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-850 text-xs sm:text-[13px]">
                {isAr ? "شروحات الأجوبة STAR" : "STAR Formulations"}
              </h4>
              <p className="text-slate-450 text-[10px] sm:text-[11px] leading-normal font-medium">
                {isAr ? "استعرض الطريقة النموذجية لتركيب تفاصيل الحدث، التحدي، الإجراء، والنتائج مجهرياً." : "Enables modular frameworks specifying real parameters of context and results."}
              </p>
            </div>
          </div>

          {/* Bento-card 3 */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-4.5 flex gap-3.5 items-start transition-all hover:border-slate-300 shadow-3xs hover:-translate-y-0.5 duration-350">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Sparkles size={17} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-850 text-xs sm:text-[13px]">
                {isAr ? "فحص وتهيئة ذاتية" : "Interactive Checklist"}
              </h4>
              <p className="text-slate-450 text-[10px] sm:text-[11px] leading-normal font-medium">
                {isAr ? "فحوصات ملموسة لبيئة إلقائك والتهيئة المثالية لتقليص توتر الدقائق الأولى." : "Direct contextual checklist ensuring maximum candidate readiness scores."}
              </p>
            </div>
          </div>

        </div>

        {/* CORE INTERACTIVE WORKSPACE COACH */}
        <div className="relative">
          <InterviewCoach />
        </div>

        {/* COMPREHENSIVE PRO ADVICE NOTICE */}
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between select-none shadow-md">
          <div className="flex gap-3.5 items-start text-start">
            <AlertCircle size={20} className="text-[#FF4D2D] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-black text-white text-xs sm:text-sm">
                {isAr ? "نصيحة المهنيين الذهبية؟" : "The Golden rule of interview practice:"}
              </h5>
              <p className="text-[11px] text-slate-300 font-semibold leading-relaxed max-w-2xl">
                {isAr
                  ? "التدرب المسموع بصوت مرتفع هو المحرك الوحيد للتغلب على رهبة الحديث. استفد من ميزة النطق الصوتي المدمجة، صغ إجابتك أولاً بصوت مرتفع، ثم طابقها مع السر المهني لمسؤولي التوظيف."
                  : "Speaking out loud is the ultimate shortcut to verbal calibration. Utilize our speak-aloud visualizer mode, practice your delivery structure, and cross-reference with our target HR secret notes."}
              </p>
            </div>
          </div>
          
          <Link 
            to="/editor"
            className="shrink-0 bg-[#FF4D2D] text-white hover:bg-[#E64528] transition-colors p-3 px-5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 font-sans"
          >
            <span>{isAr ? "ابدأ كتابة السيرة" : "Go to Resume Builder"}</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

      </main>

      {/* Global Page Footer */}
      <Footer />
    </div>
  );
}
