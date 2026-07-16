import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Briefcase, FileText, Award, Calendar, CheckCircle, Trash2, 
  Plus, Copy, MapPin, ExternalLink, 
  AlertCircle, ChevronRight, User, PlusCircle,
  Gift, Users
} from "lucide-react";
import { useLanguageStore } from "../store/useLanguageStore";
import { useResumeStore } from "../store/useResumeStore";

interface SavedResumeSlot {
  id: string;
  name: string;
  jobTitle: string;
  updatedAt: string;
  atsScore: number;
  data: any;
}

interface JobApplication {
  id: string;
  company: string;
  title: string;
  appliedDate: string;
  status: "Applied" | "Interviewing" | "Accepted" | "Rejected";
  location: string;
  link?: string;
  notes?: string;
}

export default function DashboardPage() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  
  // Resume store data
  const resumeState = useResumeStore();
  const currentResumeData = resumeState.data;

  // Active States
  const [activeTab, setActiveTab] = useState<"resumes" | "codes" | "applications" | "referral">("resumes");
  const [slots, setSlots] = useState<SavedResumeSlot[]>([]);
  const [codes, setCodes] = useState<string[]>([]);
  const [newCode, setNewCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState("");
  
  // Job applications states
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    company: "",
    title: "",
    status: "Applied" as JobApplication["status"],
    location: "",
    link: "",
    notes: ""
  });

  // Referral System States
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<{ email: string; date: string; status: string }[]>([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  // Load data from localStorage
  useEffect(() => {
    // Load local resume slots
    const savedSlots = localStorage.getItem("hashresume_saved_slots");
    if (savedSlots) {
      try {
        setSlots(JSON.parse(savedSlots));
      } catch (e) {
        console.error("Error parsing resume slots:", e);
      }
    } else {
      // Create initial slot from current resume store if data exists
      const initialSlots: SavedResumeSlot[] = [
        {
          id: "slot_default",
          name: isAr ? "مسودة السيرة الذاتية الأساسية" : "Primary Resume Draft",
          jobTitle: currentResumeData.personalInfo?.jobTitle || (isAr ? "مطور برمجيات" : "Software Developer"),
          updatedAt: new Date().toLocaleDateString(isAr ? "ar-EG" : "en-US"),
          atsScore: 78,
          data: currentResumeData
        }
      ];
      setSlots(initialSlots);
      localStorage.setItem("hashresume_saved_slots", JSON.stringify(initialSlots));
    }

    // Load paid codes
    const savedCodes = localStorage.getItem("hashresume_approved_codes");
    if (savedCodes) {
      try {
        setCodes(JSON.parse(savedCodes));
      } catch (e) {
        console.error("Error parsing codes:", e);
      }
    } else {
      const cvCode = localStorage.getItem("cv-last-used-code");
      if (cvCode) {
        setCodes([cvCode]);
        localStorage.setItem("hashresume_approved_codes", JSON.stringify([cvCode]));
      }
    }

    // Load job applications
    const savedApps = localStorage.getItem("hashresume_job_applications");
    if (savedApps) {
      try {
        setApplications(JSON.parse(savedApps));
      } catch (e) {
        console.error("Error parsing applications:", e);
      }
    } else {
      // Seed some dummy applications so dashboard doesn't look barren initially
      const defaultApps: JobApplication[] = [
        {
          id: "app_1",
          company: "Vodafone Egypt",
          title: "Frontend Developer",
          appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(isAr ? "ar-EG" : "en-US"),
          status: "Interviewing",
          location: "Smart Village, Giza",
          notes: isAr ? "تم تحديد موعد مقابلة تقنية ثانية يوم الأحد القادم." : "Technical interview scheduled for next Sunday."
        },
        {
          id: "app_2",
          company: "Dell Technologies",
          title: "Software Engineer",
          appliedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString(isAr ? "ar-EG" : "en-US"),
          status: "Applied",
          location: "New Cairo",
          link: "https://jobs.dell.com"
        }
      ];
      setApplications(defaultApps);
      localStorage.setItem("hashresume_job_applications", JSON.stringify(defaultApps));
    }

    // Load referral system values
    const name = currentResumeData.personalInfo?.fullName || "USER";
    const slug = name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "X") || "MEMBER";
    const rand = Math.floor(1000 + Math.random() * 9000);
    setReferralCode(`REF-${slug}-${rand}`);

    const savedRefs = localStorage.getItem("hashresume_referrals");
    if (savedRefs) {
      try {
        setReferrals(JSON.parse(savedRefs));
      } catch (e) {
        console.error("Error parsing referrals:", e);
      }
    } else {
      const defaultRefs = [
        { email: "omar.hassan@gmail.com", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(isAr ? "ar-EG" : "en-US"), status: isAr ? "نشط (تم الحصول على كود تحميل مجاني) ✅" : "Active (Earned 1 Free Premium Download) ✅" },
        { email: "youssef_samy@yahoo.com", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toLocaleDateString(isAr ? "ar-EG" : "en-US"), status: isAr ? "انتظار إتمام الشراء" : "Pending Purchase" }
      ];
      setReferrals(defaultRefs);
      localStorage.setItem("hashresume_referrals", JSON.stringify(defaultRefs));
    }
  }, [isAr, currentResumeData.personalInfo?.fullName]);

  // Manage resume slots
  const handleSaveCurrentAsNewSlot = () => {
    const slotName = prompt(
      isAr ? "أدخل اسماً لهذه المسودة الجديدة:" : "Enter a name for this new draft:",
      isAr ? `مسودة سيرة ذاتية #${slots.length + 1}` : `Resume Draft #${slots.length + 1}`
    );
    if (!slotName) return;

    const newSlot: SavedResumeSlot = {
      id: "slot_" + Date.now(),
      name: slotName,
      jobTitle: currentResumeData.personalInfo?.jobTitle || (isAr ? "عنوان وظيفي" : "Job Title"),
      updatedAt: new Date().toLocaleDateString(isAr ? "ar-EG" : "en-US"),
      atsScore: Math.floor(Math.random() * 25) + 65, // simulated ATS score for safety
      data: JSON.parse(JSON.stringify(currentResumeData))
    };

    const updated = [newSlot, ...slots];
    setSlots(updated);
    localStorage.setItem("hashresume_saved_slots", JSON.stringify(updated));
  };

  const handleLoadSlot = (slot: SavedResumeSlot) => {
    if (confirm(isAr ? `هل تريد تحميل واستبدال المسودة النشطة بـ "${slot.name}"؟` : `Are you sure you want to load "${slot.name}"? This will overwrite your active draft.`)) {
      // Overwrite the current active store data
      resumeState.setData(slot.data);
      alert(isAr ? "تم تحميل السيرة الذاتية إلى المحرر بنجاح!" : "Resume loaded into editor successfully!");
    }
  };

  const handleDeleteSlot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(isAr ? "هل أنت متأكد من حذف هذه المسودة نهائياً؟" : "Are you sure you want to permanently delete this draft?")) {
      const updated = slots.filter(s => s.id !== id);
      setSlots(updated);
      localStorage.setItem("hashresume_saved_slots", JSON.stringify(updated));
    }
  };

  // Manage codes
  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");
    setCodeSuccess("");

    if (!newCode.trim()) return;

    const cleanCode = newCode.trim().toUpperCase();

    // Verify code formatting/correctness (codes usually start with HSH)
    if (!cleanCode.startsWith("HSH-")) {
      setCodeError(isAr ? "تنسيق الكود غير صحيح. الأكواد الصالحة تبدأ بـ HSH-" : "Invalid code format. Active codes start with 'HSH-'");
      return;
    }

    if (codes.includes(cleanCode)) {
      setCodeError(isAr ? "هذا الكود مضاف بالفعل في حسابك." : "This code has already been added.");
      return;
    }

    // Add code successfully
    const updated = [...codes, cleanCode];
    setCodes(updated);
    localStorage.setItem("hashresume_approved_codes", JSON.stringify(updated));
    
    // Unlock premium features if applicable
    localStorage.setItem("cv-last-used-code", cleanCode);
    resumeState.unlockPremium(
      currentResumeData.personalInfo?.fullName || "User",
      currentResumeData.personalInfo?.email || "user@hashresume.com",
      ""
    );

    setCodeSuccess(isAr ? "تم تفعيل الكود بنجاح! السيرة الذاتية الآن مفتوحة للتحميل بدون علامات مائية." : "Code activated successfully! Your resume downloads are unlocked.");
    setNewCode("");
  };

  // Manage job applications
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.company || !newJob.title) return;

    const newApp: JobApplication = {
      id: "job_" + Date.now(),
      company: newJob.company,
      title: newJob.title,
      status: newJob.status,
      location: newJob.location,
      link: newJob.link,
      appliedDate: new Date().toLocaleDateString(isAr ? "ar-EG" : "en-US"),
      notes: newJob.notes
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem("hashresume_job_applications", JSON.stringify(updated));

    // Reset Form & Close
    setNewJob({
      company: "",
      title: "",
      status: "Applied",
      location: "",
      link: "",
      notes: ""
    });
    setShowAddJobModal(false);
  };

  const handleDeleteJob = (id: string) => {
    if (confirm(isAr ? "هل تريد إزالة طلب التوظيف هذا؟" : "Are you sure you want to remove this job application?")) {
      const updated = applications.filter(a => a.id !== id);
      setApplications(updated);
      localStorage.setItem("hashresume_job_applications", JSON.stringify(updated));
    }
  };

  const handleUpdateJobStatus = (id: string, status: JobApplication["status"]) => {
    const updated = applications.map(a => a.id === id ? { ...a, status } : a);
    setApplications(updated);
    localStorage.setItem("hashresume_job_applications", JSON.stringify(updated));
  };

  // Manage Referral invites
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail.trim()) return;

    setInviteSuccess("");
    const newRef = {
      email: friendEmail.trim(),
      date: new Date().toLocaleDateString(isAr ? "ar-EG" : "en-US"),
      status: isAr ? "تم إرسال الدعوة بنجاح" : "Invitation Sent"
    };

    const updated = [newRef, ...referrals];
    setReferrals(updated);
    localStorage.setItem("hashresume_referrals", JSON.stringify(updated));

    setInviteSuccess(isAr ? "تم إرسال دعوة البريد الإلكتروني بنجاح! سيتم تفعيل مكافأتك بمجرد تسجيل صديقك." : "Invitation sent successfully! Your reward will activate once your friend signs up.");
    setFriendEmail("");
  };

  const handleCopyReferralText = () => {
    const text = isAr 
      ? `اصنع سيرة ذاتية احترافية ومتوافقة مع أنظمة الـ ATS في دقائق عبر Hash Resume! استخدم كود الخصم الخاص بي للحصول على خصم 20%: ${referralCode} \nرابط الموقع: https://hashresume.com?ref=${referralCode}`
      : `Create a professional ATS-optimized resume in minutes with Hash Resume! Use my personal discount code for 20% off: ${referralCode} \nWebsite: https://hashresume.com?ref=${referralCode}`;
    
    navigator.clipboard.writeText(text);
    alert(isAr ? "تم نسخ نص الإحالة ورابط الخصم بنجاح!" : "Referral link & code copied successfully!");
  };

  return (
    <>
      <Helmet>
        <title>
          {isAr ? "لوحة التحكم وإدارة المسودات | Hash Resume" : "User Dashboard & Resume Station | Hash Resume"}
        </title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 pb-24" dir={isAr ? "rtl" : "ltr"}>
        {/* Upper Brand Jumbotron Banner */}
        <div className="bg-[#001639] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-brand-600/20 via-transparent to-transparent opacity-60" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-500/20 border border-brand-500/30 text-brand-300 px-3 py-1 rounded-full">
                {isAr ? "لوحة تحكم المستخدم" : "PERSONAL DASHBOARD"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                {isAr ? "محطة إدارة سيرتك الذاتية 💼" : "Your Professional Resume Station 💼"}
              </h1>
              <p className="text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                {isAr 
                  ? "قم بإدارة مسودات سيرتك الذاتية المتعددة، تفعيل وحفظ أكواد الاشتراك المدفوع، ومتابعة حالات تقديمك للوظائف في مكان واحد."
                  : "Organize drafts, activate discount & download keys, and track active career opportunities in one clean panel."}
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <Link
                to="/editor"
                className="px-6 py-3 bg-[#E64528] hover:bg-[#ff5637] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-[#E64528]/20 cursor-pointer"
              >
                <Plus size={16} />
                <span>{isAr ? "افتح محرر السيرة المباشر" : "Open Live Resume Builder"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Core Nav Tabs block */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-3 flex flex-wrap gap-2">
            {[
              { id: "resumes", label: isAr ? "السير الذاتية المحفوظة" : "Saved Resumes", count: slots.length, icon: FileText },
              { id: "codes", label: isAr ? "أكواد الاشتراك والتحميل" : "Subscription Codes", count: codes.length, icon: Award },
              { id: "applications", label: isAr ? "متابعة طلبات التوظيف" : "Job Tracker", count: applications.length, icon: Briefcase },
              { id: "referral", label: isAr ? "برنامج الإحالة والمكافآت" : "Refer & Earn", count: referrals.length, icon: Gift }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition-all cursor-pointer select-none ${
                    isActive 
                      ? "bg-[#001639] text-white shadow-md shadow-slate-900/10" 
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <TabIcon size={15} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tab Body content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          
          {/* TAB 1: Saved Resumes */}
          {activeTab === "resumes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900">{isAr ? "إدارة مسوداتك المحفوظة" : "Your Saved Resume Drafts"}</h3>
                  <p className="text-xs text-slate-500">{isAr ? "يمكنك حفظ وتخزين نسخ متعددة لكل وظيفة تتقدم إليها." : "Create distinct tailored versions for different job listings."}</p>
                </div>
                <button
                  onClick={handleSaveCurrentAsNewSlot}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <PlusCircle size={14} />
                  <span>{isAr ? "حفظ المسودة الحالية كنسخة جديدة" : "Save Active Draft as Copy"}</span>
                </button>
              </div>

              {slots.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center space-y-4">
                  <FileText size={40} className="text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-700">{isAr ? "لا توجد مسودات إضافية حالياً" : "No saved drafts yet"}</p>
                    <p className="text-xs text-slate-400">{isAr ? "يمكنك أخذ نسخة احتياطية من سيرتك الحالية لحفظها بأمان." : "Save a copy of your active editor setup here as back up."}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {slots.map(slot => (
                    <div 
                      key={slot.id} 
                      onClick={() => handleLoadSlot(slot)}
                      className="bg-white border border-slate-200 hover:border-brand-500 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer relative group flex flex-col justify-between min-h-[180px]"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-brand-500 transition-colors leading-tight">
                              {slot.name}
                            </h4>
                            <p className="text-xs text-slate-400 font-semibold">{slot.jobTitle}</p>
                          </div>
                          
                          <button
                            onClick={(e) => handleDeleteSlot(slot.id, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title={isAr ? "حذف المسودة" : "Delete Draft"}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {isAr ? `تحديث: ${slot.updatedAt}` : `Updated: ${slot.updatedAt}`}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{isAr ? "ATS ملائم" : "ATS Optimized"}</span>
                        </div>
                        <span className="text-[#E64528] flex items-center gap-1 group-hover:translate-x-1 duration-200 rtl:group-hover:-translate-x-1">
                          {isAr ? "تحميل للمحرر" : "Load in Editor"}
                          <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Paid Codes */}
          {activeTab === "codes" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form column */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">{isAr ? "تفعيل كود تحميل جديد" : "Activate Download Code"}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isAr
                      ? "هل قمت بالشراء يدوياً أو تملك كود تفعيل؟ أدخله هنا لتطبيق فوري وفتح السير الذاتية بلا حدود."
                      : "Did you buy manually or have a voucher code? Activate it here to download watermark-free PDFs."}
                  </p>
                </div>

                <form onSubmit={handleAddCode} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? "كود التفعيل" : "Activation Code"}</label>
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="HSH-XX-XXXXXX"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-mono uppercase tracking-widest focus:border-slate-900 outline-none"
                    />
                  </div>

                  {codeError && (
                    <div className="flex gap-2 p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-xs font-medium">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{codeError}</span>
                    </div>
                  )}

                  {codeSuccess && (
                    <div className="flex gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-150 text-xs font-medium">
                      <CheckCircle size={14} className="shrink-0 animate-pulse" />
                      <span>{codeSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#001639] hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors"
                  >
                    {isAr ? "تحقق وتفعيل الكود" : "Verify & Activate Code"}
                  </button>
                </form>
              </div>

              {/* Codes list column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">{isAr ? "أكوادك النشطة والمدفوعة" : "Your Active Purchase Codes"}</h3>
                  <p className="text-xs text-slate-500">{isAr ? "الأكواد الصالحة لتخطي العلامة المائية والحفظ بلا حدود." : "Use these voucher keys inside the editor to unlock exports."}</p>
                </div>

                {codes.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4">
                    <Award size={36} className="text-slate-300 mx-auto animate-pulse" />
                    <div className="space-y-1 max-w-sm mx-auto">
                      <p className="font-bold text-slate-700">{isAr ? "لا توجد أكواد نشطة بعد" : "No active vouchers found"}</p>
                      <p className="text-xs text-slate-400">
                        {isAr 
                          ? "لم نجد أي أكواد تفعيل نشطة في متصفحك. تظهر الأكواد تلقائياً هنا بعد الشراء مباشرة."
                          : "Vouchers purchased or used on this browser will list here automatically."}
                      </p>
                    </div>
                    <Link
                      to="/pricing"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <span>{isAr ? "تصفح باقات التحميل" : "Browse Download Packages"}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {codes.map((code, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-50 text-[#001639] flex items-center justify-center">
                            <Award size={18} />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block leading-none mb-1">
                              {isAr ? `الكود المعتمد #${idx + 1}` : `Verified Voucher #${idx + 1}`}
                            </span>
                            <span className="font-mono text-xs sm:text-sm font-black text-slate-800 tracking-wider">
                              {code}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-black">
                            {isAr ? "صالح ونشط" : "ACTIVE"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Job applications tracker */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900">{isAr ? "متتبع تقديم الوظائف المباشر" : "Interactive Job Application Tracker"}</h3>
                  <p className="text-xs text-slate-500">{isAr ? "احفظ وتابع حالة التقديم للشركات المختلفة لتنظيم رحلة توظيفك." : "Keep logs of companies, locations, notes, and statuses."}</p>
                </div>
                <button
                  onClick={() => setShowAddJobModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#001639] text-white hover:bg-slate-800 rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  <PlusCircle size={14} />
                  <span>{isAr ? "إضافة وظيفة جديدة" : "Add Job Application"}</span>
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center space-y-4">
                  <Briefcase size={40} className="text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-700">{isAr ? "لا توجد طلبات توظيف مسجلة" : "No jobs tracked yet"}</p>
                    <p className="text-xs text-slate-400">{isAr ? "ابدأ بإضافة أول شركة تتقدم إليها لتتبع حالتها وملاحظاتها." : "Add job listings you apply for to track responses, interviews, and progress."}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                  
                  {/* Visual progress stats widget */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
                      {isAr ? "إحصائيات التقدم" : "Tracker Metrics"}
                    </h4>

                    <div className="space-y-3 font-semibold text-xs">
                      {[
                        { label: isAr ? "إجمالي التقديمات" : "Total Applied", count: applications.length, color: "text-slate-800 bg-slate-50 border-slate-200" },
                        { label: isAr ? "مقابلات عمل" : "Interviewing", count: applications.filter(a => a.status === "Interviewing").length, color: "text-amber-700 bg-amber-50 border-amber-200" },
                        { label: isAr ? "عروض مقبولة 🎉" : "Accepted Offers 🎉", count: applications.filter(a => a.status === "Accepted").length, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                        { label: isAr ? "مرفوضة" : "Rejected", count: applications.filter(a => a.status === "Rejected").length, color: "text-rose-700 bg-rose-50 border-rose-200" }
                      ].map((stat, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${stat.color}`}>
                          <span>{stat.label}</span>
                          <span className="text-sm font-black">{stat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applications list column */}
                  <div className="lg:col-span-3 space-y-4">
                    {applications.map(app => (
                      <div 
                        key={app.id} 
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-xs transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-slate-800 text-base">{app.company}</h4>
                              <span className="text-slate-300">|</span>
                              <p className="text-xs text-slate-500 font-bold">{app.title}</p>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                              <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {app.appliedDate}
                              </span>
                              {app.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={11} />
                                  {app.location}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Update status selector widget */}
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateJobStatus(app.id, e.target.value as any)}
                              className={`px-3 py-1.5 rounded-lg border text-[11px] font-black cursor-pointer outline-none ${
                                app.status === "Accepted" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                  : app.status === "Interviewing" 
                                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                                    : app.status === "Rejected" 
                                      ? "bg-rose-50 text-rose-700 border-rose-200" 
                                      : "bg-slate-50 text-slate-600 border-slate-200"
                              }`}
                            >
                              <option value="Applied">{isAr ? "تم التقديم" : "Applied"}</option>
                              <option value="Interviewing">{isAr ? "مقابلة شخصية" : "Interviewing"}</option>
                              <option value="Accepted">{isAr ? "مقبول 🎉" : "Accepted 🎉"}</option>
                              <option value="Rejected">{isAr ? "مرفوض" : "Rejected"}</option>
                            </select>

                            <button
                              onClick={() => handleDeleteJob(app.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors hover:bg-slate-50"
                              title={isAr ? "إزالة" : "Delete"}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Extra notes or link section */}
                        {(app.notes || app.link) && (
                          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 leading-relaxed border border-slate-100 font-medium">
                            {app.notes && <p className="mb-1">{app.notes}</p>}
                            {app.link && (
                              <a 
                                href={app.link} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-brand-600 hover:underline flex items-center gap-1 font-bold text-[10px]"
                              >
                                <ExternalLink size={10} />
                                {isAr ? "عرض رابط الوظيفة المعلن" : "View Job Listing Link"}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 4: Referral System & Rewards */}
          {activeTab === "referral" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* Form & Copy Code Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="text-center space-y-3 relative overflow-hidden pb-4 border-b border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#E64528] flex items-center justify-center mx-auto shadow-md">
                      <Gift size={32} className="animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-lg">{isAr ? "شارك وتكفل بتحميلاتك مجاناً!" : "Refer Friends, Earn Free Exports!"}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        {isAr
                          ? "اكسب كود تحميل مجاني كامل لكل صديق يقوم بترقية حسابه باستخدام كود الخصم المباشر الخاص بك."
                          : "Earn a fully unlocked PDF export for every friend who signs up & upgrades using your personalized key."}
                      </p>
                    </div>
                  </div>

                  {/* Personal Code Display Card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {isAr ? "كود الخصم الشخصي الخاص بك (20%خصم)" : "Your Personal Discount Key (20% Off)"}
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-black text-[#001639] bg-white border border-slate-200 py-3 rounded-xl tracking-widest shadow-inner inline-block px-6 relative select-all">
                      {referralCode}
                    </div>
                    <button
                      onClick={handleCopyReferralText}
                      className="w-full py-3 bg-[#001639] hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Copy size={13} />
                      <span>{isAr ? "نسخ رابط وكود الخصم المباشر" : "Copy Discount Link & Text"}</span>
                    </button>
                  </div>

                  {/* Invite via Email Form */}
                  <div className="border-t border-slate-100 pt-5 space-y-3">
                    <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wide">
                      {isAr ? "دعوة صديق عبر البريد الإلكتروني" : "Invite a Friend via Email"}
                    </h4>
                    <form onSubmit={handleSendInvite} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                        placeholder="friend@email.com"
                        className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-800 bg-slate-50/50"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#E64528] text-white hover:bg-[#ff5637] rounded-xl text-xs font-black"
                      >
                        {isAr ? "إرسال" : "Send"}
                      </button>
                    </form>
                    {inviteSuccess && (
                      <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
                        {inviteSuccess}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Referrals Status List Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">{isAr ? "حالة الإحالات السابقة" : "Referrals & Reward Logs"}</h3>
                  <p className="text-xs text-slate-500">{isAr ? "متابعة أصدقائك الذين سجلوا عبر كودك واستلام مكافآتك." : "Track user sign-ups and claims on your direct referral keys."}</p>
                </div>

                {referrals.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4">
                    <Users size={36} className="text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700">{isAr ? "لا توجد إحالات مسجلة حتى الآن" : "No referrals yet"}</p>
                      <p className="text-xs text-slate-400">{isAr ? "انشر كودك الشخصي لتبدأ بجمع المكافآت المجانية." : "Share your link to see friends' progress and unlock codes here."}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((ref, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                            <User size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-800 block">
                              {ref.email}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {isAr ? `تاريخ الدعوة: ${ref.date}` : `Invited on: ${ref.date}`}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
                            ref.status.includes("✅") || ref.status.includes("نشط")
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {ref.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Adding Job Modal Popup overlay */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-5" dir={isAr ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">{isAr ? "إضافة طلب تقديم جديد" : "Add Job Application"}</h3>
              <button 
                onClick={() => setShowAddJobModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isAr ? "اسم الشركة *" : "Company Name *"}</label>
                <input
                  type="text"
                  required
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  placeholder={isAr ? "أدخل اسم الشركة..." : "e.g. Google, Vodafone..."}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:border-slate-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isAr ? "المسمى الوظيفي *" : "Job Title *"}</label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder={isAr ? "أدخل المسمى الوظيفي..." : "e.g. Backend Dev, Designer..."}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:border-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isAr ? "الموقع الجغرافي" : "Location"}</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder={isAr ? "القاهرة، الإسكندرية..." : "e.g. Cairo, Remote..."}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:border-slate-800 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isAr ? "الحالة الابتدائية" : "Initial Status"}</label>
                  <select
                    value={newJob.status}
                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:border-slate-800 outline-none bg-white"
                  >
                    <option value="Applied">{isAr ? "تم التقديم" : "Applied"}</option>
                    <option value="Interviewing">{isAr ? "مقابلات شخصية" : "Interviewing"}</option>
                    <option value="Accepted">{isAr ? "مقبول 🎉" : "Accepted 🎉"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isAr ? "رابط إعلان الوظيفة" : "Job Listing Link"}</label>
                <input
                  type="url"
                  value={newJob.link}
                  onChange={(e) => setNewJob({ ...newJob, link: e.target.value })}
                  placeholder="https://company.com/job"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:border-slate-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isAr ? "ملاحظات إضافية" : "Additional Notes"}</label>
                <textarea
                  value={newJob.notes}
                  onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                  placeholder={isAr ? "أدخل أي ملاحظات (مثل تاريخ المقابلة، معلومات الاتصال...)" : "Vibe check, interview timeline details..."}
                  className="w-full h-16 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:border-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#001639] hover:bg-slate-800 text-white rounded-xl text-xs font-black"
                >
                  {isAr ? "إضافة وحفظ" : "Add & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
