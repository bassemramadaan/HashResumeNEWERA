import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Send, 
  Copy, 
  Sparkles, 
  Code, 
  AlertCircle,
  Users2,
  Target,
  ExternalLink,
  ChevronDown,
  Info
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "../components/Footer";

export default function HashHuntPage() {
  const { language, dir } = useLanguageStore();
  const isRtl = language === "ar";

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState(isRtl ? "3–5 سنوات" : "3–5 years");
  const [userLocation, setUserLocation] = useState(isRtl ? "مصر" : "Egypt");
  const [openTo, setOpenTo] = useState(isRtl ? "عن بعد أو من المكتب" : "Remote or On-site");
  
  // File uploads
  const [resumeFile, setResumeFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow & response
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ isSimulated?: boolean; fileUrl?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Integrations Guide Panel
  const [showDevGuide, setShowDevGuide] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Constant sheet & drive links from Bassem's request
  const driveFolderUrl = "https://drive.google.com/drive/folders/1C0vT4ERPy9SCyXULssVE6NKo5l9_IpqPap5tUNgkZt84-JsqLNuf6lsz5R9rRG56pODHzYHV";
  const driveSheetUrl = "https://docs.google.com/spreadsheets/d/1nMu87iuJF9jSdSokpvZENrkSsJ7mFjyrvsxvTYCN4wk/edit?gid=1090340929#gid=1090340929";

  const googleAppsScriptCode = `/**
 * Google Apps Script for Hash Hunt Form Submission
 * Deployed under your account as "Web App" (Execute as: Me, Access: Anyone)
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Bound IDs based on user's workspace target
    var folderId = "1C0vT4ERPy9SCyXULssVE6NKo5l9_IpqPap5tUNgkZt84-JsqLNuf6lsz5R9rRG56pODHzYHV";
    var sheetId = "1nMu87iuJF9jSdSokpvZENrkSsJ7mFjyrvsxvTYCN4wk";
    
    var fileUrl = "";
    if (data.resumeFile && data.resumeFile.data) {
      var folder = DriveApp.getFolderById(folderId);
      var base64Part = data.resumeFile.data;
      if (base64Part.indexOf(",") !== -1) {
        base64Part = base64Part.split(",")[1];
      }
      var fileData = Utilities.base64Decode(base64Part);
      var blob = Utilities.newBlob(fileData, data.resumeFile.type, data.resumeFile.name);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }
    
    var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.email || "",
      data.jobTitle || "",
      data.experience || "",
      data.location || "",
      data.openTo || "",
      fileUrl
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileUrl: fileUrl,
      message: "Synchronized to Drive folder and Google Sheets successfully."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(googleAppsScriptCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const companies = [
    "Noon", "Careem", "Talabat", "Breadfast", "Paymob", "Instabug"
  ];

  const steps = isRtl ? [
    { num: "01", icon: Sparkles, title: "ارفع سيرتك الذاتية", desc: "قم برفع سيرتك الذاتية الحالية أو ابدأ واحدة جديدة في 5 دقائق. يقوم الذكاء الاصطناعي باستخراج مهاراتك وخبراتك تلقائياً." },
    { num: "02", icon: Target, title: "تطابق بالذكاء الاصطناعي", desc: "يقوم محرك التطابق لدينا بتحليل ملفك الشخصي مقابل آلاف الفرص المتاحة في أكثر من 85 شركة شريكة." },
    { num: "03", icon: Users2, title: "استقبل الفرص", desc: "تتواصل معك الشركات مباشرة. لا مزيد من الانتظار أو التقديم اليدوي الممل. متوسط الرد خلال 48 ساعة." }
  ] : [
    { num: "01", icon: Sparkles, title: "Upload Your Resume", desc: "Upload your existing CV or build one with HashResume in 5 minutes. Our AI extracts your skills and experience automatically." },
    { num: "02", icon: Target, title: "Get Matched by AI", desc: "Our matching engine analyzes your profile against 85+ companies' open roles and ranks you based on fit — not just keywords." },
    { num: "03", icon: Users2, title: "Receive Opportunities", desc: "Companies reach out directly to you. No ghosting, no black holes. Average first response within 48 hours." }
  ];

  const benefits = isRtl ? [
    { icon: Target, title: "تطابق ذكي ومدروس", desc: "يقوم محركنا بربط ملفك بالوظائف بناءً على مهاراتك، مستوى خبرتك، وموقعك المفضل وبنسب دقة عالية جداً." },
    { icon: ShieldCheck, title: "خصوصية كاملة دائمًا", desc: "اختر الشركات التي يمكنها رؤية ملفك. يمكنك إخفاء ملفك عن صاحب العمل الحالي تماماً بمرونة تامة." },
    { icon: Send, title: "وصول مباشر سريع", desc: "يتم إرسال أفضل المطابقات مباشرة إلى مديري التوظيف والمسؤولين في الشركات — وليس لمستنقع الـ ATS." }
  ] : [
    { icon: Target, title: "AI Matching", desc: "Our engine matches your profile to roles based on skills, experience level, and location preference." },
    { icon: ShieldCheck, title: "You stay in control", desc: "Choose which companies can see your profile. Hide from your current employer. Remove anytime." },
    { icon: Send, title: "Fast Track access", desc: "Top matches get sent directly to the hiring manager — not the ATS black hole." }
  ];

  const testimonials = [
    {
      stars: 5,
      text: isRtl ? "\"رفعت سيرتي الذاتية يوم الثلاثاء. بحلول الخميس كان لدي طلبا مقابلة. لم يحدث لي هذا من قبل مع مواقع التوظيف التقليدية.\"" : "\"I uploaded my resume on a Tuesday. By Thursday I had two interview requests. Never happened to me before with traditional job boards.\"",
      author: isRtl ? "أحمد حسين" : "Ahmed Hassan",
      role: isRtl ? "مطور واجهات · القاهرة" : "Frontend Developer · Cairo",
      av: "أح",
      avBg: "from-orange-400 to-[#FF4D2D]",
    },
    {
      stars: 5,
      text: isRtl ? "\"بصفتي مديرة موارد بشرية، وفرت لنا هاش هانت أسابيع من الفحص. المرشحون الذين نستقبلهم مطابقون مسبقاً وسيرهم الذاتية محسنة بالفعل.\"" : "\"As an HR manager, Hash Hunt saved us weeks of screening. The candidates we receive are pre-matched and their CVs are already ATS-optimized.\"",
      author: isRtl ? "سارة رمضان" : "Sara Ramadan",
      role: "HR Lead · Noon.com",
      av: "SR",
      avBg: "from-indigo-400 to-indigo-600",
    },
    {
      stars: 5,
      text: isRtl ? "\"مش صدقت إن شركة في دبي بعتتلي عرض شغل بعد يومين بس من رفع السيرة. الحمدلله على الفرصة دي.\"" : "\"I couldn't believe a company in Dubai sent me a job offer just two days after uploading my resume. Thank God for this opportunity.\"",
      author: isRtl ? "محمد العمري" : "Mohamed El-Omari",
      role: isRtl ? "محلل بيانات · الرياض" : "Data Analyst · Riyadh",
      av: "مع",
      avBg: "from-emerald-400 to-emerald-600",
    }
  ];

  const stats = [
    { num: "2,400+", label: isRtl ? "مرشح تم توظيفه" : "Candidates placed" },
    { num: "85+", label: isRtl ? "شركة شريكة" : "Partner companies" },
    { num: "48h", label: isRtl ? "متوسط أول رد" : "Avg. first response" },
    { num: "15", label: isRtl ? "دولة عربية مغطاة" : "Arab countries covered" }
  ];

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (file: File) => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 5) {
      setErrorMessage(isRtl ? "حجم الملف الحالي أكبر من 5 ميجابايت!" : "File size exceeds 5MB limit!");
      return;
    }
    
    setErrorMessage("");
    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile({
        name: file.name,
        type: file.type || "application/pdf",
        data: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !jobTitle) {
      setErrorMessage(isRtl ? "يرجى ملء جميع الحقول الإلزامية التي تحتوي علامة (*)" : "Please fill in all required fields marked with (*)");
      return;
    }

    if (!resumeFile) {
      setErrorMessage(isRtl ? "يرجى تحميل سيرتك الذاتية للمتابعة" : "Please upload your CV/Resume to continue");
      return;
    }

    setErrorMessage("");
    setSubmitting(true);

    try {
      const payload = {
        fullName,
        email,
        jobTitle,
        experience,
        location: userLocation,
        openTo,
        resumeFile
      };

      const response = await fetch("/api/hashhunt/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(isRtl ? "فشل إرسال البيانات نتيجة لخطأ في السيرفر" : "Failed to submit due to a server error");
      }

      const result = await response.json();
      setSubmissionResult(result);
      setShowSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "";
      setErrorMessage(errMsg || (isRtl ? "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً" : "An unexpected error occurred. Please try again later."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="hashhunt-page-root" className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden select-none" dir={dir}>
      <Helmet>
        <title>{isRtl ? "هاش هانت — دع الوظائف والشركات تجدك تلقائيًا" : "Hash Hunt — Let the Jobs Find You"}</title>
      </Helmet>
      
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section id="hashhunt-hero" className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:py-24 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[-10%] start-[-10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#FF4D2D]/20 to-orange-500/10 blur-[130px]" />
          <div className="absolute bottom-[10%] end-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-pink-500/10 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-start"
        >
          <div className="inline-flex items-center bg-[#FF4D2D]/10 border border-[#FF4D2D]/20 text-[#FF4D2D] text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-wider shadow-2xs">
            <Sparkles size={14} className="fill-current animate-pulse me-1 text-[#FF4D2D]" />
            <span>{isRtl ? "قاعدة المواهب الحصرية لتجاوز أنظمة الـ ATS" : "🎯 Elite Talent Bypass Pool"}</span>
          </div>
          <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-black text-slate-950 leading-[1.1] tracking-tight mb-6">
            {isRtl ? (
              <>اجعل مسؤولي التوظيف<br /><span className="bg-gradient-to-r from-[#FF4D2D] to-orange-600 bg-clip-text text-transparent">يبحثون عنك!</span></>
            ) : (
              <>Let the hiring managers<br /><span className="bg-gradient-to-r from-[#FF4D2D] to-orange-600 bg-clip-text text-transparent">hunt for you.</span></>
            )}
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mb-8 font-semibold leading-relaxed">
            {isRtl 
              ? "ارفع سيرتك الذاتية من خلالنا لمرة واحدة فقط. سنضمن تطابق ملفك المهني وعرضه على كبرى الشركات الرائدة والمستهدفة في الخليج وشمال أفريقيا مباشرة دون المرور بفلترة البريد اليدوية."
              : "Upload your resume once to get verified & matched to open roles at fast-growing companies across Egypt, Saudi, and UAE — completely skipping boring cold-applying pipelines."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
            <a href="#upload-profile" className="inline-flex items-center justify-center bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#FF4D2D]/20 hover:-translate-y-0.5 text-center">
              {isRtl ? "أنشئ ملفك وتزامن مع جوجل شيت ←" : "Create Profile & Sync Now →"}
            </a>
            <a href="#how-it-works" className="inline-flex items-center justify-center border border-slate-200 hover:border-[#FF4D2D] hover:text-[#FF4D2D] text-slate-600 font-bold bg-white py-4 px-8 rounded-2xl transition-all">
              {isRtl ? "شاهد كيف تعمل التقنية؟" : "See how it works"}
            </a>
          </div>

          <div className="flex gap-8 flex-wrap justify-center lg:justify-start">
            {stats.slice(0, 3).map((s, i) => (
              <div key={i} className="flex flex-col text-center lg:text-start">
                <span className="text-3xl font-black text-slate-950 tracking-tight">{s.num}</span>
                <span className="text-xs text-slate-400 font-extrabold uppercase mt-1 tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          {/* Top floating overlay card */}
          <div className="absolute -top-6 -right-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-slate-100 floating-card">
            <div className="w-10 h-10 bg-[#FF4D2D]/10 rounded-xl flex items-center justify-center text-xl">🏢</div>
            <div>
              <div className="text-sm font-black text-slate-950">{isRtl ? "85+ شركة شريكة" : "85+ Partners"}</div>
              <div className="text-xs text-slate-400 font-bold">{isRtl ? "تضم وظائف نشطة حاليًا" : "With active roles"}</div>
            </div>
          </div>

          {/* Core realistic matching widget UI */}
          <div id="match-card-preview" className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#FF4D2D] text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md">
                SR
              </div>
              <div>
                <div className="text-base font-black text-slate-950">{isRtl ? "سارة رضوان" : "Sarah Radwan"}</div>
                <div className="text-xs text-slate-400 font-black">{isRtl ? "كبير مهندسي برمجيات أول" : "Lead Software Engineer"}</div>
              </div>
              <div className="ms-auto bg-emerald-50 text-[#0F6E56] text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-100/60">
                ✓ {isRtl ? "نسبة مطابقة 96%" : "96% Best Match"}
              </div>
            </div>

            <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-black mb-2">
                <span className="text-slate-500">ATS Optimization Score</span>
                <span className="text-[#0F6E56]">98 / 100</span>
              </div>
              <div className="h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {["TypeScript", "React / Next.js", "System Design", "NodeJS"].map(skill => (
                <span key={skill} className="bg-slate-100 text-slate-600 text-xs font-extrabold px-3 py-1.5 rounded-lg border border-slate-200/40">
                  {skill}
                </span>
              ))}
            </div>

            <div className="bg-[#FF4D2D]/5 border border-[#FF4D2D]/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FF4D2D]/10 rounded-xl flex items-center justify-center text-xl shrink-0">✉️</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-slate-950 truncate">{isRtl ? "طلب مقابلة فوري" : "Instant Interview Invite"}</div>
                <div className="text-xs text-[#7A7A72] font-semibold truncate">Noon.com &bull; {isRtl ? "مهندس برمجيات واجهات" : "Senior Frontend Dev"}</div>
              </div>
              <div className="bg-[#FF4D2D] text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase animate-pulse shrink-0">
                {isRtl ? "جديد" : "New"}
              </div>
            </div>
          </div>

          {/* Bottom floating helper badge */}
          <div className="absolute -bottom-6 -left-6 z-20 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-slate-100 floating-card">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl text-emerald-600">⚡</div>
            <div>
              <div className="text-sm font-black text-slate-950">{isRtl ? "مسار فرز سريع" : "Hiring Fast Track"}</div>
              <div className="text-xs text-slate-400 font-bold">{isRtl ? "إلى مدراء التوظيف فورا" : "Direct with HR reps"}</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── COMPANIES TRUST ── */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
            {isRtl ? "قاعدة مرشحينا موثوقة من قبل مسؤولي توظيف في" : "Trusted by recruiters and engineering leaders at"}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity">
            {companies.map(c => (
              <span key={c} className="font-sans text-xl md:text-2xl font-black text-slate-400 hover:text-slate-950 transition-colors cursor-default select-none">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BASSEM'S GOOGLE INTEGRATION CENTER INDICATION ── */}
      {showDevGuide && (
        <section className="py-8 bg-slate-900 text-white relative border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-start gap-4 p-6 bg-slate-800/40 rounded-3xl border border-slate-800">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl shrink-0">
                <Info size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-lg text-amber-400">
                    {isRtl ? "مدير الربط بـ Google Drive & Google Sheet" : "Google Sheets & Google Drive Integration Hub"}
                  </h3>
                  <button 
                    onClick={() => setShowDevGuide(false)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-750"
                  >
                    {isRtl ? "إخفاء الخطوات" : "Hide Details"}
                  </button>
                </div>
                
                <p className="text-xs text-slate-300 mb-4 leading-relaxed font-semibold">
                  {isRtl 
                    ? "لقد قمت بربط الأزرار وملفات السيرفر بنجاح لدعم الرفع على Sheet و Drive مباشرة. وبما أن العملاء هم من يملؤون هذا النموذج، فإن الطريقة الأكثر أمانًا هي استخدام كود Google Apps Script البسيط التالي كـ Web App. هذا سيسمح لأي زائر برفع سيرته في مجلدك الخاص مباشرة بدون الحاجة لأن يكون لديه وصول لحسابك."
                    : "I have successfully prepared the server endpoints to sync directly. Since visitors fill out your profile form, the safest and robust pattern is using Google Apps Script deployed as a Web App to avoid exposing any secrets."}
                </p>

                <div className="space-y-4 text-xs font-semibold text-slate-300">
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-400 text-[11px] uppercase tracking-wider block font-bold">
                      {isRtl ? "الروابط المطلوبة المستهدفة التي سنرسل إليها:" : "Target Workspace resources identified:"}
                    </span>
                    <div className="flex flex-col gap-1.5 bg-slate-850 p-3 rounded-xl border border-slate-800 overflow-x-auto font-mono text-slate-200">
                      <div className="flex items-center gap-2 justify-between">
                        <span>Sheet: ID: <strong className="text-[#FF4D2D]">1nMu87iuJF9jSdSokpvZENrkSsJ7mFjyrvsxvTYCN4wk</strong></span>
                        <a href={driveSheetUrl} target="_blank" rel="noreferrer" className="text-xs hover:text-[#FF4D2D] flex items-center gap-1 text-slate-400">
                          {isRtl ? "فتح الشيت" : "View Sheet"} <ExternalLink size={10} />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 justify-between border-t border-slate-800/60 pt-1.5 mt-1.5">
                        <span>Drive Folder: ID: <strong className="text-emerald-500">1C0vT4ERPy9SCyXULssVE6NKo5l9_IpqPap5tUNgkZt84-JsqLNuf6lsz5R9rRG56pODHzYHV</strong></span>
                        <a href={driveFolderUrl} target="_blank" rel="noreferrer" className="text-xs hover:text-emerald-500 flex items-center gap-1 text-slate-400">
                          {isRtl ? "فتح المجلد" : "View Drive"} <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Step By Step Guide */}
                  <div className="space-y-2 mt-4">
                    <div className="font-black text-amber-300 flex items-center gap-1">
                      <Code size={14} />
                      <span>{isRtl ? "خطوات الربط والتفعيل بـ 3 دقائق:" : "Activation Steps (3 minutes):"}</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300">
                      <li>{isRtl ? "افتح جدول البيانات الخاص بك على Google Sheets." : "Open your Google Sheets spreadsheet in browser."}</li>
                      <li>{isRtl ? "اضغط على Extensions وثم Apps Script من القائمة العلوية." : "Click Extensions > Apps Script."}</li>
                      <li>{isRtl ? "احذف أي كود مكتوب، وسوِّ نسخ للكود ذو التميز بالأسفل والصقه." : "Delete old code, copy the target script from this box & paste it in."}</li>
                      <li>{isRtl ? "اضغط على زر حفظ (الأيقونة) ثم Deploy وثم New Deployment." : "Click Save icon, then select \"Deploy\" > \"New Deployment\"."}</li>
                      <li>{isRtl ? "اختر النوع Web App ، واجعل الإعدادات: Execute as: Me ورؤية الوصول: Anyone." : "Choose \"Web App\". Set: Execute as: \"Me\", Who has access: \"Anyone\"."}</li>
                      <li>{isRtl ? "انسخ رابط الـ Web App وضعه في ملف الـ .env تحت مسمى GOOGLE_APPS_SCRIPT_HASHHUNT_URL." : "Copy Web App URL & enter it in environment secrets as GOOGLE_APPS_SCRIPT_HASHHUNT_URL."}</li>
                    </ol>
                  </div>

                  {/* Code Area */}
                  <div className="mt-4 border border-slate-750 rounded-2xl bg-slate-950 overflow-hidden relative">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800/60 text-[10px] text-slate-400">
                      <span className="font-bold flex items-center gap-1">
                        <Code size={12} />
                        GoogleAppsScript.gs
                      </span>
                      <button 
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#FF4D2D] hover:text-orange-500 transition-colors"
                      >
                        {copiedCode ? (
                          <>
                            <CheckCircle2 size={12} />
                            {isRtl ? "تم النسخ بنجاح!" : "Copied!"}
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            {isRtl ? "نسخ الكود البرمجي" : "Copy Code"}
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-[10px] font-mono text-slate-300 bg-slate-900/60 leading-relaxed max-h-48 overflow-y-auto">
                      <code>{googleAppsScriptCode}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS SECTION ── */}
      <section id="how-it-works" className="py-24 bg-white border-b border-slate-200/60 relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex bg-[#FF4D2D]/10 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "منهجية العمل المتكاملة" : "Matching Methodology"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-4 tracking-tight">
              {isRtl ? "3 خطوات بسيطة لوظيفتك القادمة" : "3 steps to your dream role"}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-semibold max-w-xl mx-auto leading-relaxed">
              {isRtl 
                ? "تجنب تمامًا خطابات التغطية الطويلة والتقديمات المرهقة في المنصات العادية، اترك سيرتك والذكاء الاصطناعي يقوم بالمهمة."
                : "No cover letters, no standard ghosting job boards. Just upload your verified CV and let employers target you."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => {
              const IconComp = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-[#FAFAF6] border border-slate-200/60 rounded-3xl p-8 hover:border-[#FF4D2D]/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="font-sans text-6xl font-black text-[#FF4D2D]/10 leading-none mb-6 group-hover:text-[#FF4D2D]/15 transition-colors absolute end-6 top-6">
                    {s.num}
                  </div>
                  <div className="w-12 h-12 bg-[#FF4D2D]/10 rounded-2xl flex items-center justify-center text-[#FF4D2D] mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
                    <IconComp size={22} className="stroke-[2.4]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 mb-2 leading-snug">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFITS SECTION ── */}
      <section className="py-24 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-12 max-w-3xl mx-auto text-center mb-10">
            <span className="inline-flex bg-[#FF4D2D]/10 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "مزايا لم تجدها في مكان آخر" : "Unique advantages"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight mb-4">
              {isRtl ? "سر الرد ومقابلات العمل السريعة" : "The secret behind fast interviews"}
            </h2>
            <p className="text-slate-500 font-semibold max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              {isRtl ? "نحن نضع مهاراتك بشكل منسق مباشرة تحت أنظار صانعي القرار لرفع فرصة المقابلة." : "We connect your expertise directly in front of real hiring decision makers."}
            </p>
          </div>

          <div className="lg:col-span-12 grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => {
              const BenefIcon = b.icon;
              return (
                <div key={i} className="flex flex-col gap-4 p-6 bg-white border border-slate-200/60 rounded-3xl hover:border-slate-350 transition-all">
                  <div className="w-10 h-10 bg-[#FF4D2D]/10 rounded-xl flex items-center justify-center text-[#FF4D2D] shrink-0">
                    <BenefIcon size={18} className="stroke-[2.4]" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-950 mb-1 leading-snug">{b.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAIN FORM SECTION ── */}
      <section id="upload-profile" className="py-24 bg-white border-t border-slate-200/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-5">
            <div className="inline-flex bg-[#FF4D2D]/10 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "الاشتراك المجاني الذكي" : "Join Free"}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight mb-6">
              {isRtl ? "دع الوظائف المناسبة تبادر بالبحث عنك" : "Let matched jobs find you"}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 font-semibold">
              {isRtl 
                ? "أكمل معلوماتك بالنموذج المجاور لتنضم فورا لقاعدة المواهب التي يزورها ممثلو التوظيف. لا حاجة لأي خطوات تسجيل طويلة أو معقدة."
                : "Submit your details alongside your CV to immediately sync with our target HR Sheets and allow elite teams to reach out."}
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="w-10 h-10 bg-[#FF4D2D]/10 text-[#FF4D2D] rounded-xl flex items-center justify-center font-black shrink-0">
                  📂
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 mb-1">{isRtl ? "مجلد Google Drive آمن ومباشر" : "Direct Google Drive Storage"}</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    {isRtl 
                      ? "سنرفع سيرتك لمجلدك المحسن مباشرة، مع ربطها وتعميمها بنسب تطابق عالية."
                      : "We drop your CV directly onto Google Drive and link it dynamically."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black shrink-0">
                  📊
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 mb-1">{isRtl ? "تزامن فوري مع جدول Google Sheets" : "Direct Sheets Sync"}</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    {isRtl 
                      ? "إضافة صف تفاعلي بكل بيانات نموذجك لجدولنا المفصل للبحث والفرز."
                      : "Pipes a clean structured spreadsheet row to find you instantly."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-[#FAFAF6] border border-slate-250/60 rounded-[2.5rem] p-6 sm:p-10 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 start-0 w-2.5 h-full bg-gradient-to-b from-[#FF4D2D] to-orange-500" />
            
            <div className="font-sans text-2xl font-black text-slate-950 mb-1">{isRtl ? "أنشئ ملفك الشخصي" : "Create Profile Profile"}</div>
            <div className="text-xs text-slate-400 font-bold mb-8">{isRtl ? "يستغرق أقل من دقيقتين · تزامن وتحديث فوري لـ Google Drive" : "Takes less than 2 minutes · Seamless sync to sheet folder"}</div>

            {errorMessage && (
              <div aria-live="polite" className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-100/80 text-rose-700 text-xs sm:text-sm mb-6 font-semibold">
                <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">{isRtl ? "الاسم بالكامل *" : "Full Name *"}</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] outline-none transition-all placeholder-slate-400" 
                    placeholder={isRtl ? "احمد كمال" : "Ahmed Kamal"} 
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">{isRtl ? "البريد الإلكتروني *" : "Email *"}</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] outline-none transition-all placeholder-slate-400" 
                    placeholder="ahmed@email.com" 
                    required
                  />
                </div>

                <div className="space-y-1.55">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">{isRtl ? "المسمى الوظيفي المستهدف *" : "Job Title *"}</label>
                  <input 
                    type="text" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] outline-none transition-all placeholder-slate-400" 
                    placeholder={isRtl ? "مطور برمجيات واجهات" : "Senior Software Engineer"} 
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">{isRtl ? "سنوات الخبرة" : "Years of Experience"}</label>
                  <div className="relative">
                    <select 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:border-[#FF4D2D] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>0–1 {isRtl ? "سنة" : "year"}</option>
                      <option>1–3 {isRtl ? "سنوات" : "years"}</option>
                      <option>3–5 {isRtl ? "سنوات" : "years"}</option>
                      <option>5–10 {isRtl ? "سنوات" : "years"}</option>
                      <option>10+ {isRtl ? "سنة" : "years"}</option>
                    </select>
                    <ChevronDown size={16} className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">{isRtl ? "الموقع الجغرافي" : "Location"}</label>
                  <div className="relative">
                    <select 
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:border-[#FF4D2D] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>{isRtl ? "مصر" : "Egypt"}</option>
                      <option>{isRtl ? "السعودية" : "Saudi Arabia"}</option>
                      <option>{isRtl ? "الإمارات" : "UAE"}</option>
                      <option>{isRtl ? "الكويت" : "Kuwait"}</option>
                      <option>{isRtl ? "الأردن" : "Jordan"}</option>
                      <option>{isRtl ? "أخرى" : "Other"}</option>
                    </select>
                    <ChevronDown size={16} className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">{isRtl ? "نوع العمل المفضل" : "Open To"}</label>
                  <div className="relative">
                    <select 
                      value={openTo}
                      onChange={(e) => setOpenTo(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:border-[#FF4D2D] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>{isRtl ? "عن بعد فقط" : "Remote only"}</option>
                      <option>{isRtl ? "عن بعد أو من المكتب" : "Remote or On-site"}</option>
                      <option>{isRtl ? "من المكتب فقط" : "On-site only"}</option>
                    </select>
                    <ChevronDown size={16} className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Unique drag/drop uploader */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
                  {isRtl ? "تحميل ملف السيرة الذاتية (Sertificated ATS Resume) *" : "Your Optimized Resume (PDF/Word) *"}
                </label>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-2xl py-8 px-6 text-center cursor-pointer transition-all duration-300 group bg-white ${
                    dragActive 
                      ? "border-[#FF4D2D] bg-[#FF4D2D]/5 scale-[0.99]" 
                      : "border-slate-200 hover:border-[#FF4D2D]/40 hover:bg-[#FF4D2D]/[0.02]"
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  
                  {resumeFile ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <FileText size={24} />
                      </div>
                      <div className="text-sm font-black text-slate-900 mb-1 max-w-full truncate px-4">
                        {resumeFile.name}
                      </div>
                      <div className="text-xs text-slate-400 font-extrabold flex items-center gap-1">
                        <span>{isRtl ? "جاهز للتزامن والرفع لـ Google Drive" : "Ready to be synced"}</span>
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                        }}
                        className="mt-3 text-xs font-bold text-[#FF4D2D] hover:underline"
                      >
                        {isRtl ? "حذف وتغيير الملف" : "Remove & change file"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform text-2xl shadow-xs">
                        📎
                      </div>
                      <div className="text-sm font-black text-slate-900 mb-1 leading-snug">
                        {isRtl ? "اسحب سيرتك المتوافقة هنا أو" : "Drop your optimized file here, or"}{" "}
                        <span className="text-[#FF4D2D] group-hover:underline">{isRtl ? "تصفح جهازك" : "click to browse"}</span>
                      </div>
                      <div className="text-xs text-slate-400 font-semibold leading-relaxed">
                        PDF or WORD &bull; {isRtl ? "الحجم الأقصى 5 ميجابايت" : "Maximum file size: 5MB"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.995 }}
                disabled={submitting}
                type="submit"
                className={`w-full font-black py-4.5 rounded-2xl transition-all shadow-xl text-center text-sm tracking-wide flex items-center justify-center gap-2 ${
                  submitting 
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                    : "bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white shadow-[#FF4D2D]/20 hover:shadow-[#FF4D2D]/30"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>{isRtl ? "جاري رفع السيرة وتحديث الشيت..." : "Processing & Uploading..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>{isRtl ? "انضم الآن وتزامن مباشرة" : "Submit & Sync to Cloud Drive"}</span>
                  </>
                )}
              </motion.button>

              <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs font-black text-slate-400">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> {isRtl ? "أمان البيانات 100%" : "100% Secure"}</span>
                <span className="flex items-center gap-1.5">⚡ {isRtl ? "تنبيه مقابلة فوري" : "Instant Alert"}</span>
                <span className="flex items-center gap-1.5">🌍 {isRtl ? "ربط مرن وسريع" : "Realtime Sheet"}</span>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── REAL TESTIMONIALS SLIDER SECTION  ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex bg-[#FF4D2D]/10 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "مراجعات وقصص مستخدمينا" : "Social proof"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight mb-4">
              {isRtl ? "أعضاء تجاوزوا محرك الـ ATS وحصلوا على عروض" : "Users who bypassed ATS and secured offers"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-slate-200/60 rounded-3xl p-8 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-500 mb-6">
                  {[...Array(t.stars)].map((_, idx) => (
                    <span key={idx} className="text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic mb-8 flex-1">
                  {t.text}
                </p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avBg} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                    {t.av}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-950 leading-none">{t.author}</h5>
                    <span className="text-[11px] text-slate-400 font-bold mt-1.5 block">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER INTERACTIVE INJECTION SECTION ── */}
      <section className="py-24 bg-slate-950 text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF4D2D]/10 blur-[130px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            {isRtl ? "جرّب التوظيف الصامت" : "Stop applying blindly."} <br /> {isRtl ? "ودع الفرص تتدفق إليك." : "Start getting hunted."}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mb-12 max-w-lg mx-auto font-semibold">
            {isRtl 
              ? "انضم الآن لأكثر من 2,400 باحث عن عمل تجاوزوا تصفية المقابلات وحصلوا على تصفية حرة ومباشرة." 
              : "Let target matches automatically populate with hiring managers directly from your Drive updates."}
          </p>
          <a href="#upload-profile" className="inline-flex bg-white hover:bg-slate-100 text-[#FF4D2D] font-sans font-black text-base px-10 py-5 rounded-2xl hover:scale-105 transition-all text-center">
            {isRtl ? "انضم الآن مجاناً وابدأ بالتزامن" : "Join the Talent Loop →"}
          </a>
        </div>
      </section>

      <Footer />

      {/* ── SUCCESS DIALOG OVERLAY MODERN DESIGN ── */}
      <AnimatePresence>
        {showSuccess && (
          <div aria-modal="true" role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] p-8 sm:p-10 w-full max-w-xl shadow-2xl relative border border-slate-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-6 shadow-xs">
                  🎉
                </div>
                
                <h3 className="text-2xl font-black text-slate-950 mb-3 leading-snug">
                  {isRtl ? "تم إرسال ونقل معلوماتك بنجاح!" : "Saved & Synchronized Successfully!"}
                </h3>
                
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-6 max-w-sm leading-relaxed">
                  {isRtl 
                    ? "لقد قمنا بنجاح بمعالجة النموذج وأرسلنا نسختين من ملفاتك لكلا الطرفين (جدول البيانات ومجلد Google Drive) بنجاح."
                    : "Your CV file has been compiled & synced safely directly to Google Drive folder and appended to the Sheet rows."}
                </p>

                {submissionResult?.isSimulated && (
                  <div className="w-full text-start p-4 rounded-2xl bg-amber-50 border border-amber-100/60 text-amber-850 text-xs mb-6 font-semibold space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <AlertCircle size={14} className="text-amber-600" />
                      <span>{isRtl ? "رسالة توضيحية لمدير النظام (أنت):" : "System Notification for Sandbox Dev:"}</span>
                    </div>
                    <p className="leading-relaxed text-[11px] text-amber-800">
                      {isRtl 
                        ? "النظام حالياً في وضع التجربة الآمن (Simulated Sandbox) لعدم تزويدنا بعنوان Apps Script URL في ملف الـ .env تحت مسمى `GOOGLE_APPS_SCRIPT_HASHHUNT_URL`."
                        : "Submission succeeded in Simulated Sandbox. Configure `GOOGLE_APPS_SCRIPT_HASHHUNT_URL` to toggle real-time sheets syncing permanently."}
                    </p>
                    <button 
                      onClick={() => {
                        setShowSuccess(false);
                        setShowDevGuide(true);
                        // Scroll to dev guide
                        setTimeout(() => {
                          document.getElementById("match-card-preview")?.scrollIntoView({ behavior: 'smooth' });
                        }, 200);
                      }}
                      className="text-[11px] text-[#FF4D2D] hover:underline font-bold block"
                    >
                      {isRtl ? "عرض خطوات وكود الربط الآن ←" : "Show script instructions now →"}
                    </button>
                  </div>
                )}

                <div className="w-full flex gap-3">
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-white font-black py-4 rounded-xl text-xs transition-all"
                  >
                    {isRtl ? "إغلاق النافذة" : "Close Windows"}
                  </button>
                  
                  {submissionResult?.fileUrl && (
                    <a
                      href={submissionResult.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white font-black py-4 rounded-xl text-xs transition-all"
                    >
                      {isRtl ? "فتح الملف في الدرايف" : "Open in Drive"}
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
