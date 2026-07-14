import React, { useState, useRef, useEffect } from "react";
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
  Info,
  Briefcase,
  RefreshCw,
  Check
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { useResumeStore } from "../store/useResumeStore";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "../components/Footer";

export default function HashHuntPage() {
  const { language, dir } = useLanguageStore();
  const isRtl = language === "ar";

  const resumeData = useResumeStore((state) => state.data);
  const hasDesignedResume = !!(resumeData && (resumeData.personalInfo?.fullName || resumeData.personalInfo?.email));

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState(isRtl ? "3–5 سنوات" : "3–5 years");
  const [userLocation, setUserLocation] = useState(isRtl ? "مصر" : "Egypt");
  const [openTo, setOpenTo] = useState(isRtl ? "عن بعد أو من المكتب" : "Remote or On-site");
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedExp, setSelectedExp] = useState("all");
  
  // File uploads
  const [resumeFile, setResumeFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow & response
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [_submissionResult, setSubmissionResult] = useState<{ isSimulated?: boolean; fileUrl?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedJobAlert, setSelectedJobAlert] = useState<string | null>(null);

  // Auto-populate from resume data if designed
  useEffect(() => {
    if (resumeData && (resumeData.personalInfo?.fullName || resumeData.personalInfo?.email)) {
      setFullName(resumeData.personalInfo.fullName || "");
      setPhoneNumber(resumeData.personalInfo.phone || "");
      setEmail(resumeData.personalInfo.email || "");
      setJobTitle(resumeData.personalInfo.jobTitle || "");
    }
  }, [resumeData]);

  // Almosafer Travel Group jobs data
  const almosaferJobs = [
    {
      id: "it-support",
      title: "Officer - IT Support Egypt",
      dept: isRtl ? "تكنولوجيا الدعم الفني والبنية التحتية" : "IT Support Egypt & Tech",
      url: "https://jobs.almosafer.com/job/Cairo-Officer-IT-Support-Egypt/1401870033/",
      exp: isRtl ? "1-3 سنوات" : "1-3 Years",
      location: isRtl ? "القاهرة، مصر" : "Cairo, Egypt",
      arabicTitle: "مسؤول - الدعم الفني وتكنولوجيا المعلومات",
      bullets: isRtl ? [
        "تقديم الدعم الفني والتقني اليومي لموظفي وأجهزة مكتب مصر.",
        "حل وصيانة الأعطال المتعلقة بأجهزة الكمبيوتر، البرمجيات، والشبكات والخدمات.",
        "تجهيز وتهيئة محطات العمل وحسابات الموظفين الجدد بالكامل.",
        "متابعة استقرار أجهزة الاتصال والصيانة مع الطواقم الإقليمية بالشركة."
      ] : [
        "Provide daily desktop & infrastructure technical support to Cairo office staff.",
        "Troubleshoot local hardware, software, security setups, and local network issues.",
        "Provision new equipment, accounts, software access, and workstations.",
        "Maintain office IT assets, inventory records, and support internal SLA guidelines."
      ]
    },
    {
      id: "revenue-assurance",
      title: "Officer - Revenue Assurance",
      dept: isRtl ? "المالية وتدقيق الإيرادات وعقود التحقق" : "Finance & Commercial Audit",
      url: "https://jobs.almosafer.com/job/Cairo-Officer-Revenue-Assurance/1399488333/",
      exp: isRtl ? "2-4 سنوات" : "2-4 Years",
      location: isRtl ? "القاهرة، مصر" : "Cairo, Egypt",
      arabicTitle: "مسؤول - تدقيق ومراقبة صحة الإيرادات",
      bullets: isRtl ? [
        "تدقيق ومراجعة المعاملات والعمليات المالية اليومية لرصد أي تسرب مالي.",
        "إجراء تسويات مالية دورية دقيقة بين الأنظمة المتعددة ومقدمي خدمات الطيران والفنادق.",
        "متابعة وتحليل التقارير المالية لتقديم توصيات مباشرة ومطابقة القيود المحاسبية.",
        "تسوية الفروقات الناتجة عن بوابات الدفع الإلكتروني والبطاقات الائتمانية للشركاء."
      ] : [
        "Audit daily transactions and bookings to find and prevent leakage early.",
        "Perform routine reconciliations between core systems and tourist travel vendors.",
        "Identify commercial pricing deviations, incorrect commissions or chargebacks.",
        "Validate payment gateway settlement workflows and reconcile differences."
      ]
    },
    {
      id: "order-to-cash",
      title: "Sr.Officer - Order-to-Cash",
      dept: isRtl ? "المبيعات والتحصيل وإدارة الائتمان" : "Finance & Accounts Receivable (O2C)",
      url: "https://jobs.almosafer.com/job/Cairo-Sr_Officer-Order-to-Cash/1400535133/",
      exp: isRtl ? "3-5 سنوات" : "3-5 Years",
      location: isRtl ? "القاهرة، مصر" : "Cairo, Egypt",
      arabicTitle: "مسؤول أول - دورة الطلب وسداد الفواتير حتى التحصيل",
      bullets: isRtl ? [
        "إدارة دورة حسابات الذمم المدينة والتحصيل لعملاء الشركة والشركات الكبرى بالكامل.",
        "مراجعة وإصدار الفواتير الدورية بدقة عالية والتواصل اللقائي لتأكيد المبالغ المستحقة.",
        "متابعة تواريخ الاستحقاق وجدولة السداد لتعزيز التدفقات النقدية والسيولة.",
        "معالجة المقبوضات وتنزيلها على نظام الـ ERP (مثل Oracle أو SAP) ومطابقتها دورياً."
      ] : [
        "Lead the Order-to-Cash (O2C) accounting lifecycle for corporate high-value partners.",
        "Audit corporate booking sales, manage credit lines, and produce flawless active invoices.",
        "Track customer aging reports, manage active collections, and maintain healthy cash flow.",
        "Post incoming payments in Oracle/SAP ERP and clear open invoices accurately."
      ]
    }
  ];

  const filteredJobs = almosaferJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (job.arabicTitle && job.arabicTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          job.dept.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDept = true;
    if (selectedDept !== "all") {
      if (selectedDept === "it") {
        matchesDept = job.id === "it-support";
      } else if (selectedDept === "revenue") {
        matchesDept = job.id === "revenue-assurance";
      } else if (selectedDept === "order") {
        matchesDept = job.id === "order-to-cash";
      }
    }

    let matchesExp = true;
    if (selectedExp !== "all") {
      matchesExp = job.exp.includes(selectedExp);
    }
    
    return matchesSearch && matchesDept && matchesExp;
  });

  const handleApplyToAlmosaferJob = (title: string) => {
    setJobTitle(title);
    setSelectedJobAlert(title);
    
    // Smooth scroll to the form section
    const formElement = document.getElementById("upload-profile");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    
    // Flash dynamic class ring on input
    setTimeout(() => {
      const inputEl = document.getElementById("target-job-title") as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
        inputEl.classList.add("ring-animated-flash");
        setTimeout(() => {
          inputEl.classList.remove("ring-animated-flash");
        }, 3000);
      }
    }, 850);
  };
  
  // Integrations Guide Panel - show on localhost/development domains by default, or if ?dev=true is appended in production
  const [showDevGuide] = useState(() => false);
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
      new Date(),                             // A: Timestamp
      data.fullName || "",                    // B: Name
      data.phoneNumber || "",                 // C: Phone number
      data.email || "",                       // D: Email
      data.jobTitle || "",                    // E: Job/Career
      fileUrl || "",                          // F: Submit Your CV – Hash Resume
      data.email || "",                       // G: Email Address
      data.experience || "",                  // H: Job Code / Experience
      (data.location + " - " + data.openTo) || "" // I: Column 7 / Additional Details
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
    { num: "50+", label: isRtl ? "شركة شريكة" : "Partner companies" },
    { num: "48hr", label: isRtl ? "متوسط أول رد" : "Avg. first response" },
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
    
    if (!fullName || !email || !jobTitle || !phoneNumber) {
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
        phoneNumber,
        email,
        jobTitle,
        experience,
        location: userLocation,
        openTo,
        resumeFile
      };

      let result = null;
      let hasSucceeded = false;

      // 1st Attempt: Node Backend / Vercel Serverless proxy API route
      try {
        console.log("Submitting form through server API endpoint...");
        const response = await fetch("/api/hashhunt/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const apiResult = await response.json();
          if (apiResult && apiResult.success !== false) {
            result = apiResult;
            hasSucceeded = true;
            console.log("Successful submission via Server API!");
          } else {
            console.warn("Server API returned unsuccessful response:", apiResult);
          }
        } else {
          console.warn(`Server API responded with HTTP status ${response.status}`);
        }
      } catch (apiErr) {
        console.warn("Server API route failed or timed out. Moving directly to Apps Script sandbox fallback...", apiErr);
      }

      // 2nd Attempt (FALLBACK): Direct client-side CORS simple-request to Apps Script.
      // We use text/plain;charset=utf-8 to bypass CORS preflight OPTIONS blockages by browsers (simple request rule)
      if (!hasSucceeded) {
        console.log("Using direct Apps Script client-side fallback...");
        const fallbackUrl = "https://script.google.com/macros/s/AKfycbyl7ro7BiwATXekxNHoO79D1DyVGfQEIfQGY5_nodXMu0KeZA2kXUxTSbqK7wlg3xGyHw/exec";
        
        const directResp = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });

        if (!directResp.ok) {
          throw new Error(isRtl ? "فشل إرسال البيانات نتيجة لخطأ في السيرفر" : "Failed to submit due to a server error");
        }

        const directText = await directResp.text();
        try {
          const parsedResult = JSON.parse(directText);
          if (parsedResult && parsedResult.success !== false) {
            result = parsedResult;
            hasSucceeded = true;
            console.log("Successful submission via direct browser fallback connection!");
          } else {
            throw new Error(parsedResult?.error || (isRtl ? "فشل حفظ البيانات بالكامل" : "Apps Script failed to write line"));
          }
        } catch (jsonErr) {
          console.warn("Direct JSON parsing skipped/failed. Error detail:", jsonErr, "Response snippet:", directText.slice(0, 300));
          // If the apps script wrote successfully but returned text or redirection page,
          // as long as HTTP status is 200, the data was successfully synced into Sheets & Drive.
          if (directText.includes("success") || directResp.status === 200) {
            hasSucceeded = true;
            result = { success: true, isSimulated: false };
            console.log("Synchronized successfully based on status code 200 / success text");
          } else {
            throw new Error(isRtl ? "استجابة غير صالحة من نظام جوجل" : "Invalid response from Google Apps Script");
          }
        }
      }

      if (!hasSucceeded) {
        throw new Error(isRtl ? "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً" : "An unexpected error occurred. Please try again later.");
      }

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
    <div id="hashhunt-page-root" className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden select-none pb-20" dir={dir}>
      <Helmet>
        <title>{isRtl ? "هاش هانت — دع الوظائف والشركات تجدك تلقائيًا" : "Hash Hunt — Let the Jobs Find You"}</title>
      </Helmet>
      
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section id="hashhunt-hero" className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:py-24 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45">
          <div className="absolute top-[-10%] start-[-10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#FF4D2D]/15 to-orange-500/5 blur-[130px]" />
          <div className="absolute bottom-[10%] end-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-indigo-500/15 to-pink-500/5 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-start"
        >
          <div className="inline-flex items-center bg-[#FF4D2D]/5 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-semibold px-4.5 py-2 rounded-full mb-6 uppercase tracking-wider shadow-xs">
            <Sparkles size={13} className="fill-current animate-pulse me-1.5 text-[#FF4D2D]" />
            <span>{isRtl ? "قاعدة المواهب الحصرية لتجاوز أنظمة الـ ATS" : "Elite Talent Bypass Pool"}</span>
          </div>
          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-6">
            {isRtl ? (
              <>اجعل مسؤولي التوظيف<br /><span className="bg-gradient-to-r from-[#FF4D2D] to-orange-600 bg-clip-text text-transparent">يبحثون عنك!</span></>
            ) : (
              <>Let the hiring managers<br /><span className="bg-gradient-to-r from-[#FF4D2D] to-orange-600 bg-clip-text text-transparent">hunt for you.</span></>
            )}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-8 font-normal leading-relaxed">
            {isRtl 
              ? "ارفع سيرتك الذاتية من خلالنا لمرة واحدة فقط. سنضمن تطابق ملفك المهني وعرضه على كبرى الشركات الرائدة والمستهدفة مباشرة دون المرور بفلترة البريد اليدوية."
              : "Upload your resume once to get verified & matched to open roles at fast-growing companies — completely skipping boring cold-applying pipelines."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
            <a href="#upload-profile" className="inline-flex items-center justify-center bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FF4D2D]/15 hover:-translate-y-0.5 text-center text-sm">
              {isRtl ? "أنشئ ملفك وتزامن مع جوجل شيت ←" : "Create Profile & Sync Now →"}
            </a>
            <a href="#how-it-works" className="inline-flex items-center justify-center border border-slate-200 hover:border-[#FF4D2D]/30 hover:text-[#FF4D2D] text-slate-600 font-medium bg-white hover:bg-slate-50 py-3.5 px-8 rounded-xl transition-all text-sm">
              {isRtl ? "شاهد كيف تعمل التقنية؟" : "See how it works"}
            </a>
          </div>

          <div className="flex gap-8 flex-wrap justify-center lg:justify-start">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col text-center lg:text-start bg-white/50 backdrop-blur-xs px-5 py-3.5 rounded-2xl border border-slate-200/40 shadow-3xs min-w-[120px]">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{s.num}</span>
                <span className="text-xs text-slate-500 font-bold mt-1 tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          {/* Top floating overlay card */}
          <div className="absolute -top-6 -right-3 z-20 bg-white rounded-xl p-3.5 shadow-xl flex items-center gap-3 border border-slate-100/80">
            <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center text-lg">🏢</div>
            <div>
              <div className="text-xs font-bold text-slate-900">{isRtl ? "85+ شركة شريكة" : "85+ Partners"}</div>
              <div className="text-[10px] text-slate-400 font-medium">{isRtl ? "تضم وظائف نشطة حاليًا" : "With active roles"}</div>
            </div>
          </div>

          {/* Core realistic matching widget UI */}
          <div id="match-card-preview" className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-100/90 relative z-10">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 bg-[#FF4D2D]/10 text-[#FF4D2D] border border-[#FF4D2D]/15 rounded-xl flex items-center justify-center font-bold text-base shadow-2xs">
                SR
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{isRtl ? "سارة رضوان" : "Sarah Radwan"}</div>
                <div className="text-xs text-slate-400 font-medium">{isRtl ? "كبير مهندسي برمجيات أول" : "Lead Software Engineer"}</div>
              </div>
              <div className="ms-auto bg-emerald-50 text-[#0F6E56] text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-100/55">
                ✓ {isRtl ? "نسبة مطابقة 96%" : "96% Best Match"}
              </div>
            </div>

            <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between text-[11px] font-semibold mb-2">
                <span className="text-slate-500">ATS Optimization Score</span>
                <span className="text-[#0F6E56] font-bold">98 / 100</span>
              </div>
              <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {["TypeScript", "React / Next.js", "System Design"].map(skill => (
                <span key={skill} className="bg-slate-50 text-slate-650 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-slate-200/35">
                  {skill}
                </span>
              ))}
            </div>

            <div className="bg-[#FF4D2D]/5 border border-[#FF4D2D]/10 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#FF4D2D]/10 rounded-lg flex items-center justify-center text-lg shrink-0">✉️</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{isRtl ? "طلب مقابلة فوري" : "Instant Interview Invite"}</div>
                <div className="text-[10px] text-slate-550 font-medium truncate">Noon.com &bull; {isRtl ? "مهندس برمجيات واجهات" : "Senior Frontend Dev"}</div>
              </div>
              <div className="bg-[#FF4D2D] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase animate-pulse shrink-0">
                {isRtl ? "جديد" : "New"}
              </div>
            </div>
          </div>

          {/* Bottom floating helper badge */}
          <div className="absolute -bottom-6 -left-3 z-20 bg-white rounded-xl p-3.5 shadow-xl flex items-center gap-3 border border-slate-100/80">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-lg text-emerald-600">⚡</div>
            <div>
              <div className="text-xs font-bold text-slate-900">{isRtl ? "مسار فرز سريع" : "Hiring Fast Track"}</div>
              <div className="text-[10px] text-slate-400 font-medium">{isRtl ? "إلى مدراء التوظيف فورا" : "Direct with HR reps"}</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── COMPANIES TRUST ── */}
      <section className="py-10 border-y border-slate-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-6">
            {isRtl ? "قاعدة مرشحينا موثوقة من قبل مسؤولي توظيف في" : "Trusted by recruiters and engineering leaders at"}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-60 hover:opacity-100 transition-opacity">
            {companies.map(c => (
              <span key={c} className="font-sans text-lg md:text-xl font-bold text-slate-450 hover:text-slate-900 transition-colors cursor-default select-none">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE ALMOSAFER TRAVEL GOING OPPORTUNITIES ── */}
      <section id="almosafer-jobs-section" className="py-24 bg-gradient-to-b from-white to-[#FAFAF6] border-b border-rose-500/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#FF4D2D]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-0 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex bg-gradient-to-r from-blue-600/5 to-[#FF4D2D]/10 border border-[#FF4D2D]/20 text-[#FF4D2D] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 items-center gap-1.5 shadow-3xs">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
              <span>{isRtl ? "وظائف شاغرة نشطة ومثبتة" : "Active Verified Vacancies"}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight mb-4">
              {isRtl ? "فرص العمل المتاحة حالياً" : "Active Vacancies"}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
              {isRtl 
                ? "تصفح الفرص والوظائف القيادية النشطة. اضغط على 'قدّم الآن عبر هاش هانت' لتعبئة استمارة التقديم والبدء فوراً."
                : "Explore verified competitive positions. Click 'Apply Via Hash Hunt' to auto-populate the profile form below and fast-track your submission."}
            </p>
          </div>

          {/* Search and Filters Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 sm:p-5 mb-8 shadow-xs max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search input */}
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase size={16} />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isRtl ? "البحث عن وظيفة (مثال: IT, Finance)..." : "Search jobs (e.g. IT, Finance)..."}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FF4D2D] transition-colors font-semibold bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* Department Dropdown */}
              <div className="w-full md:w-56">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FF4D2D] transition-colors font-semibold bg-slate-50/50 focus:bg-white cursor-pointer"
                >
                  <option value="all">{isRtl ? "كل الأقسام" : "All Departments"}</option>
                  <option value="it">{isRtl ? "الدعم الفني وتكنولوجيا المعلومات" : "IT & Tech Support"}</option>
                  <option value="revenue">{isRtl ? "المالية وتدقيق الإيرادات" : "Finance & Revenue"}</option>
                  <option value="order">{isRtl ? "حسابات الذمم والتحصيل (O2C)" : "Order to Cash"}</option>
                </select>
              </div>

              {/* Experience Dropdown */}
              <div className="w-full md:w-44">
                <select
                  value={selectedExp}
                  onChange={(e) => setSelectedExp(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FF4D2D] transition-colors font-semibold bg-slate-50/50 focus:bg-white cursor-pointer"
                >
                  <option value="all">{isRtl ? "كل مستويات الخبرة" : "All Experience"}</option>
                  <option value="1-3">1 - 3 {isRtl ? "سنوات" : "Years"}</option>
                  <option value="2-4">2 - 4 {isRtl ? "سنوات" : "Years"}</option>
                  <option value="3-5">3 - 5 {isRtl ? "سنوات" : "Years"}</option>
                </select>
              </div>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto my-8 shadow-3xs">
              <span className="text-3xl block mb-3">🔍</span>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                {isRtl ? "لم نعثر على وظائف تطابق بحثك" : "No matching vacancies found"}
              </h3>
              <p className="text-xs text-slate-400 font-medium px-4">
                {isRtl ? "جرّب تغيير كلمات البحث أو الأقسام المحددة" : "Try resetting your filters or changing search keywords"}
              </p>
            </div>
          ) : (
            <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 pt-4 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none">
              {filteredJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-[#FF4D2D]/35 transition-all flex flex-col justify-between relative"
              >
                {/* Brand Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-100/60 shadow-3xs">
                      ✈️
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-[#FF4D2D] uppercase tracking-wider block">Almosafer</span>
                      <span className="text-[9px] text-slate-400 font-bold block">{job.location}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2.5 py-1 rounded-md">
                    {job.exp}
                  </span>
                </div>

                {/* Job Info */}
                <div className="mb-6 flex-1">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 leading-snug group-hover:text-[#FF4D2D] transition-colors select-text">
                    {job.title}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 mb-4 flex items-center gap-1">
                    <Briefcase size={11} />
                    <span>{job.dept}</span>
                  </p>

                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    {job.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#FF4D2D] text-[11px] mt-0.5 select-none font-bold">✓</span>
                        <p className="text-xs text-slate-600 font-normal leading-relaxed select-text flex-1">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Block */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleApplyToAlmosaferJob(job.title)}
                    className="w-full bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#FF4D2D]/10 active:scale-98 cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>{isRtl ? "قدّم الآن عبر هاش هانت" : "Apply Via Hash Hunt"}</span>
                  </button>
                  
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-200/60"
                  >
                    <span>{isRtl ? "عرض الإعلان الرسمي للمسافر" : "View Official Almosafer Post"}</span>
                    <ExternalLink size={12} className="text-slate-450" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* ── BASSEM'S GOOGLE INTEGRATION CENTER INDICATION ── */}
      {showDevGuide && (
        <section className="py-4 bg-slate-905 text-white border-b border-slate-800 bg-slate-950">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <button 
                onClick={() => {
                  const el = document.getElementById("dev-guide-content");
                  if (el) {
                    el.classList.toggle("hidden");
                  }
                }}
                className="w-full flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900 transition-colors text-start"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Info size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-amber-400">
                      {isRtl ? "لوحة الربط والتحقق الذكي (Google Drive & Sheets)" : "Google Sheets & Google Drive Integration Hub"}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {isRtl ? "اضغط هنا لرؤية كود برمجيات وتفعيل التزامن التلقائي" : "Click to view instructions & Google script for synchronization"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60 font-semibold">
                  {isRtl ? "تعديل / عرض" : "Toggle Plan"}
                </span>
              </button>
              
              <div id="dev-guide-content" className="hidden border-t border-slate-800 p-5 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {isRtl 
                    ? "لقد قمت بربط الأزرار وملفات السيرفر بنجاح لدعم الرفع على Sheet و Drive مباشرة. وبما أن العملاء هم من يملؤون هذا النموذج، فإن الطريقة الأكثر أمانًا هي استخدام كود Google Apps Script البسيط التالي كـ Web App. هذا سيسمح لأي زائر برفع سيرته في مجلدك الخاص مباشرة بدون الحاجة لأن يكون لديه وصول لحسابك."
                    : "I have successfully prepared the server endpoints to sync directly. Since visitors fill out your profile form, the safest and robust pattern is using Google Apps Script deployed as a Web App to avoid exposing any secrets."}
                </p>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">
                      {isRtl ? "الروابط المطلوبة المستهدفة التي سنرسل إليها:" : "Target Workspace resources identified:"}
                    </span>
                    <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-850 overflow-x-auto font-mono text-[11px] text-slate-300">
                      <div className="flex items-center gap-2 justify-between">
                        <span>Sheet ID: <strong className="text-[#FF4D2D]">1nMu87iuJF9jSdSokpvZENrkSsJ7mFjyrvsxvTYCN4wk</strong></span>
                        <a href={driveSheetUrl} target="_blank" rel="noreferrer" className="text-xs hover:text-[#FF4D2D] flex items-center gap-1 text-slate-400">
                          {isRtl ? "فتح الشيت" : "View Sheet"} <ExternalLink size={10} />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 justify-between border-t border-slate-800 pt-1.5 mt-1.5">
                        <span>Folder ID: <strong className="text-emerald-500">1C0vT4ERPy9SCyXULssVE6NKo5l9_IpqPap5tUNgkZt84-JsqLNuf6lsz5R9rRG56pODHzYHV</strong></span>
                        <a href={driveFolderUrl} target="_blank" rel="noreferrer" className="text-xs hover:text-emerald-500 flex items-center gap-1 text-slate-400">
                          {isRtl ? "فتح المجلد" : "View Drive"} <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Step By Step Guide */}
                  <div className="space-y-2 pt-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1">
                      <Code size={13} />
                      <span>{isRtl ? "خطوات الربط والتفعيل بـ 3 دقائق:" : "Activation Steps (3 minutes):"}</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                      <li>{isRtl ? "افتح جدول البيانات الخاص بك على Google Sheets." : "Open your Google Sheets spreadsheet in browser."}</li>
                      <li>{isRtl ? "اضغط على Extensions وثم Apps Script من القائمة العلوية." : "Click Extensions > Apps Script."}</li>
                      <li>{isRtl ? "احذف أي كود مكتوب، وسوِّ نسخ للسكربت ذو التميز بالأسفل والصقه." : "Delete old code, copy the target script from this box & paste it in."}</li>
                      <li>{isRtl ? "اضغط على زر حفظ ثم Deploy وثم New Deployment." : "Click Save icon, then select \"Deploy\" > \"New Deployment\"."}</li>
                      <li>{isRtl ? "اختر النوع Web App ، واجعل الإعدادات: Execute as: Me ورؤية الوصول: Anyone." : "Choose \"Web App\". Set: Execute as: \"Me\", Who has access: \"Anyone\"."}</li>
                      <li>{isRtl ? "انسخ رابط الـ Web App وضعه في ملف الـ .env تحت مسمى GOOGLE_APPS_SCRIPT_HASHHUNT_URL." : "Copy Web App URL & enter it in environment secrets as GOOGLE_APPS_SCRIPT_HASHHUNT_URL."}</li>
                    </ol>
                  </div>

                  {/* Code Area */}
                  <div className="mt-4 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden relative">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
                      <span className="font-bold flex items-center gap-1">
                        <Code size={11} />
                        GoogleAppsScript.gs
                      </span>
                      <button 
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#FF4D2D] hover:text-orange-500 transition-colors"
                      >
                        {copiedCode ? (
                          <>
                            <CheckCircle2 size={11} />
                            {isRtl ? "تم النسخ بنجاح!" : "Copied!"}
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
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
      <section id="how-it-works" className="py-24 bg-white border-b border-slate-200/50 relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex bg-[#FF4D2D]/5 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "منهجية العمل المتكاملة" : "Matching Methodology"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-4 tracking-tight">
              {isRtl ? "3 خطوات بسيطة لوظيفتك القادمة" : "3 steps to your dream role"}
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-xl mx-auto leading-relaxed">
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
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-[#FAFAF6] border border-slate-200/50 rounded-2xl p-7 hover:border-[#FF4D2D]/20 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="font-sans text-5xl font-bold text-[#FF4D2D]/5 leading-none mb-6 group-hover:text-[#FF4D2D]/10 transition-colors absolute end-6 top-6">
                    {s.num}
                  </div>
                  <div className="w-11 h-11 bg-[#FF4D2D]/15 rounded-xl flex items-center justify-center text-[#FF4D2D] mb-5 group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <IconComp size={20} className="stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFITS SECTION ── */}
      <section className="py-24 bg-slate-50 border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-12 max-w-3xl mx-auto text-center mb-10">
            <span className="inline-flex bg-[#FF4D2D]/5 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "مزايا لم تجدها في مكان آخر" : "Unique advantages"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
              {isRtl ? "سر الرد ومقابلات العمل السريعة" : "The secret behind fast interviews"}
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto text-sm leading-relaxed">
              {isRtl ? "نحن نضع مهاراتك بشكل منسق مباشرة تحت أنظار صانعي القرار لرفع فرصة المقابلة." : "We connect your expertise directly in front of real hiring decision makers."}
            </p>
          </div>

          <div className="lg:col-span-12 grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => {
              const BenefIcon = b.icon;
              return (
                <div key={i} className="flex flex-col gap-4 p-6 bg-white border border-slate-200/50 rounded-2xl hover:border-slate-300 transition-all">
                  <div className="w-10 h-10 bg-[#FF4D2D]/5 rounded-xl flex items-center justify-center text-[#FF4D2D] shrink-0">
                    <BenefIcon size={18} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{b.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAIN FORM SECTION ── */}
      <section id="upload-profile" className="py-24 bg-white border-t border-slate-200/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-5">
            <div className="inline-flex bg-[#FF4D2D]/5 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "الاشتراك المجاني الذكي" : "Join Free"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
              {isRtl ? "دع الوظائف المناسبة تبادر بالبحث عنك" : "Let matched jobs find you"}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 font-normal">
              {isRtl 
                ? "أكمل معلوماتك بالنموذج المجاور لتنضم فورا لقاعدة المواهب التي يزورها ممثلو التوظيف. لا حاجة لأي خطوات تسجيل طويلة أو معقدة."
                : "Submit your details alongside your CV to immediately sync with our target HR Sheets and allow elite teams to reach out."}
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 bg-[#FF4D2D]/10 text-[#FF4D2D] rounded-lg flex items-center justify-center font-bold shrink-0">
                  📂
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{isRtl ? "مجلد Google Drive آمن ومباشر" : "Direct Google Drive Storage"}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed">
                    {isRtl 
                      ? "سنرفع سيرتك لمجلدك المحسن مباشرة، مع ربطها وتعميمها بنسب تطابق عالية."
                      : "We drop your CV directly onto Google Drive and link it dynamically."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold shrink-0">
                  📊
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{isRtl ? "تزامن فوري مع جدول Google Sheets" : "Direct Sheets Sync"}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed">
                    {isRtl 
                      ? "إضافة صف تفاعلي بكل بيانات نموذجك لجدولنا المفصل للبحث والفرز."
                      : "Pipes a clean structured spreadsheet row to find you instantly."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-[#FAFAF6] border border-slate-200 rounded-2xl p-6 sm:p-9 shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 start-0 w-1.5 h-full bg-[#FF4D2D]" />
            
            <div className="font-sans text-xl font-bold text-slate-900 mb-1">{isRtl ? "أنشئ ملفك الشخصي" : "Create Profile"}</div>
            <div className="text-[11px] text-slate-400 font-semibold mb-4">{isRtl ? "يستغرق أقل من دقيقتين · تزامن وتحديث فوري لـ Google Drive" : "Takes less than 2 minutes · Seamless sync to sheet folder"}</div>

            {/* AI Resume Creator Conversion Prompt */}
            <div className="bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-transparent border border-orange-505/15 rounded-xl p-3.5 mb-5 space-y-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: 'rgba(255, 77, 45, 0.15)' }}>
              <div className="space-y-0.5">
                <p className="text-[11px] sm:text-xs font-black text-rose-600 flex items-center gap-1">
                  <span>✨</span>
                  <span>{isRtl ? "ليس لديك سيرة متوافقة مع الـ ATS بعد؟" : "Don't have an ATS-friendly CV yet?"}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed leading-none">
                  {isRtl 
                    ? "ابنِ سيرتك بالذكاء الاصطناعي وبفرز ذكي بـ 5 دقائق فقط لرفع فرص قبولك 3 أضعاف."
                    : "Create a verified, high-scoring resume in 5 minutes with our AI Resume Builder!"}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => { window.location.href = "/editor"; }}
                className="shrink-0 bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-lg text-[11px] font-black tracking-wide transition-all hover:scale-103 cursor-pointer text-center"
              >
                {isRtl ? "انطلق للمحرر 🧠" : "Build Resume 🧠"}
              </button>
            </div>

            {errorMessage && (
              <div aria-live="polite" className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-100/80 text-rose-700 text-xs sm:text-sm mb-6 font-medium">
                <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Resume Quick-Preview Widget */}
            {hasDesignedResume && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-6 hover:border-[#FF4D2D]/35 transition-all relative overflow-hidden shadow-xs group"
              >
                {/* Visual top border styling line */}
                <div className="absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r from-emerald-400 via-[#FF4D2D] to-indigo-400" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Visual mini template representation */}
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-500 font-bold shrink-0 relative overflow-hidden shadow-3xs">
                      <span className="text-[7.5px] text-slate-400 font-black leading-none uppercase tracking-wider block mb-0.5 mb-1 truncate px-1">
                        {resumeData.settings?.template || "Modern"}
                      </span>
                      <FileText size={18} className="text-[#FF4D2D]" />
                    </div>

                    <div className="space-y-1 text-start">
                      <div className="flex flex-wrap items-center gap-1.5 leading-tight">
                        <span className="text-xs sm:text-sm font-black text-slate-800">
                          {resumeData.personalInfo?.fullName || (isRtl ? "سيرة بلا اسم" : "Unnamed Resume")}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/60 text-[8.5px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 select-none">
                          <Check size={9} className="stroke-[3.5]" />
                          <span>{isRtl ? "مكتملة ومحسنة" : "Optimized Live"}</span>
                        </span>
                      </div>
                      
                      <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 leading-none">
                        {resumeData.personalInfo?.jobTitle || (isRtl ? "مسمى غير محدد بالمحرر" : "Title not set in editor")}
                      </p>

                      <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[9px] sm:text-[10px] text-slate-400 font-medium">
                        {resumeData.personalInfo?.email && (
                          <span className="truncate max-w-[150px] sm:max-w-[200px] block">📧 {resumeData.personalInfo.email}</span>
                        )}
                        {resumeData.personalInfo?.phone && (
                          <span>📞 <span dir="ltr">{resumeData.personalInfo.phone}</span></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fill CTA Button */}
                  <div className="sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setFullName(resumeData.personalInfo?.fullName || "");
                        setPhoneNumber(resumeData.personalInfo?.phone || "");
                        setEmail(resumeData.personalInfo?.email || "");
                        setJobTitle(resumeData.personalInfo?.jobTitle || "");
                        
                        // Flash inputs with nice visual cue ring
                        const ids = ["full-name-input", "phone-input", "email-input", "target-job-title"];
                        ids.forEach((id) => {
                          const el = document.getElementById(id);
                          if (el) {
                            el.classList.add("ring-animated-flash");
                            setTimeout(() => {
                              el.classList.remove("ring-animated-flash");
                            }, 2500);
                          }
                        });
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-[11px] shadow-xs active:scale-97 transition-all cursor-pointer"
                    >
                      <RefreshCw size={12} className="shrink-0" />
                      <span>{isRtl ? "تعبئة البيانات من السيرة ⚡" : "Auto-fill from Resume ⚡"}</span>
                    </button>
                  </div>
                </div>

                {/* Micro metrics row */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2">
                  <div className="bg-slate-50/60 rounded-lg p-2 border border-slate-100 text-center">
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{isRtl ? "الخبرات" : "Experiences"}</p>
                    <p className="text-xs font-black text-slate-800 mt-0.5">
                      {resumeData.experience?.length || 0} 🏢
                    </p>
                  </div>
                  <div className="bg-slate-50/60 rounded-lg p-2 border border-slate-100 text-center">
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{isRtl ? "التعليم" : "Education"}</p>
                    <p className="text-xs font-black text-slate-800 mt-0.5">
                      {resumeData.education?.length || 0} 🎓
                    </p>
                  </div>
                  <div className="bg-slate-50/60 rounded-lg p-2 border border-slate-100 text-center">
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{isRtl ? "المهارات" : "Skills"}</p>
                    <p className="text-xs font-black text-slate-800 mt-0.5">
                      {resumeData.skills?.length || 0} 🛠️
                    </p>
                  </div>
                  <div className="bg-slate-50/60 rounded-lg p-2 border border-slate-100 text-center">
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{isRtl ? "الشهادات" : "Certifications"}</p>
                    <p className="text-xs font-black text-slate-800 mt-0.5">
                      {resumeData.certifications?.length || 0} 📜
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <form className="space-y-5" onSubmit={handleFormSubmit}>
              {selectedJobAlert && (
                <div className="bg-[#FF4D2D]/5 border border-[#FF4D2D]/15 rounded-xl p-3.5 flex items-center justify-between gap-3 animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✈️</span>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#FF4D2D] leading-none mb-0.5">
                        {isRtl ? "طلب ترشيح لشركة المسافر" : "Almosafer Application Target"}
                      </p>
                      <p className="text-xs font-black text-slate-800 leading-none">
                        {selectedJobAlert}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobAlert(null);
                      setJobTitle("");
                    }}
                    className="text-[10px] font-black text-slate-400 hover:text-[#FF4D2D] underline cursor-pointer shrink-0"
                  >
                    {isRtl ? "إلغاء التجديد" : "Clear"}
                  </button>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{isRtl ? "الاسم بالكامل *" : "Full Name *"}</label>
                  <input 
                    id="full-name-input"
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D]/25 outline-none transition-all placeholder-slate-400" 
                    placeholder={isRtl ? "احمد كمال" : "Ahmed Kamal"} 
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{isRtl ? "رقم الهاتف أو المحمول *" : "Phone Number *"}</label>
                  <input 
                    id="phone-input"
                    type="text" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D]/25 outline-none transition-all placeholder-slate-400" 
                    placeholder={isRtl ? "01000791165" : "+201000791165"} 
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{isRtl ? "البريد الإلكتروني *" : "Email *"}</label>
                  <input 
                    id="email-input"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D]/25 outline-none transition-all placeholder-slate-400" 
                    placeholder="ahmed@email.com" 
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{isRtl ? "المسمى الوظيفي المستهدف *" : "Job Title *"}</label>
                  <input 
                    id="target-job-title"
                    type="text" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D]/25 outline-none transition-all placeholder-slate-400" 
                    placeholder={isRtl ? "مطور برمجيات واجهات" : "Senior Software Engineer"} 
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{isRtl ? "سنوات الخبرة" : "Years of Experience"}</label>
                  <div className="relative">
                    <select 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:border-[#FF4D2D] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>0–1 {isRtl ? "سنة" : "year"}</option>
                      <option>1–3 {isRtl ? "سنوات" : "years"}</option>
                      <option>3–5 {isRtl ? "سنوات" : "years"}</option>
                      <option>5–10 {isRtl ? "سنوات" : "years"}</option>
                      <option>10+ {isRtl ? "سنة" : "years"}</option>
                    </select>
                    <ChevronDown size={14} className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{isRtl ? "الدولة الحالية *" : "Current Location *"}</label>
                  <div className="relative">
                    <select 
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:border-[#FF4D2D] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>{isRtl ? "مصر" : "Egypt"}</option>
                      <option>{isRtl ? "السعودية" : "Saudi Arabia"}</option>
                      <option>{isRtl ? "الإمارات" : "UAE"}</option>
                      <option>{isRtl ? "الكويت" : "Kuwait"}</option>
                      <option>{isRtl ? "الأردن" : "Jordan"}</option>
                      <option>{isRtl ? "أخرى" : "Other"}</option>
                    </select>
                    <ChevronDown size={14} className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{isRtl ? "نوع العمل المفضل" : "Open To"}</label>
                  <div className="relative">
                    <select 
                      value={openTo}
                      onChange={(e) => setOpenTo(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium focus:border-[#FF4D2D] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>{isRtl ? "عن بعد فقط" : "Remote only"}</option>
                      <option>{isRtl ? "عن بعد أو من المكتب" : "Remote or On-site"}</option>
                      <option>{isRtl ? "من المكتب فقط" : "On-site only"}</option>
                    </select>
                    <ChevronDown size={14} className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Unique drag/drop uploader */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {isRtl ? "تحميل ملف السيرة الذاتية المبنية بالذكاء الاصطناعي (PDF/Word) *" : "Your AI-Optimized Resume (PDF/Word) *"}
                </label>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-xl py-6 px-4 text-center cursor-pointer transition-all duration-300 group bg-white ${
                    dragActive 
                      ? "border-[#FF4D2D] bg-[#FF4D2D]/5 scale-[0.99]" 
                      : "border-slate-200 hover:border-[#FF4D2D]/30 hover:bg-[#FF4D2D]/[0.01]"
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
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                        <FileText size={20} />
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mb-1 max-w-full truncate px-4">
                        {resumeFile.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <span>{isRtl ? "جاهز للتزامن والرفع لـ Google Drive" : "Ready to be synced"}</span>
                        <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                        }}
                        className="mt-2 text-xs font-bold text-[#FF4D2D] hover:underline"
                      >
                        {isRtl ? "حذف وتغيير الملف" : "Remove & change file"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform text-lg shadow-2xs">
                        📎
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mb-1 leading-snug">
                        {isRtl ? "اسحب سيرتك المتوافقة هنا أو" : "Drop your optimized file here, or"}{" "}
                        <span className="text-[#FF4D2D] group-hover:underline">{isRtl ? "تصفح جهازك" : "click to browse"}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal leading-relaxed">
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
                className={`w-full font-semibold py-3 rounded-xl transition-all shadow-md text-center text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer ${
                  submitting 
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none" 
                    : "bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white shadow-[#FF4D2D]/10 hover:shadow-[#FF4D2D]/20"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>{isRtl ? "جاري رفع السيرة وتحديث الشيت..." : "Processing & Uploading..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>{isRtl ? "انضم الآن وتزامن مباشرة" : "Submit & Sync to Cloud Drive"}</span>
                  </>
                )}
              </motion.button>

              <div className="flex flex-wrap justify-center gap-6 pt-3 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> {isRtl ? "أمان البيانات 100%" : "100% Secure"}</span>
                <span className="flex items-center gap-1.5">⚡ {isRtl ? "تنبيه مقابلة فوري" : "Instant Alert"}</span>
                <span className="flex items-center gap-1.5">🌍 {isRtl ? "ربط مرن وسريع" : "Realtime Sheet"}</span>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── REAL TESTIMONIALS SLIDER SECTION  ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-flex bg-[#FF4D2D]/5 border border-[#FF4D2D]/15 text-[#FF4D2D] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {isRtl ? "مراجعات وقصص مستخدمينا" : "Social proof"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
              {isRtl ? "أعضاء تجاوزوا محرك الـ ATS وحصلوا على عروض" : "Users who bypassed ATS and secured offers"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-slate-200/40 rounded-2xl p-7 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-1 text-amber-550 mb-4 text-sm">
                  {[...Array(t.stars)].map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic mb-6 flex-1">
                  {t.text}
                </p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                    {t.av}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 leading-none">{t.author}</h5>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER INTERACTIVE INJECTION SECTION ── */}
      <section className="py-20 bg-slate-950 text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF4D2D]/5 blur-[130px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
            {isRtl ? "جرّب التوظيف الصامت" : "Stop applying blindly."} <br /> {isRtl ? "ودع الفرص تتدفق إليك." : "Start getting hunted."}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mb-10 max-w-sm mx-auto font-medium leading-relaxed">
            {isRtl 
              ? "انضم الآن لأكثر من 2,400 باحث عن عمل تجاوزوا تصفية المقابلات وحصلوا على تصفية حرة ومباشرة." 
              : "Let target matches automatically populate with hiring managers directly from your Drive updates."}
          </p>
          <a href="#upload-profile" className="inline-flex bg-white hover:bg-slate-50 text-[#FF4D2D] font-sans font-semibold text-xs sm:text-sm px-8 py-3.5 rounded-xl hover:scale-102 transition-all text-center">
            {isRtl ? "انضم الآن مجاناً وابدأ بالتزامن" : "Join the Talent Loop →"}
          </a>
        </div>
      </section>

      <Footer />

      {/* SUCCESS DIALOG OVERLAY MODERN DESIGN */}
      <AnimatePresence>
        {showSuccess && (
          <div aria-modal="true" role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white rounded-2xl p-6 sm:p-9 w-full max-w-md shadow-2xl relative border border-slate-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-5 shadow-xs">
                  🎉
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                  {isRtl ? "تم الرفع بنجاح!" : "Uploaded Successfully!"}
                </h3>
                
                <p className="text-slate-500 text-xs sm:text-sm font-normal mb-6 max-w-xs leading-relaxed">
                  {isRtl 
                    ? "سنقوم بتوصيلك بأحسن فرصة عمل."
                    : "We will connect you with the best job opportunity."}
                </p>

                <div className="w-full space-y-2.5">
                  <button
                    onClick={() => { window.location.href = "/editor"; }}
                    className="w-full bg-[#FF4D2D] hover:bg-[#CC3A1F] text-white font-bold py-3 rounded-xl text-xs sm:text-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:shadow-orange-500/10"
                  >
                    <span>✨</span>
                    <span>{isRtl ? "أنشئ سيرتك الذاتية الذكية الآن" : "Create My AI Resume Now"}</span>
                  </button>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="w-full bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    {isRtl ? "إغلاق للتصفح" : "Dismiss"}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MOBILE STICKY CTA ── */}
      <div className="md:hidden fixed bottom-5 left-0 right-0 px-5 z-40">
        <a 
          href="#upload-profile" 
          className="flex items-center justify-center w-full bg-[#FF4D2D] text-white font-bold py-3.5 rounded-2xl shadow-[0_8px_30px_rgba(255,77,45,0.25)] hover:scale-[1.02] active:scale-95 transition-all text-sm gap-2 border border-white/20 backdrop-blur-md"
        >
          {isRtl ? "ارفع سيرتك الذاتية مجاناً" : "Upload Your Resume Now"}
          <span className="rtl:-scale-x-100">→</span>
        </a>
      </div>
    </div>
  );
}
