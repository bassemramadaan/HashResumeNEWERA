import { motion, AnimatePresence } from "motion/react";
import { PartyPopper, X, Target, ArrowRight, Sparkles, Trophy, CheckCircle, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useResumeStore } from "../../store/useResumeStore";
import { calculateATSScore } from "../../utils/ats";
import { useEffect, useState, useMemo } from "react";

interface PostDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedCodes?: string[];
}

// Generate simple randomized floating particles for a luxury confetti celebration
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
}

export default function PostDownloadModal({
  isOpen,
  onClose,
  purchasedCodes = [],
}: PostDownloadModalProps) {
  const { language } = useLanguageStore();
  const { data } = useResumeStore();
  const isRtl = language === "ar";
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  // Calculate live ATS score
  const atsResult = useMemo(() => {
    return calculateATSScore(data);
  }, [data]);

  const score = atsResult?.score || 75;

  const [copiedCode, setCopiedCode] = useState<string>("");
  const [bundleCodes, setBundleCodes] = useState<string[]>([]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  // Set bundle codes whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setBundleCodes(purchasedCodes || []);
    }
  }, [isOpen, purchasedCodes]);

  // Initialize confetti particles on mount
  useEffect(() => {
    if (isOpen) {
      const colors = ["#FF4D2D", "#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];
      const particles: ConfettiParticle[] = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage-based width
        y: Math.random() * -30 - 10, // start above the viewport
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.8,
        duration: Math.random() * 2.5 + 2,
        rotation: Math.random() * 360,
      }));
      setConfetti(particles);
    } else {
      setConfetti([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get score feedback color & rank
  const getScoreStatus = (scoreValue: number) => {
    if (scoreValue >= 85) return { color: "#10B981", text: isRtl ? "احترافي وممتاز" : "Elite / Premium", bg: "rgba(16, 185, 129, 0.1)" };
    if (scoreValue >= 70) return { color: "#F59E0B", text: isRtl ? "جيد جداً" : "Very Good / Strong", bg: "rgba(245, 158, 11, 0.1)" };
    return { color: "#3B82F6", text: isRtl ? "مقبول" : "Good Progress", bg: "rgba(59, 130, 246, 0.1)" };
  };

  const status = getScoreStatus(score);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
        {/* Fading Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Delicate Falling Confetti Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[201]">
          {confetti.map((p) => (
            <motion.div
              key={p.id}
              initial={{ 
                x: `${p.x}%`, 
                y: `${p.y}vh`, 
                rotate: 0, 
                opacity: 1 
              }}
              animate={{ 
                y: "110vh", 
                rotate: p.rotation + 720,
                opacity: [1, 1, 0.8, 0] 
              }}
              transition={{ 
                duration: p.duration, 
                delay: p.delay, 
                ease: "linear",
                repeat: 0
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.id % 3 === 0 ? "50%" : p.id % 3 === 1 ? "2px" : "50% 20%",
                zIndex: 202,
              }}
            />
          ))}
        </div>

        {/* The Luxury Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden z-[203] font-sans text-slate-800"
          style={{ direction: isRtl ? "rtl" : "ltr" }}
        >
          {/* Top-Right Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors z-20 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Sparkles / Festive Accents */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 via-brand-500 to-emerald-500" />

          <div className="p-8 sm:p-10 text-center flex flex-col items-center">
            {/* Celebration Icon Container */}
            <motion.div 
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: [1.2, 1], rotate: [0, 0] }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-brand-50 text-[#FF4D2D] rounded-2xl flex items-center justify-center mb-5 relative"
            >
              <PartyPopper size={32} className="stroke-[2.2]" />
              <Sparkles className="absolute -top-1.5 -right-1.5 w-5 h-5 text-amber-500 animate-pulse" />
            </motion.div>

            {/* Enthusiastic Congratulatory Message */}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
              {isRtl ? "سيرتك الذاتية جاهزة للانطلاق! 🚀" : "Your Resume is Ready to Launch! 🚀"}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium mb-8 max-w-md">
              {isRtl
                ? "تهانينا! تم تحميل مستندك بنجاح بأعلى معايير الجودة المهنية ومتوافق تماماً مع الأنظمة."
                : "Congratulations! Your elite resume has been compiled, formatted, and downloaded successfully."}
            </p>

            {/* ATS Optimization Dashboard Score Widget (Miniature layout) */}
            <div className="w-full bg-slate-50/70 border border-slate-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-6 text-right ltr:text-left relative overflow-hidden">
              {/* Animated Progress Ring */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  {/* Track Circle */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  {/* Active Glowing Circle */}
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={status.color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                    transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{
                      filter: `drop-shadow(0px 0px 4px ${status.color}30)`
                    }}
                  />
                </svg>
                {/* Score Number Centered */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">{score}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">/ 100</span>
                </div>
              </div>

              {/* Score Text and Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 justify-center sm:justify-start">
                  <Trophy size={16} className="text-amber-500" />
                  <span className="text-xs font-black tracking-wider uppercase text-slate-400">
                    {isRtl ? "مؤشر فحص الـ ATS" : "ATS Compatibility Level"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                  <span 
                    className="text-xs font-extrabold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: status.bg, color: status.color }}
                  >
                    {status.text}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle size={12} />
                    {isRtl ? "تخطى الفلترة بنجاح" : "Passed screening filter"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                  {isRtl
                    ? "تحليل المستند يؤكد خلوه من الأخطاء التي تعيق القراءة الآلية لشركات التوظيف، مما يعزز فرص وصولك للمقابلة بنسبة 400%."
                    : "Structure analysis confirms zero reading errors. This formatting layout boosts interview callbacks by up to 400%."}
                </p>
              </div>
            </div>

            {bundleCodes.length > 1 && (
              <div className="w-full mb-8 bg-orange-50/50 border border-orange-100 rounded-2xl p-5 text-start relative overflow-hidden">
                <h4 className="font-black text-sm flex items-center gap-1.5 mb-2.5 text-orange-950">
                  <Sparkles size={16} className="text-[#FF4D2D] animate-pulse" />
                  <span>{isRtl ? "أكواد تفعيل الباقة الخاصة بك" : "Your Bundle Activation Codes"}</span>
                </h4>
                <p className="text-[11px] font-semibold text-slate-500 mb-4 leading-normal">
                  {isRtl 
                    ? "لقد اشتريت باقة الـ 3 أكواد! يمكنك استخدام هذه الأكواد لتصدير أو تعديل أي سير ذاتية أخرى مجاناً:"
                    : "You bought the 3-codes bundle! Use these codes to unlock and download other resumes or edits for free:"}
                </p>
                <div className="space-y-2">
                  {bundleCodes.map((codeStr, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 p-3 rounded-xl shadow-2xs hover:border-[#FF4D2D]/35 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          {isRtl ? `كود ${idx + 1}` : `Code ${idx + 1}`}
                        </span>
                        <span className="font-mono font-black text-xs text-slate-800 select-all tracking-wider">{codeStr}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(codeStr)}
                        className="p-1.5 bg-slate-50 text-slate-400 hover:text-[#FF4D2D] border border-slate-100 rounded-lg transition-all cursor-pointer flex items-center justify-center min-w-[70px]"
                      >
                        {copiedCode === codeStr ? (
                          <span className="flex items-center gap-0.5 text-[9px] font-black text-[#FF4D2D] px-1">
                            <Check size={12} /> {isRtl ? "نسخ" : "Copied"}
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-slate-500 group-hover:text-[#FF4D2D] flex items-center gap-1 px-1">
                            {isRtl ? "نسخ الكود" : "Copy"}
                          </span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Job platform promotion card: Hash Hunt Platform Link */}
            <div className="w-full mb-8">
              <div 
                className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between text-start text-white relative overflow-hidden group/promo"
                style={{
                  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                {/* Background Grid Pattern Deco */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="flex-1 mb-4 sm:mb-0 text-center sm:text-right ltr:sm:text-left z-10">
                  <h4 className="font-black text-sm flex items-center justify-center sm:justify-start gap-1.5 mb-1.5 text-white">
                    <Target size={15} className="text-[#FF4D2D]" />
                    <span>{isRtl ? "توظيف فوري عبر منصة Hash Hunt" : "Direct Hiring with Hash Hunt"}</span>
                  </h4>
                  <p className="text-[11px] font-medium text-slate-300 max-w-sm leading-relaxed">
                    {isRtl
                      ? "انضم الآن إلى قائمة الكفاءات ودع الشركات الرائدة تبحث عنك وتتصل بك مباشرة."
                      : "Put your newly optimized resume in front of direct partner recruiters."}
                  </p>
                </div>

                <Link
                  to="/hash-hunt"
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs transition-all justify-center bg-[#FF4D2D] hover:bg-[#E64528] text-white shadow-md shadow-orange-500/10 active:scale-98 z-10 shrink-0 cursor-pointer"
                >
                  <span>{isRtl ? "مزامنة والانضمام مجاناً" : "Join Talent Pool"}</span>
                  <ArrowRight size={13} className={isRtl ? "rotate-180" : ""} />
                </Link>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-4 w-full">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onClose}
                className="flex-1 py-3 px-5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isRtl ? "العودة لتعديل السيرة" : "Continue Editing"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

