import React, { forwardRef, memo, useRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useResumeStore, ResumeData } from "../../store/useResumeStore";
import { useActiveSectionStore } from "../../store/useActiveSectionStore";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  data?: ResumeData;
}

const ResumePreview = memo(
  forwardRef<HTMLDivElement, ResumePreviewProps>((props, ref) => {
    const storeData = useResumeStore((state) => state.data);
    let data = props.data || storeData;
    
    const localRef = useRef<HTMLDivElement | null>(null);
    const activeField = useActiveSectionStore((state) => state.activeField);

    // Dynamic section highlighting for interactive live-editor feedback
    useEffect(() => {
      const container = localRef.current;
      if (!container) return;
      
      container.querySelectorAll("[data-highlighted]").forEach((el) => {
        el.removeAttribute("data-highlighted");
      });

      if (!activeField) return;

      if (activeField === "personalInfo") {
        const header = container.querySelector("header");
        if (header) {
          header.setAttribute("data-highlighted", "true");
        }
      } else {
        const sections = container.querySelectorAll("section");
        sections.forEach((sec) => {
          const text = sec.textContent?.toLowerCase() || "";
          
          if (activeField === "summary") {
            if (text.includes("summary") || text.includes("ملخص") || text.includes("الخلاصة") || text.includes("profil") || text.includes("professional summary") || text.includes("الملخص المهني")) {
              sec.setAttribute("data-highlighted", "true");
            }
          } else if (activeField === "experience") {
            if (text.includes("experience") || text.includes("الخبرة") || text.includes("الخبرات") || text.includes("العمل") || text.includes("التاريخ المهني") || text.includes("الخبرة المهنية")) {
              sec.setAttribute("data-highlighted", "true");
            }
          } else if (activeField === "education") {
            if (text.includes("education") || text.includes("التعليم") || text.includes("الدراسة") || text.includes("المسار التعليمي") || text.includes("المؤهلات العلمية")) {
              sec.setAttribute("data-highlighted", "true");
            }
          } else if (activeField === "skills") {
            if (text.includes("skills") || text.includes("المهارات") || text.includes("compétences") || text.includes("القدرات والمهارات")) {
              sec.setAttribute("data-highlighted", "true");
            }
          } else if (activeField === "projects") {
            if (text.includes("projects") || text.includes("المشاريع") || text.includes("مشاريعي الشخصية") || text.includes("مشاريع")) {
              sec.setAttribute("data-highlighted", "true");
            }
          } else if (activeField === "certifications") {
            if (text.includes("certifications") || text.includes("الشهادات") || text.includes("الكورسات والشهادات")) {
              sec.setAttribute("data-highlighted", "true");
            }
          }
        });
      }
    }, [activeField]);

    // Check if the resume is entirely empty
    const isEmpty = 
      !data.personalInfo?.fullName && 
      !data.personalInfo?.jobTitle && 
      (!data.experience || data.experience.length === 0) && 
      (!data.education || data.education.length === 0) &&
      (!data.skills || data.skills.length === 0);

    const isAr = data.settings?.language === "ar";

    // Use high-quality ghost default data if the user's resume is empty
    if (isEmpty) {
      data = {
        ...data,
        personalInfo: {
          fullName: isAr ? "أحمد سمير ممدوح" : "John Doe",
          jobTitle: isAr ? "مهندس برمجيات أول" : "Senior Software Engineer",
          email: "john.doe@example.com",
          phone: "+20 123 456 7890",
          address: isAr ? "القاهرة، مصر" : "Cairo, Egypt",
          summary: isAr 
            ? "مهندس برمجيات ذو خبرة عالية مكرس لبناء وتطوير تطبيقات ويب حديثة وفعالة. متخصص في هندسة النظم وتأصيل برمجيات الويب الآمنة وبناء واجهات المستخدم التفاعلية."
            : "Experienced senior software engineer dedicated to building and optimizing modern scalable web applications with performance, security, and elegant structural design. Proven leader in full-stack architecture.",
          nationality: isAr ? "مصر" : "Egyptian",
          birthDate: "1994-11-20",
          maritalStatus: isAr ? "متزوج" : "Married",
        },
        experience: [
          {
            id: "1",
            position: isAr ? "مهندس برمجيات أول" : "Senior Software Engineer",
            company: isAr ? "الشركة العالمية للحلول الرقمية" : "Global Digital Solutions Inc.",
            location: isAr ? "القاهرة" : "Cairo",
            startDate: "2021-01",
            endDate: "",
            current: true,
            description: isAr 
              ? "• قيادة فريق مكون من ٥ مهندسين برمجيات لتطوير نظام محاسبة إلكتروني متقدم\n• تحسين أداء الواجهات الرقمية وتخفيض فترات التحميل بنسبة ٤٢٪\n• بناء ودمج واجهات برمجية لرفع كفاءة تداول البيانات وتحقيق فحص ATS بنسبة ١٠٠٪"
              : "• Led a team of 5 software engineers to architect and release an advanced enterprise ERP software.\n• Improved frontend compilation performance and reduced load time metrics by 42%.\n• Designed modular API systems matching top scalability benchmarks and ATS standards.",
          }
        ],
        education: [
          {
            id: "1",
            degree: isAr ? "بكالوريوس هندسة الحاسبات" : "Bachelor of Computer Engineering",
            institution: isAr ? "جامعة القاهرة" : "Cairo University",
            location: isAr ? "القاهرة" : "Cairo",
            startDate: "2012-09",
            endDate: "2017-06",
            gpa: "3.9/4.0",
            description: "",
          }
        ],
        skills: [
          "JavaScript", "TypeScript", "React", "Node.js", "Tailwind CSS", "Next.js", "Docker", "RESTful APIs"
        ] as any,
        projects: [
          {
            id: "1",
            name: isAr ? "نظام تتبع المعاملات المالية الآلي" : "Automated Financial Transaction Service",
            description: isAr 
              ? "تطوير تطبيق ويب لإدارة المعاملات المالية الضخمة ومعالجتها بسرعة فائقة باستخدام قنوات اتصال آمنة وواجهات لوحية ديناميكية."
              : "Built an automated highly concurrent financial engine with interactive dashboards and strict security audits.",
            link: "https://example.com/transactions",
          }
        ],
        certifications: [
          {
            id: "1",
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023",
            certificateId: "AWS-ARCH-9921",
          }
        ],
      };
    }

    const {
      personalInfo = { fullName: "", jobTitle: "", email: "", phone: "", address: "", summary: "" },
      experience = [],
      education = [],
      skills: rawSkills = [],
      projects = [],
      certifications = [],
      settings = { template: "classic", language: "en" },
    } = data;

    const skills = (rawSkills || []).map((skill: any, idx: number) => {
      if (typeof skill === "string") {
        return { id: String(idx), name: skill };
      }
      return { id: skill?.id || String(idx), name: skill?.name || "" };
    });

    const hiddenSections = settings.hiddenSections || [];

    const labels = {
      summary: settings.language === "ar" ? "الملخص المهني" : "Professional Summary",
      experience: settings.language === "ar" ? "الخبرات العملية" : "Experience",
      education: settings.language === "ar" ? "التعليم" : "Education",
      skills: settings.language === "ar" ? "المهارات" : "Skills",
      projects: settings.language === "ar" ? "المشاريع" : "Projects",
      certifications: settings.language === "ar" ? "الشهادات والاعتمادات" : "Certifications",
    };

    const [qrSrc, setQrSrc] = useState<string>("");

    useEffect(() => {
      if (settings?.showQRCode) {
        let payload = "";
        if (settings.qrCodeType === "linkedin") {
          payload = personalInfo?.linkedin || "https://linkedin.com";
        } else {
          // VCard format payload
          payload = `BEGIN:VCARD\nVERSION:3.0\nN:${personalInfo?.fullName || "Resume Owner"}\nTITLE:${personalInfo?.jobTitle || ""}\nTEL:${personalInfo?.phone || ""}\nEMAIL:${personalInfo?.email || ""}\nURL:${personalInfo?.linkedin || ""}\nEND:VCARD`;
        }

        QRCode.toDataURL(payload, { margin: 1, width: 80, color: { dark: "#0f172a", light: "#ffffff" } }, (err, url) => {
          if (!err) {
            setQrSrc(url);
          }
        });
      }
    }, [
      settings?.showQRCode,
      settings?.qrCodeType,
      personalInfo?.linkedin,
      personalInfo?.fullName,
      personalInfo?.email,
      personalInfo?.phone,
      personalInfo?.jobTitle,
    ]);

    // Reusable intelligent description formatter that converts plain text or bullet strings with clear margins
    const renderDescriptionText = (text: string, isRtl: boolean) => {
      if (!text) return null;
      const lines = text.split("\n");
      return (
        <div className="space-y-1 mt-1 text-[11px] sm:text-xs">
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            
            const bulletRegex = /^[•\-*]\s*/;
            const isBullet = bulletRegex.test(trimmed);
            const cleanContent = trimmed.replace(bulletRegex, "");

            if (isBullet) {
              return (
                <div key={idx} className="flex items-start text-slate-650 leading-relaxed font-normal">
                  <span className={cn(
                    "inline-block text-slate-400 select-none", 
                    isRtl ? "ml-2.5" : "mr-2.5"
                  )}>•</span>
                  <span className="flex-1">{cleanContent}</span>
                </div>
              );
            } else {
              return (
                <p key={idx} className="text-slate-650 leading-relaxed font-normal whitespace-pre-line">
                  {line}
                </p>
              );
            }
          })}
        </div>
      );
    };

    const DynamicGCCRecruitmentData = () => {
      const isRtl = settings.language === "ar";
      const hasGCCData = personalInfo.nationality || personalInfo.maritalStatus || personalInfo.birthDate;
      if (!hasGCCData) return null;

      const items = [
        { label: isRtl ? "الجنسية" : "Nationality", value: personalInfo.nationality },
        { label: isRtl ? "الحالة الاجتماعية" : "Marital Status", value: personalInfo.maritalStatus },
        { label: isRtl ? "تاريخ الميلاد" : "Date of Birth", value: personalInfo.birthDate },
      ].filter(item => item.value && item.value.trim() !== "");

      if (items.length === 0) return null;

      return (
        <div className={cn("flex flex-wrap gap-2.5 font-sans mt-3.5 pb-1 text-xs justify-center md:justify-start", isRtl ? "text-right" : "text-left")}>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-200">
              <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-widest">{item.label}:</span>
              <span className="font-semibold text-neutral-800">{item.value}</span>
            </div>
          ))}
        </div>
      );
    };

    // ── TEMPLATE 4: "ATS Professional" (Strict) ──
    const renderATSProfessional = () => {
      return (
        <div className="bg-white p-[56px] text-[#000000] font-sans min-h-[297mm] w-[794px] mx-auto text-start leading-[1.15] border border-black/10 select-text">
          <header className="mb-4">
            <h1 className="text-[22px] font-bold mb-1 leading-none">{personalInfo.fullName}</h1>
            <p className="text-[11px] uppercase tracking-[1.5px] font-normal mb-1">{personalInfo.jobTitle}</p>
            <div className="border-t-[1pt] border-black my-2" />
            <p className="text-[10px] font-normal">
              {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin].filter(Boolean).join(" | ")}
            </p>
          </header>

          <div className="space-y-[14px]">
            {!hiddenSections.includes("summary") && personalInfo.summary && (
              <section>
                <div className="border-t-[0.5pt] border-black mb-1" />
                <h3 className="text-[13px] font-bold uppercase tracking-[1px] mb-2">{labels.summary}</h3>
                <div className="text-[11px] leading-[1.15] font-normal whitespace-pre-line">{personalInfo.summary}</div>
              </section>
            )}

            {!hiddenSections.includes("skills") && skills.length > 0 && (
              <section>
                <div className="border-t-[0.5pt] border-black mb-1" />
                <h3 className="text-[13px] font-bold uppercase tracking-[1px] mb-2">{labels.skills}</h3>
                <p className="text-[11px] leading-[1.15] font-normal">{skills.map(s => s.name).join(" · ")}</p>
              </section>
            )}

            {!hiddenSections.includes("experience") && experience.length > 0 && (
              <section>
                <div className="border-t-[0.5pt] border-black mb-1" />
                <h3 className="text-[13px] font-bold uppercase tracking-[1px] mb-2">{labels.experience}</h3>
                <div className="space-y-[10px]">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline font-bold text-[11px]">
                        <span>{exp.company}</span>
                        <span>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                      </div>
                      <div className="italic text-[11px] mb-1">{exp.position}</div>
                      <div className="text-[11px] leading-[1.15] font-normal pl-[14px]">
                        {exp.description.split("\n").map((line, i) => (
                          <div key={i} className="mb-[4px] flex">
                            <span className="mr-[5px] inline-block">–</span>
                            <span>{line.replace(/^[•\-*]\s*/, "")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      );
    };

    // ── TEMPLATE: "Classic Professional" (New) ──
    const renderClassicProfessional = () => {
      const isRtl = settings.language === "ar";
      return (
        <div
          className={cn(
            "bg-white leading-relaxed p-[0.75in] relative text-start font-sans min-h-[297mm] text-slate-900 border border-slate-100",
            isRtl ? "text-right" : "text-left"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Header section */}
          <header className="mb-6 text-center select-text">
            <h1 className="font-serif font-bold text-[#111111] leading-tight mb-2 tracking-tight" style={{ fontSize: "28px" }}>
              {personalInfo.fullName}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 font-sans mt-2">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.email && (personalInfo.phone || personalInfo.address) && <span className="text-slate-300">•</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.address && <span className="text-slate-300">•</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.linkedin && (personalInfo.phone || personalInfo.address || personalInfo.email) && <span className="text-slate-300">•</span>}
              {personalInfo.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
            </div>
            <DynamicGCCRecruitmentData />
          </header>

          <div className="space-y-6">
            {/* 1. Summary */}
            {!hiddenSections.includes("summary") && personalInfo.summary && (
              <section className="space-y-2 select-text">
                <h3 className="font-serif font-bold uppercase text-[#111111] pb-1 border-b-[2.5px] border-black tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.summary}
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal font-sans">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {/* 2. Experience */}
            {!hiddenSections.includes("experience") && experience.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-serif font-bold uppercase text-[#111111] pb-1 border-b-[2.5px] border-black tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.experience}
                </h3>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-slate-900 font-sans">{exp.company}</span>
                          {exp.company && exp.position && <span className="mx-1.5 text-slate-400">—</span>}
                          <span className="italic text-slate-700 font-sans">{exp.position}</span>
                        </span>
                        <span className={cn("text-xs font-bold text-slate-500 shrink-0 font-sans", isRtl ? "sm:order-first" : "")}>
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && "–"} {exp.current ? (isRtl ? "الحاضر" : "Present") : exp.endDate}
                        </span>
                      </div>
                      {exp.location && <div className="text-xs text-slate-500 italic font-medium font-sans">{exp.location}</div>}
                      {renderDescriptionText(exp.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Education */}
            {!hiddenSections.includes("education") && education.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-serif font-bold uppercase text-[#111111] pb-1 border-b-[2.5px] border-black tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.education}
                </h3>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm font-sans">
                          <span className="font-bold text-slate-900">{edu.institution}</span>
                          {edu.institution && edu.degree && <span className="mx-1.5 text-slate-400">—</span>}
                          <span className="text-slate-700">{edu.degree}</span>
                        </span>
                        <span className={cn("text-xs font-bold text-slate-500 shrink-0 font-sans", isRtl ? "sm:order-first" : "")}>
                          {edu.startDate} {edu.startDate && edu.endDate && "–"} {edu.endDate}
                        </span>
                      </div>
                      {edu.location && <div className="text-xs text-slate-500 italic font-medium font-sans">{edu.location}</div>}
                      {edu.description && renderDescriptionText(edu.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Skills */}
            {!hiddenSections.includes("skills") && skills.length > 0 && (
              <section className="space-y-2 select-text">
                <h3 className="font-serif font-bold uppercase text-[#111111] pb-1 border-b-[2.5px] border-black tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.skills}
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal font-sans">
                  {skills.join(", ")}
                </p>
              </section>
            )}

            {/* 5. Certifications */}
            {!hiddenSections.includes("certifications") && certifications.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-serif font-bold uppercase text-[#111111] pb-1 border-b-[2.5px] border-black tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.certifications}
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-xs sm:text-sm select-text font-sans">
                      <div className="text-slate-850">
                        <span className="font-bold text-slate-900">{cert.name}</span>
                        {cert.issuer && <span className="text-slate-500 italic"> ({cert.issuer})</span>}
                        {cert.certificateId && <span className="text-slate-400 font-normal font-mono"> [ID: {cert.certificateId}]</span>}
                      </div>
                      <span className={cn("text-xs font-bold text-slate-505 shrink-0", isRtl ? "sm:order-first" : "")}>
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Projects */}
            {!hiddenSections.includes("projects") && projects.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-serif font-bold uppercase text-[#111111] pb-1 border-b-[2.5px] border-black tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.projects}
                </h3>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-2">
                      <div className="flex justify-between items-baseline font-sans">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {proj.name}
                        </span>
                        {proj.link && (
                          <span className="text-xs text-slate-750 hover:underline shrink-0 max-w-[200px] truncate">
                            {proj.link}
                          </span>
                        )}
                      </div>
                      {renderDescriptionText(proj.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      );
    };

    // ── TEMPLATE 1: "Classic Professional" ──
    const renderClassic = () => {
      const isRtl = settings.language === "ar";
      return (
        <div
          className={cn(
            "bg-white leading-relaxed p-[0.75in] relative text-start font-sans min-h-[297mm] text-slate-900 border border-slate-100",
            isRtl ? "text-right" : "text-left"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Centered structured layout */}
          <header className="mb-6 text-center select-text">
            <h1 className="font-serif font-bold text-[#1a1a1a] leading-tight mb-2 tracking-tight" style={{ fontSize: "28px" }}>
              {personalInfo.fullName}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 font-sans mt-2">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.email && (personalInfo.phone || personalInfo.address) && <span className="text-slate-300">•</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.address && <span className="text-slate-300">•</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.linkedin && (personalInfo.phone || personalInfo.address) && <span className="text-slate-300">•</span>}
              {personalInfo.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
            </div>
            <DynamicGCCRecruitmentData />
          </header>

          <div className="space-y-6">
            {/* 1. Summary */}
            {!hiddenSections.includes("summary") && personalInfo.summary && (
              <section className="space-y-2 select-text">
                <h3 className="font-serif font-bold uppercase text-[#1a1a1a] pb-1 border-b-2 border-[#1a1a1a] tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.summary}
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {/* 2. Experience */}
            {!hiddenSections.includes("experience") && experience.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-serif font-bold uppercase text-[#1a1a1a] pb-1 border-b-2 border-[#1a1a1a] tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.experience}
                </h3>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-slate-900">{exp.company}</span>
                          {exp.company && exp.position && <span className="mx-1.5 text-slate-300">—</span>}
                          <span className="italic text-slate-700">{exp.position}</span>
                        </span>
                        <span className={cn("text-xs font-bold text-slate-500 shrink-0", isRtl ? "sm:order-first" : "")}>
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && "–"} {exp.current ? (isRtl ? "الحاضر" : "Present") : exp.endDate}
                        </span>
                      </div>
                      {exp.location && <div className="text-xs text-slate-500 italic font-medium">{exp.location}</div>}
                      {renderDescriptionText(exp.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Education */}
            {!hiddenSections.includes("education") && education.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-serif font-bold uppercase text-[#1a1a1a] pb-1 border-b-2 border-[#1a1a1a] tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.education}
                </h3>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-slate-900">{edu.institution}</span>
                          {edu.institution && edu.degree && <span className="mx-1.5 text-slate-300">—</span>}
                          <span className="text-slate-700">{edu.degree}</span>
                        </span>
                        <span className={cn("text-xs font-bold text-slate-500 shrink-0", isRtl ? "sm:order-first" : "")}>
                          {edu.startDate} {edu.startDate && edu.endDate && "–"} {edu.endDate}
                        </span>
                      </div>
                      {edu.location && <div className="text-xs text-slate-500 italic font-medium">{edu.location}</div>}
                      {edu.description && renderDescriptionText(edu.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Skills */}
            {!hiddenSections.includes("skills") && skills.length > 0 && (
              <section className="space-y-2 select-text">
                <h3 className="font-serif font-bold uppercase text-[#1a1a1a] pb-1 border-b-2 border-[#1a1a1a] tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.skills}
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                  {skills.map(s => s.name).join(", ")}
                </p>
              </section>
            )}

            {/* 5. Certifications */}
            {!hiddenSections.includes("certifications") && certifications.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-serif font-bold uppercase text-[#1a1a1a] pb-1 border-b-2 border-[#1a1a1a] tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.certifications}
                </h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-xs sm:text-sm select-text">
                      <div className="text-slate-850">
                        <span className="font-bold text-slate-900">{cert.name}</span>
                        {cert.issuer && <span className="text-slate-500 italic"> ({cert.issuer})</span>}
                        {cert.certificateId && <span className="text-slate-400 font-normal"> [ID: {cert.certificateId}]</span>}
                      </div>
                      <span className={cn("text-xs font-bold text-slate-500 shrink-0", isRtl ? "sm:order-first" : "")}>
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Projects */}
            {!hiddenSections.includes("projects") && projects.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-serif font-bold uppercase text-[#1a1a1a] pb-1 border-b-2 border-[#1a1a1a] tracking-wider" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                  {labels.projects}
                </h3>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {proj.name}
                        </span>
                        {proj.link && (
                          <span className="text-xs text-slate-700 hover:underline shrink-0 max-w-[200px] truncate">
                            {proj.link}
                          </span>
                        )}
                      </div>
                      {renderDescriptionText(proj.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      );
    };

    // ── TEMPLATE 2: "Modern Clean" ──
    const renderModern = () => {
      const isRtl = settings.language === "ar";
      return (
        <div
          className={cn(
            "bg-white leading-relaxed p-10 relative text-start font-sans min-h-[297mm] text-slate-850 border border-slate-100",
            isRtl ? "text-right" : "text-left"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <header className="mb-7 select-text">
            <h1 className="font-sans font-extrabold text-[#111827] leading-tight tracking-tight mb-1" style={{ fontSize: "32px" }}>
              {personalInfo.fullName}
            </h1>
            {personalInfo.jobTitle && (
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider mb-3.5" style={{ color: "#2563EB" }}>
                {personalInfo.jobTitle}
              </h2>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500 font-semibold border-b border-slate-100 pb-5 pt-1">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.email && (personalInfo.phone || personalInfo.address) && <span className="text-slate-300">•</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.address && <span className="text-slate-300">•</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.linkedin && (personalInfo.phone || personalInfo.address) && <span className="text-slate-300">•</span>}
              {personalInfo.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
            </div>
            <DynamicGCCRecruitmentData />
          </header>

          <div className="space-y-6">
            {/* 1. Summary */}
            {!hiddenSections.includes("summary") && personalInfo.summary && (
              <section className="space-y-2 select-text">
                <h3 className="font-extrabold uppercase text-[#2563EB] tracking-wide border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  {labels.summary}
                </h3>
                <p className="text-slate-650 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {/* 2. Experience */}
            {!hiddenSections.includes("experience") && experience.length > 0 && (
              <section className="space-y-4 select-text">
                <h3 className="font-extrabold uppercase text-[#2563EB] tracking-wide border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  {labels.experience}
                </h3>
                <div className="space-y-4.5">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-extrabold text-slate-900">{exp.company}</span>
                          {exp.company && exp.position && <span className="mx-2 text-slate-300">|</span>}
                          <span className="italic font-bold text-[#2563EB]">{exp.position}</span>
                        </span>
                        <span className={cn("text-xs font-bold text-slate-405 shrink-0", isRtl ? "sm:order-first" : "")}>
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && "–"} {exp.current ? (isRtl ? "الحاضر" : "Present") : exp.endDate}
                        </span>
                      </div>
                      {exp.location && <div className="text-xs text-slate-450 font-bold">{exp.location}</div>}
                      {renderDescriptionText(exp.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Education */}
            {!hiddenSections.includes("education") && education.length > 0 && (
              <section className="space-y-4 select-text">
                <h3 className="font-extrabold uppercase text-[#2563EB] tracking-wide border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  {labels.education}
                </h3>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-extrabold text-slate-900">{edu.institution}</span>
                          {edu.institution && edu.degree && <span className="mx-2 text-slate-300">|</span>}
                          <span className="font-bold text-slate-705">{edu.degree}</span>
                        </span>
                        <span className={cn("text-xs font-bold text-slate-405 shrink-0", isRtl ? "sm:order-first" : "")}>
                          {edu.startDate} {edu.startDate && edu.endDate && "–"} {edu.endDate}
                        </span>
                      </div>
                      {edu.location && <div className="text-xs text-slate-450 font-bold">{edu.location}</div>}
                      {edu.description && renderDescriptionText(edu.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Skills */}
            {!hiddenSections.includes("skills") && skills.length > 0 && (
              <section className="space-y-3 select-text">
                <h3 className="font-extrabold uppercase text-[#2563EB] tracking-wide border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  {labels.skills}
                </h3>
                <div className="flex flex-wrap gap-2 pt-1 font-semibold">
                  {skills.map((skill) => (
                    <span key={skill.id} className="bg-slate-50 text-slate-700 border border-slate-150 text-xs px-3 py-1 rounded-lg">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Certifications */}
            {!hiddenSections.includes("certifications") && certifications.length > 0 && (
              <section className="space-y-4 select-text">
                <h3 className="font-extrabold uppercase text-[#2563EB] tracking-wide border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  {labels.certifications}
                </h3>
                <div className="space-y-2.5">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-xs sm:text-sm">
                      <div className="text-slate-800 font-medium">
                        <span className="font-extrabold text-slate-900">{cert.name}</span>
                        {cert.issuer && <span className="text-slate-500 font-bold"> — {cert.issuer}</span>}
                        {cert.certificateId && <span className="text-[#2563EB] font-bold"> [ID: {cert.certificateId}]</span>}
                      </div>
                      <span className={cn("text-xs font-bold text-slate-405 shrink-0", isRtl ? "sm:order-first" : "")}>
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Projects */}
            {!hiddenSections.includes("projects") && projects.length > 0 && (
              <section className="space-y-4 select-text">
                <h3 className="font-extrabold uppercase text-[#2563EB] tracking-wide border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  {labels.projects}
                </h3>
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {proj.name}
                        </span>
                        {proj.link && (
                          <span className="text-xs text-[#2563EB] font-bold hover:underline shrink-0 max-w-[200px] truncate">
                            {proj.link}
                          </span>
                        )}
                      </div>
                      {renderDescriptionText(proj.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      );
    };

    // ── TEMPLATE 3: "Executive" ──
    const renderExecutive = () => {
      const isRtl = settings.language === "ar";
      return (
        <div
          className={cn(
            "bg-white leading-relaxed pb-12 relative text-start font-sans min-h-[297mm] text-slate-800 border border-slate-100",
            isRtl ? "text-right" : "text-left"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Executive Header banner */}
          <header className="bg-[#1E293B] text-white p-8 sm:p-10 mb-8 border-b-4 border-[#F59E0B] relative select-text">
            <h1 className="font-extrabold text-white leading-none tracking-tight mb-2" style={{ fontSize: "36px" }}>
              {personalInfo.fullName}
            </h1>
            {personalInfo.jobTitle && (
              <h2 className="text-sm sm:text-base font-extrabold tracking-widest uppercase mb-5" style={{ color: "#F59E0B" }}>
                {personalInfo.jobTitle}
              </h2>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-200 font-medium">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.email && (personalInfo.phone || personalInfo.address) && <span className="text-[#F59E0B]">•</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && personalInfo.address && <span className="text-[#F59E0B]">•</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.linkedin && (personalInfo.phone || personalInfo.address) && <span className="text-[#F59E0B]">•</span>}
              {personalInfo.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
            </div>
            <DynamicGCCRecruitmentData />
          </header>

          <div className="px-8 sm:px-10 space-y-6">
            {/* 1. Summary */}
            {!hiddenSections.includes("summary") && personalInfo.summary && (
              <section className="space-y-2 select-text">
                <h3 className="font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base uppercase tracking-wider">
                  {labels.summary}
                </h3>
                <p className="text-slate-650 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {/* 2. Experience */}
            {!hiddenSections.includes("experience") && experience.length > 0 && (
              <section className="space-y-4 select-text">
                <h3 className="font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base uppercase tracking-wider">
                  {labels.experience}
                </h3>
                <div className="space-y-4.5">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-[#1E293B]">{exp.company}</span>
                          {exp.company && exp.position && <span className="mx-2 text-[#F59E0B]">/</span>}
                          <span className="italic font-bold text-slate-600">{exp.position}</span>
                        </span>
                        <span className={cn("text-xs font-bold text-slate-400 shrink-0", isRtl ? "sm:order-first" : "")}>
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && "–"} {exp.current ? (isRtl ? "الحاضر" : "Present") : exp.endDate}
                        </span>
                      </div>
                      {exp.location && <div className="text-xs text-slate-500 font-bold">{exp.location}</div>}
                      {renderDescriptionText(exp.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Education */}
            {!hiddenSections.includes("education") && education.length > 0 && (
              <section className="space-y-4 select-text">
                <h3 className="font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base uppercase tracking-wider">
                  {labels.education}
                </h3>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-[#1E293B]">{edu.institution}</span>
                          {edu.institution && edu.degree && <span className="mx-2 text-[#F59E0B]">/</span>}
                          <span className="font-bold text-slate-655">{edu.degree}</span>
                        </span>
                        <span className={cn("text-xs font-bold text-slate-400 shrink-0", isRtl ? "sm:order-first" : "")}>
                          {edu.startDate} {edu.startDate && edu.endDate && "–"} {edu.endDate}
                        </span>
                      </div>
                      {edu.location && <div className="text-xs text-slate-500 font-bold">{edu.location}</div>}
                      {edu.description && renderDescriptionText(edu.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Skills */}
            {!hiddenSections.includes("skills") && skills.length > 0 && (
              <section className="space-y-3.5 select-text">
                <h3 className="font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base uppercase tracking-wider">
                  {labels.skills}
                </h3>
                <div className="flex flex-wrap gap-2 pt-1 font-bold">
                  {skills.map((skill) => (
                    <span key={skill.id} className="bg-slate-50 text-[#1E293B] border border-slate-200 text-xs px-3 py-1 rounded">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Certifications */}
            {!hiddenSections.includes("certifications") && certifications.length > 0 && (
              <section className="space-y-4 select-text">
                <h3 className="font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base uppercase tracking-wider">
                  {labels.certifications}
                </h3>
                <div className="space-y-2.5">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-xs sm:text-sm">
                      <div className="text-slate-800">
                        <span className="font-bold text-slate-900">{cert.name}</span>
                        {cert.issuer && <span className="text-slate-550 font-bold"> — {cert.issuer}</span>}
                        {cert.certificateId && <span className="text-amber-600 font-extrabold"> [ID: {cert.certificateId}]</span>}
                      </div>
                      <span className={cn("text-xs font-bold text-slate-400 shrink-0", isRtl ? "sm:order-first" : "")}>
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Projects */}
            {!hiddenSections.includes("projects") && projects.length > 0 && (
              <section className="space-y-4 select-text">
                <h3 className="font-extrabold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base uppercase tracking-wider">
                  {labels.projects}
                </h3>
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs sm:text-sm font-bold text-[#1E293B]">
                          {proj.name}
                        </span>
                        {proj.link && (
                          <span className="text-xs text-[#F59E0B] font-bold hover:underline shrink-0 max-w-[200px] truncate">
                            {proj.link}
                          </span>
                        )}
                      </div>
                      {renderDescriptionText(proj.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      );
    };

    // ── TEMPLATE 4: "Arabic First" (mosa'ad for local market, defaults to beautifully styled Cairo typography) ──
    const renderArabic = () => {
      // Arabic First enforces RTL representation as default
      const isRtl = true;
      return (
        <div
          className="bg-white leading-relaxed p-10 relative text-start font-sans min-h-[297mm] text-slate-800 border border-slate-100"
          dir="rtl"
        >
          <header className="mb-7 border-b-2 border-slate-100 pb-5 select-text text-right">
            <h1 className="font-bold text-slate-900 leading-tight mb-2 tracking-tight" style={{ fontSize: "30px", fontFamily: "'Cairo', sans-serif" }}>
              {personalInfo.fullName || "أحمد سمير ممدوح"}
            </h1>
            {personalInfo.jobTitle && (
              <h2 className="text-base sm:text-lg font-bold text-[#059669] mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {personalInfo.jobTitle}
              </h2>
            )}

            {/* Structured responsive grid contact info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#059669] text-[10px]">◀</span>
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#059669] text-[10px]">◀</span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#059669] text-[10px]">◀</span>
                  <span>{personalInfo.address}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#059669] text-[10px]">◀</span>
                  <span className="break-all">{personalInfo.linkedin}</span>
                </div>
              )}
            </div>

            {/* Custom UAE / Saudi / Egypt MENA local recruitment fields card */}
            {(personalInfo.nationality || personalInfo.birthDate || personalInfo.maritalStatus) && (
              <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100/50">
                {personalInfo.nationality && (
                  <div>
                    <span className="text-slate-400 font-bold ml-1">الجنسية:</span>
                    <span className="text-[#059669]">{personalInfo.nationality}</span>
                  </div>
                )}
                {personalInfo.birthDate && (
                  <div>
                    <span className="text-slate-400 font-bold ml-1">تاريخ الميلاد:</span>
                    <span className="text-[#059669]">{personalInfo.birthDate}</span>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div>
                    <span className="text-slate-400 font-bold ml-1">الحالة الاجتماعية:</span>
                    <span className="text-[#059669]">{personalInfo.maritalStatus}</span>
                  </div>
                )}
              </div>
            )}
          </header>

          <div className="space-y-6">
            {/* 1. Summary */}
            {!hiddenSections.includes("summary") && personalInfo.summary && (
              <section className="space-y-2 select-text text-right">
                <h3 className="font-bold text-[#059669] border-r-4 border-[#059669] pr-3 text-xs sm:text-sm tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {labels.summary}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {/* 2. Experience */}
            {!hiddenSections.includes("experience") && experience.length > 0 && (
              <section className="space-y-4 select-text text-right">
                <h3 className="font-bold text-[#059669] border-r-4 border-[#059669] pr-3 text-xs sm:text-sm tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {labels.experience}
                </h3>
                <div className="space-y-4.5">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-slate-900">{exp.company}</span>
                          {exp.company && exp.position && <span className="mx-1.5 text-slate-300">|</span>}
                          <span className="font-medium text-[#059669] italic">{exp.position}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-400 shrink-0 sm:order-first">
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && "–"} {exp.current ? "الحاضر" : exp.endDate}
                        </span>
                      </div>
                      {exp.location && <div className="text-xs text-slate-450 font-bold">{exp.location}</div>}
                      {renderDescriptionText(exp.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Education */}
            {!hiddenSections.includes("education") && education.length > 0 && (
              <section className="space-y-4 select-text text-right">
                <h3 className="font-bold text-[#059669] border-r-4 border-[#059669] pr-3 text-xs sm:text-sm tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {labels.education}
                </h3>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <span className="text-xs sm:text-sm">
                          <span className="font-bold text-slate-900">{edu.institution}</span>
                          {edu.institution && edu.degree && <span className="mx-1.5 text-slate-300">|</span>}
                          <span className="text-slate-650 font-semibold">{edu.degree}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-400 shrink-0 sm:order-first">
                          {edu.startDate} {edu.startDate && edu.endDate && "–"} {edu.endDate}
                        </span>
                      </div>
                      {edu.location && <div className="text-xs text-slate-450 font-bold">{edu.location}</div>}
                      {edu.description && renderDescriptionText(edu.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Skills */}
            {!hiddenSections.includes("skills") && skills.length > 0 && (
              <section className="space-y-3.5 select-text text-right">
                <h3 className="font-bold text-[#059669] border-r-4 border-[#059669] pr-3 text-xs sm:text-sm tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {labels.skills}
                </h3>
                <div className="flex flex-wrap gap-2 pt-1 font-bold">
                  {skills.map((skill) => (
                    <span key={skill.id} className="bg-emerald-50/40 text-[#059669] border border-emerald-100/35 text-xs px-3 py-1 rounded-lg">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Certifications */}
            {!hiddenSections.includes("certifications") && certifications.length > 0 && (
              <section className="space-y-4 select-text text-right">
                <h3 className="font-bold text-[#059669] border-r-4 border-[#059669] pr-3 text-xs sm:text-sm tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {labels.certifications}
                </h3>
                <div className="space-y-2.5">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-xs sm:text-sm">
                      <div className="text-slate-800 font-medium">
                        <span className="font-bold text-slate-900">{cert.name}</span>
                        {cert.issuer && <span className="text-slate-500"> — {cert.issuer}</span>}
                        {cert.certificateId && <span className="text-[#059669] font-black"> [رقم: {cert.certificateId}]</span>}
                      </div>
                      <span className="text-xs font-bold text-slate-400 shrink-0 sm:order-first">
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Projects */}
            {!hiddenSections.includes("projects") && projects.length > 0 && (
              <section className="space-y-4 select-text text-right">
                <h3 className="font-bold text-[#059669] border-r-4 border-[#059669] pr-3 text-xs sm:text-sm tracking-wide" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {labels.projects}
                </h3>
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {proj.name}
                        </span>
                        {proj.link && (
                          <span className="text-xs text-[#059669] font-bold hover:underline shrink-0 max-w-[200px] truncate">
                            {proj.link}
                          </span>
                        )}
                      </div>
                      {renderDescriptionText(proj.description, isRtl)}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      );
    };

    const tWatermark = {
      en: "Created with Hash Resume",
      ar: "تم إنشاء السيرة الذاتية بواسطة Hash Resume",
      fr: "Créé avec Hash Resume",
    };

    const currentTemplate = settings.template || "classic";

    return (
      <div
        ref={(el) => {
          localRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        className="w-full relative bg-white overflow-hidden shadow-sm"
        id="resume-capture-area"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const section = target.closest("section");
          const header = target.closest("header");

          // Avoid catching click events on print or non-meaningful nodes
          if (target.closest(".print\\:hidden")) return;

          if (header) {
            window.dispatchEvent(
              new CustomEvent("preview-section-clicked", {
                detail: { tab: "basics", field: "personalInfo" },
              })
            );
          } else if (section) {
            const text = section.textContent?.toLowerCase() || "";
            if (
              text.includes("summary") ||
              text.includes("ملخص") ||
              text.includes("الخلاصة") ||
              text.includes("profil") ||
              text.includes("professional summary") ||
              text.includes("الملخص المهني")
            ) {
              window.dispatchEvent(
                new CustomEvent("preview-section-clicked", {
                  detail: { tab: "basics", field: "summary" },
                })
              );
            } else if (
              text.includes("experience") ||
              text.includes("الخبرة") ||
              text.includes("الخبرات") ||
              text.includes("العمل") ||
              text.includes("التاريخ المهني") ||
              text.includes("الخبرة المهنية")
            ) {
              window.dispatchEvent(
                new CustomEvent("preview-section-clicked", {
                  detail: { tab: "experience", field: "experience" },
                })
              );
            } else if (
              text.includes("education") ||
              text.includes("التعليم") ||
              text.includes("الدراسة") ||
              text.includes("المسار التعليمي") ||
              text.includes("المؤهلات العلمية")
            ) {
              window.dispatchEvent(
                new CustomEvent("preview-section-clicked", {
                  detail: { tab: "education", field: "education" },
                })
              );
            } else if (
              text.includes("skills") ||
              text.includes("المهارات") ||
              text.includes("compétences") ||
              text.includes("القدرات والمهارات")
            ) {
              window.dispatchEvent(
                new CustomEvent("preview-section-clicked", {
                  detail: { tab: "skills", field: "skills" },
                })
              );
            } else if (
              text.includes("projects") ||
              text.includes("المشاريع") ||
              text.includes("مشاريعي الشخصية") ||
              text.includes("مشاريع")
            ) {
              window.dispatchEvent(
                new CustomEvent("preview-section-clicked", {
                  detail: { tab: "projects", field: "projects" },
                })
              );
            } else if (
              text.includes("certifications") ||
              text.includes("الشهادات") ||
              text.includes("الكورسات والشهادات")
            ) {
              window.dispatchEvent(
                new CustomEvent("preview-section-clicked", {
                  detail: { tab: "certifications", field: "certifications" },
                })
              );
            }
          }
        }}
      >
        {settings?.inkFriendly && (
          <style dangerouslySetInnerHTML={{ __html: `
            /* Ink-Friendly High Contrast Mechanical Print Mode Override Rules */
            #resume-capture-area {
              background-color: #ffffff !important;
              color: #000000 !important;
            }
            #resume-capture-area *, 
            #resume-capture-area h1, 
            #resume-capture-area h2, 
            #resume-capture-area h3, 
            #resume-capture-area h4, 
            #resume-capture-area h5, 
            #resume-capture-area h6, 
            #resume-capture-area span, 
            #resume-capture-area p, 
            #resume-capture-area li, 
            #resume-capture-area div, 
            #resume-capture-area a {
              color: #000000 !important;
              text-shadow: none !important;
              font-smoothing: antialiased !important;
              -webkit-font-smoothing: antialiased !important;
            }
            /* Override background tones / colors for sidebars, cards, and accent bars */
            #resume-capture-area div[class*="bg-slate-"],
            #resume-capture-area div[class*="bg-gray-"],
            #resume-capture-area div[class*="bg-zinc-"],
            #resume-capture-area div[class*="bg-blue-"],
            #resume-capture-area div[class*="bg-brand-"],
            #resume-capture-area div[class*="bg-indigo-"] {
              background-color: #ffffff !important;
              background-image: none !important;
              border: 1px solid #000000 !important;
            }
            /* Treat colored background badges beautifully as outlined with thick borders */
            #resume-capture-area span[class*="bg-slate-"],
            #resume-capture-area span[class*="bg-blue-"],
            #resume-capture-area span[class*="bg-brand-"] {
              background-color: #ffffff !important;
              border: 1.5px solid #000000 !important;
              color: #000000 !important;
              font-weight: 800 !important;
              padding: 2px 8px !important;
            }
            /* Dark headers, sidebars or banners need to be white background with crisp black text */
            #resume-capture-area header,
            #resume-capture-area .bg-slate-900,
            #resume-capture-area .bg-gray-900,
            #resume-capture-area .bg-slate-800,
            #resume-capture-area [style*="background-color"] {
              background-color: #ffffff !important;
              color: #000000 !important;
              border-color: #000000 !important;
            }
            /* Solid high-precision line-height spacing for mechanical paper readability */
            #resume-capture-area p,
            #resume-capture-area li {
              line-height: 1.62 !important;
              letter-spacing: 0.01em !important;
            }
            /* Guarantee ultra-high border contrast for divider lines */
            #resume-capture-area hr,
            #resume-capture-area div[class*="border-"],
            #resume-capture-area span[class*="border-"],
            #resume-capture-area section[class*="border-"],
            #resume-capture-area [style*="border-color"] {
              border-color: #000000 !important;
              border-width: 1.5px !important;
              opacity: 1 !important;
            }
            /* Ensure bullet points and markers is deep graphite/black */
            #resume-capture-area .text-slate-300,
            #resume-capture-area .text-slate-400 {
              color: #111111 !important;
            }
            /* Increase baseline font-weight to prevent laser printer toner dropouts */
            #resume-capture-area .font-bold {
              font-weight: 850 !important;
            }
            #resume-capture-area .font-semibold {
              font-weight: 750 !important;
            }
            #resume-capture-area .font-medium {
              font-weight: 650 !important;
            }
          ` }} />
        )}
        {/* Dynamic clean template dispatch */}
        {currentTemplate === "classic-professional" && renderClassicProfessional()}
        {currentTemplate === "ats-professional" && renderATSProfessional()}
        
        {currentTemplate === "arabic" && renderArabic()}
        
        {currentTemplate === "executive" && renderExecutive()}
        
        {(currentTemplate === "modern" || 
          currentTemplate === "minimal" || 
          currentTemplate === "tech" || 
          currentTemplate === "creative" || 
          currentTemplate === "medical" || 
          currentTemplate === "engineering") && renderModern()}

        {(currentTemplate === "classic" || 
          currentTemplate === "legal" || 
          currentTemplate === "academic" || 
          currentTemplate === "finance" || 
          currentTemplate === "professional" ||
          currentTemplate === "elegant") && renderClassic()}

        {settings?.showQRCode && qrSrc && (
          <div className={cn(
            "mt-8 pt-4 border-t border-slate-100 flex items-center justify-between font-sans print:flex px-6 sm:px-[0.75in] mb-4 pb-2",
            settings.language === "ar" ? "flex-row-reverse" : "flex-row"
          )} dir={settings.language === "ar" ? "rtl" : "ltr"}>
            <div className="text-start space-y-1">
              <h5 className="text-[11px] sm:text-xs font-bold text-slate-800">
                {settings.language === "ar" ? "معلومات التواصل والشبكات الرقمية" : "Connect & Verify Portfolio"}
              </h5>
              <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed max-w-[200px] sm:max-w-xs">
                {settings.language === "ar"
                  ? "امسح رمز الاستجابة السريعة (QR Code) بجوالك لزيارة ملفي الرقمي والاطلاع على التحديثات وأعمالي أولاً بأول."
                  : "Scan the QR code with your mobile device to view my live professional profile, portfolio, and verify credentials."}
              </p>
            </div>
            <div className="shrink-0 bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center gap-1">
              <img src={qrSrc} alt="Contact QR Code" className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px]" />
              <span className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {settings.qrCodeType === "linkedin" ? "LinkedIn CV" : "vCard Contact"}
              </span>
            </div>
          </div>
        )}

        {/* Minimal Watermark */}
        <div className="mt-8 pb-4 text-center text-xs text-slate-300 font-medium opacity-60 print:hidden select-none">
          {tWatermark[settings.language as keyof typeof tWatermark] || tWatermark.en}
        </div>
      </div>
    );
  }),
);

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;