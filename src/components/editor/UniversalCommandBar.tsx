import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ArrowRight,
  Sparkles,
  Command,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  Award,
  BookOpen,
  Send,
  Loader2,
  Copy,
  Check,
  Zap,
  Info
} from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import { aiService } from "../../services/aiService";
import { cn } from "@/lib/utils";

interface UniversalCommandBarProps {
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function UniversalCommandBar({
  setActiveTab,
  isOpen,
  onClose,
}: UniversalCommandBarProps) {
  const { language } = useLanguageStore();
  const { data } = useResumeStore();
  const isAr = language === "ar";

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut cmd+k / ctrl+k listener
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle outside click to close
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Section options definitions
  const sections = [
    { id: "basics", label: isAr ? "المعلومات الأساسية" : "Personal Information", icon: FileText, category: isAr ? "الأقسام" : "Sections" },
    { id: "experience", label: isAr ? "الخبرات المهنية" : "Professional Experience", icon: Briefcase, category: isAr ? "الأقسام" : "Sections" },
    { id: "education", label: isAr ? "التعليم والدراسة" : "Education Track", icon: GraduationCap, category: isAr ? "الأقسام font-sans" : "Sections" },
    { id: "skills", label: isAr ? "المهارات والمؤهلات" : "Skills & Competencies", icon: Wrench, category: isAr ? "الأقسام" : "Sections" },
    { id: "projects", label: isAr ? "المشاريع والإنجازات" : "Portfolio Projects", icon: FolderKanban, category: isAr ? "الأقسام" : "Sections" },
    { id: "certifications", label: isAr ? "الشهادات والكورسات" : "Certifications & Achievements", icon: Award, category: isAr ? "الأقسام" : "Sections" },
    { id: "cover-letter", label: isAr ? "رسالة التغطية" : "Cover Letter", icon: BookOpen, category: isAr ? "الأقسام" : "Sections" },
    { id: "finish", label: isAr ? "المراجعة والتصدير وتحميل الـ PDF" : "Finish & PDF Export", icon: Zap, category: isAr ? "الأقسام" : "Sections" },
  ];

  // Demo Actions definitions
  const demoLanguagesActions = [
    {
      id: "demo-tech",
      label: isAr ? "تعبئة سيرة ذاتية تجريبية كاملة (مجال البرمجيات والتقنية)" : "Autofill Full Sample Resume (Software & Tech Domain)",
      icon: Zap,
      category: isAr ? "تعبئة سريعة" : "Instant Autofill"
    },
    {
      id: "demo-design",
      label: isAr ? "تعبئة سيرة ذاتية تجريبية كاملة (التصميم والتسويق الرقمي)" : "Autofill Full Sample Resume (Design & Digital Marketing)",
      icon: Sparkles,
      category: isAr ? "تعبئة سريعة" : "Instant Autofill"
    }
  ];

  const handleAutofillDemo = (type: "tech" | "design") => {
    if (type === "tech") {
      useResumeStore.setState({
        data: {
          ...data,
          personalInfo: {
            fullName: isAr ? "باسم رمضان الشافعي" : "Bassem Ramadan",
            jobTitle: isAr ? "مطور برمجيات كامل (Senior Full-Stack Developer)" : "Lead Full-Stack Developer",
            email: "bassem.ramadan@gmail.com",
            phone: "+20 102 345 6789",
            address: isAr ? "القاهرة، جمهورية مصر العربية" : "Cairo, Egypt",
            linkedin: "linkedin.com/in/bassem-ramadan",
            github: "github.com/bassem-ramadan",
            portfolio: "bassem-portfolio.dev",
            summary: isAr 
              ? "مطور برمجيات أول بخبرة 6 سنوات في بناء منصات ويب فائقة السرعة وتطبيقات سحابية قابلة للتوسع. ماهر في هندسة النظم وتطوير الـ Front-end و Back-end باستخدام React و Node.js."
              : "Highly accomplished systems architect with 6+ years of production experience modernizing cloud workflows and building real-time applications with React, TypeScript, and Node.js."
          },
          skills: isAr 
            ? ["تايب سكريبت", "رياكت", "Node.js", "قواعد بيانات SQL", "Docker", "هندسة النظم القابلة للتوسع", "التكامل والانتشار المستمر (CI/CD)", "Git & GitHub"]
            : ["TypeScript", "React & Next.js", "Node.js", "SQL Databases", "Docker & Kubernetes", "RESTful APIs", "CI/CD Pipelines", "System Architecture"],
          experience: [
            {
              id: "demo-exp-1",
              company: "Global Tech Solutions",
              position: isAr ? "مهندس برمجيات أول" : "Senior Software Architect",
              startDate: "2022-04",
              endDate: "Present",
              currentlyWorking: true,
              description: isAr
                ? "• تولي قيادة فريق المطورين لبناء نظام مدفوعات إلكتروني متكامل مما ساعد في معالجة ربع مليون معاملة يومية بنجاح بنسبة ثبات 99.9%.\n• أعدت هيكلة واجهات الاستخدام وقواعد البيانات مما أدى لتقليص زمن الاستجابة والتحميل بنسبة 35%.\n• تطبيق ممارسات الحماية الأمنية المتقدمة والمراقبة الفورية للخدمات السحابية عبر Docker."
                : "• Spearheaded cloud modernization of critical transaction gateways, handling 250k+ daily processes without downtime.\n• Optimized database indexes and React layout rendering, reducing user wait-times by 35%.\n• Mentored junior engineers on type-safe development practices and automated unit-testing pipelines."
            }
          ],
          education: [
            {
              id: "demo-edu-1",
              institution: isAr ? "جامعة عين شمس - كلية الحاسبات والمعلومات" : "Ain Shams University",
              degree: isAr ? "بكالوريوس علوم الحاسب" : "Bachelor of Computer Science",
              field: isAr ? "علوم حاسب ونظم معلومات" : "Computer Science",
              startDate: "2016-09",
              endDate: "2020-06",
              description: isAr ? "تخرجت بتقدير امتياز مع مرتبة الشرف. ركزت في مشروع التخرج على معالجة اللغات الطبيعية باستخدام الذكاء الاصطناعي." : "Graduated with highest honors. Specialized in NLP models and scalable computing patterns."
            }
          ],
          projects: [
            {
              id: "demo-proj-1",
              name: isAr ? "منصة التجارة السريعة الذكية" : "AI-Powered Hyper-Commerce Engine",
              link: "https://hypercomm.dev",
              description: isAr
                ? "بناء تطبيق ويب متكامل يدير العمليات اللوجستية وتوصيل السلع الآلي بالاعتماد على خوارزميات الذكاء الاصطناعي لحساب أقصر الطرق وسرعة الاستجابة."
                : "Architected a highly concurrent dropshipping automation service, leveraging vector layouts to analyze regional pricing indicators dynamically."
            }
          ],
          certifications: [
            {
              id: "demo-cert-1",
              name: "AWS Certified Solutions Architect",
              issuer: "Amazon Web Services",
              date: "2023"
            }
          ]
        }
      });
    } else {
      useResumeStore.setState({
        data: {
          ...data,
          personalInfo: {
            fullName: isAr ? "نادين يوسف البستاني" : "Nadine Bustany",
            jobTitle: isAr ? "مخرجة فنية ومديرة تسويق رقمي" : "Creative Director & Marketing Strategist",
            email: "nadine.creative@agency.com",
            phone: "+20 111 987 6543",
            address: isAr ? "الإسكندرية، مصر" : "Alexandria, Egypt",
            linkedin: "linkedin.com/in/nadine-bustany",
            github: "",
            portfolio: "nadine-portfolio.myportfolio.com",
            summary: isAr 
              ? "مخرجة إبداعية شغوفة بإدارة الحملات البصرية وتصميم تجربة المستخدم الرقمية. أمتلك خبرة واسعة تزيد عن 5 سنوات في التسويق عبر وسائل التواصل الاجتماعي وتحقيق زيادة ملحوظة في معدلات التحويل."
              : "Highly intuitive Visual Director with 5+ years of digital agency experience crafting memorable brand architectures, social campaigns, and high-converting marketing patterns."
          },
          skills: isAr
            ? ["تصميم تجربة المستخدم UI/UX", "أدوات Adobe Creative Suite", "Figma", "صناعة الهوية البصرية", "التخطيط الاستراتيجي للحملات", "التسويق بالمحتوى", "تصوير إعلاني", "مهارات الإقناع والعرض"]
            : ["UI/UX Design", "Figma & Sketch", "Adobe Creative Cloud", "Brand Strategy", "Content Marketing", "Campaign Management", "Social Analytics", "Conversion Optimization"],
          experience: [
            {
              id: "demo-exp-2",
              company: "Nova Media Solutions",
              position: isAr ? "مديرة قسم التصميم والإبداع" : "Creative Art Lead",
              startDate: "2021-08",
              endDate: "Present",
              currentlyWorking: true,
              description: isAr
                ? "• تولي إدارة وإخراج الهوية البصرية لـ 15 علامة تجارية رائدة مما أدى إلى زيادة التفاعل على منصات السوشيال ميديا بنسبة 60%.\n• تصميم واجهة وتجربة موقع الشركة الجديد مما أدى لنمو المبيعات المباشرة بنسبة 40%.\n• إعداد خطط محتوى مرئي واختراع حلول مبتكرة للشركات الكبرى."
                : "• Directed visual graphics strategy and brand launch packages for 15 market leaders, elevating organic reaches by 60%.\n• Designed complete interface redesigns of customer acquisition web portals, lifting user conversions by 40%.\n• Supervised a remote, diverse team of graphic designers and copywriters."
            }
          ],
          education: [
            {
              id: "demo-edu-2",
              institution: isAr ? "جامعة الإسكندرية - كلية الفنون الجميلة" : "Faculty of Fine Arts, Alexandria University",
              degree: isAr ? "بكالوريوس الفنون الزخرفية والتصميم" : "Bachelor of Graphic & Fine Arts",
              field: isAr ? "تصميم اتصال مرئي" : "Visual Communication Design",
              startDate: "2015-09",
              endDate: "2019-06",
              description: isAr ? "تخرجت بتقدير امتياز مع مرتبة الشرف الأولى وجائزة الابتكار السنوية في التصميم المعاصر." : "Awarded annual contemporary project of the year. Focused on interactive media layouts."
            }
          ],
          projects: [
            {
              id: "demo-proj-2",
              name: isAr ? "حملة تجديد هوية علامة فودكاكو" : "Brand Identity Overhaul - FoodCaco Group",
              link: "https://behance.net/projects/foodcaco",
              description: isAr
                ? "إعادة تخطيط الشعار والتعبئة والألوان الخاصة بشركة الأغذية المتكاملة، لزيادة الاقتراب من جيل الشباب ورفع نسبة الولاء للعلامة التجارية."
                : "Reconcepted packaging and logo vectors for a premier food enterprise, strengthening retention rates with custom display layouts."
            }
          ],
          certifications: [
            {
              id: "demo-cert-2",
              name: "Google Professional Digital Marketing certification",
              issuer: "Google Career Certificates",
              date: "2022"
            }
          ]
        }
      });
    }
    onClose();
  };

  // Build list of options filtered by query
  const filteredSections = sections.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDemoActions = demoLanguagesActions.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  // Combine items to allow single index keyboard selection
  const isAiQuery = query.startsWith("/ai") || query.startsWith("/ذكاء");
  const aiPromptText = query.startsWith("/ai ") ? query.substring(4) : query.startsWith("/ذكاء ") ? query.substring(5) : "";

  const combinedItems = isAiQuery 
    ? [] 
    : [...filteredSections, ...filteredDemoActions];

  // Navigate keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(combinedItems.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(combinedItems.length, 1));
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (isAiQuery) {
          handleAiWriteSubmit();
        } else if (combinedItems[selectedIndex]) {
          handleItemSelection(combinedItems[selectedIndex]);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedIndex, combinedItems, query, isAiQuery, aiPromptText]);

  const handleItemSelection = (item: { id: string; [key: string]: unknown }) => {
    if (item.id.startsWith("demo-")) {
      handleAutofillDemo(item.id === "demo-tech" ? "tech" : "design");
    } else {
      setActiveTab(item.id);
      onClose();
    }
  };

  const handleAiWriteSubmit = async () => {
    const prompt = aiPromptText.trim() || query.trim();
    if (!prompt) return;

    setIsGenerating(true);
    setAiResult("");
    try {
      const promptText = isAr 
        ? `اكتب نصاً فصيحاً واحترافياً مناسباً للسيرة الذاتية بخصوص هذا المطلّب: "${prompt}". اكتب النص في فقرة واحدة متناسقة بأسلوب الشركات العالمية الكبرى بدون مقدمات أو علامات تمييز.`
        : `Write a highly professional and tailored resume section text based on this draft prompt: "${prompt}". Output a single cohesive and elegant paragraph without introductory text or markdown labels.`;
      
      const response = await aiService.generateContent(promptText);
      setAiResult(response.text);
    } catch (err) {
      console.error("Command bar generation error:", err);
      setAiResult(isAr ? "فشل توليد النص، يرجى المحاولة لاحقاً." : "AI writing failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      {/* Spotlight Window Container */}
      <div
        ref={containerRef}
        className="relative bg-slate-950 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[75vh]"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-900 bg-slate-900/30">
          <Search className="text-slate-400 shrink-0 ml-1" size={18} />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-0 mx-3 font-sans"
            placeholder={isAr ? "ابحث عن قسم، حمّل بيانات تجريبية، أو اكتب (/ai صياغة نبذة احترافية)..." : "Search sections, load demo data, or type (/ai draft profile summary)..."}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center bg-slate-900 text-slate-400 text-[10px] px-2 py-0.5 rounded-md border border-slate-800 font-mono font-bold tracking-tight">
              ESC
            </kbd>
          </div>
        </div>

        {/* Core Results screen */}
        <div className="overflow-y-auto flex-1 p-2 max-h-[50vh]">
          {isAiQuery ? (
            /* Custom AI Prompt Screen UI */
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase">
                <Sparkles size={14} className="animate-spin" />
                <span>{isAr ? "لوحة صياغة الذكاء الاصطناعي الفورية" : "Generative AI Quick Draft"}</span>
              </div>
              
              <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex gap-3.5">
                <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                    {isAr 
                      ? "اضغط Enter لتشغيل مساعد Gemini وكتابة فقرة احترافية للسيرة الذاتية بناءً على طلبك."
                      : "Type your raw instruction and press Enter to have the Gemini Assistant generate an optimized corporate paragraph."}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {isAr ? "مثال: /ai صياغة ملخص سيرة لمهندس ديكور بخبرة تزيين فنادق كبرى" : "Example: /ai lead visual designer summary focused on fashion magazines"}
                  </p>
                </div>
              </div>

              {aiPromptText && (
                <button
                  onClick={handleAiWriteSubmit}
                  disabled={isGenerating}
                  className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all font-sans"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>{isAr ? "برجاء الانتظار، جاري صياغة النص الإبداعي..." : "Working on premium formulation..."}</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>{isAr ? "صياغة الفقرة بالذكاء الاصطناعي" : "Generate Optimized Text"}</span>
                    </>
                  )}
                </button>
              )}

              {isGenerating && (
                <div className="py-8 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-4 border-orange-500/10 border-t-[#FF4D2D] animate-spin" />
                    <Sparkles className="w-4 h-4 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <span className="text-[11px] text-[#FF4D2D] font-bold tracking-wider uppercase animate-pulse">
                    {isAr ? "جاري صياغة النص وبنائه بالذكاء الاصطناعي..." : "GENERATING YOUR TAILORED DURATION..."}
                  </span>
                  <div className="w-64 space-y-2 mt-2">
                    <div className="h-2 bg-slate-800 rounded-full animate-pulse w-full" />
                    <div className="h-2 bg-slate-800 rounded-full animate-pulse w-5/6" />
                  </div>
                </div>
              )}

              {aiResult && !isGenerating && (
                <div className="space-y-3 pt-2">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative text-start" dir={isAr ? "rtl" : "ltr"}>
                    <p className="text-xs text-slate-150 leading-relaxed font-semibold pr-4">
                      {aiResult}
                    </p>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="text-slate-400 hover:text-white p-1 bg-slate-800 border border-slate-700/80 rounded-lg transition-all cursor-pointer"
                        title="Copy to Clipboard"
                      >
                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Check size={10} />
                      <span>{isAr ? "جاهز للنسخ والاستخدام في سيرتك!" : "Ready to copy & paste!"}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : combinedItems.length > 0 ? (
            /* Filtered lists of categories */
            <div className="space-y-2">
              {/* Categorize items properly */}
              {Array.from(new Set(combinedItems.map((item) => item.category))).map((cat) => {
                const catItems = combinedItems.filter((item) => item.category === cat);
                return (
                  <div key={cat} className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1.5 block select-none">
                      {cat}
                    </span>
                    {catItems.map((item) => {
                      const overallIndex = combinedItems.findIndex((ci) => ci.id === item.id);
                      const isSelected = overallIndex === selectedIndex;
                      const IconComponent = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemSelection(item)}
                          className={cn(
                            "w-full text-start flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer text-xs font-medium",
                            isSelected
                              ? "bg-slate-900 text-white border border-slate-800 shadow-lg"
                              : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border border-transparent"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center border transition-all",
                                isSelected
                                  ? "bg-rose-950/40 border-rose-900 text-rose-400"
                                  : "bg-slate-900/80 border-slate-800/80 text-slate-450"
                              )}
                            >
                              <IconComponent size={14} />
                            </div>
                            <span className="font-semibold text-slate-200">{item.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 select-none">
                                <span>{isAr ? "اضغط" : "Press"}</span>
                                <span className="bg-slate-800 border border-slate-700 font-mono px-1 rounded-sm text-slate-200">⏎</span>
                              </span>
                            )}
                            <ArrowRight size={12} className={cn("transition-transform", isSelected ? "translate-x-0.5 text-slate-300" : "opacity-0")} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state when query matches nothing */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <Command size={24} className="text-slate-800 animate-pulse" />
              <p className="text-xs font-semibold text-slate-400">
                {isAr ? "لم نجد نتائج مطابقة لبحثك." : "No matching terminal command or route found."}
              </p>
              <p className="text-[10px] text-slate-600 max-w-xs leading-relaxed">
                {isAr ? "جرّب البحث عن 'الخبرات' أو تشغيل الذكاء الاصطناعي بكتابة '/ai صياغة مهارات'" : "Try seeking 'experience', 'education' or run AI typing '/ai skills'"}
              </p>
            </div>
          )}
        </div>

        {/* Sleek bottom menu indicators */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono select-none">
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="flex items-center bg-slate-900 border border-slate-800 px-1 rounded-sm text-slate-300">↑↓</span>
              <span>{isAr ? "للتنقل" : "Navigate"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-slate-900 border border-slate-800 px-1 rounded-sm text-slate-300">⏎</span>
              <span>{isAr ? "للتأكيد" : "Select"}</span>
            </span>
          </div>
          <div className="text-slate-500 flex items-center gap-1 text-[10px] font-semibold text-rose-400">
            <Command size={10} />
            <span>Cmd+K / Ctrl+K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
