import React, { forwardRef, memo, useRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useResumeStore, ResumeData } from "../../store/useResumeStore";
import { useActiveSectionStore } from "../../store/useActiveSectionStore";
import { cn } from "@/lib/utils";
import TemplateClassic from "./TemplateClassic";
import TemplateModern from "./TemplateModern";
import TemplateExecutive from "./TemplateExecutive";
import TemplateMinimal from "./TemplateMinimal";
import TemplateTimeline from "./TemplateTimeline";

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

    const {
      personalInfo = { fullName: "", jobTitle: "", email: "", phone: "", address: "", summary: "" },
      settings = { template: "classic", language: "en" },
    } = data;

    const [qrSrc, setQrSrc] = useState<string>("");
    const [spacingOption, setSpacingOption] = useState<"compact" | "standard" | "spacious">("standard");

    useEffect(() => {
      // Check initial spacing
      const initialSpacing = localStorage.getItem('cv-spacing') as "compact" | "standard" | "spacious";
      if (initialSpacing) setSpacingOption(initialSpacing);

      // Listen for changes
      const handleSpacingChange = () => {
        const newSpacing = localStorage.getItem('cv-spacing') as "compact" | "standard" | "spacious";
        if (newSpacing) setSpacingOption(newSpacing);
      };
      
      window.addEventListener('cv-spacing-changed', handleSpacingChange);
      return () => window.removeEventListener('cv-spacing-changed', handleSpacingChange);
    }, []);

    const spacingOptions = {
      compact: {
        lineHeight: '1.2',
        sectionGap: '8px',
        itemGap: '4px',
        fontSize: '10px',
        padding: '16px',
      },
      standard: {
        lineHeight: '1.5',
        sectionGap: '14px',
        itemGap: '8px',
        fontSize: '11px',
        padding: '24px',
      },
      spacious: {
        lineHeight: '1.8',
        sectionGap: '20px',
        itemGap: '12px',
        fontSize: '12px',
        padding: '32px',
      },
    };

    const currentSpacing = spacingOptions[spacingOption] || spacingOptions.standard;

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
        className="w-full relative bg-white overflow-hidden shadow-sm cv-preview"
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
          ` }} />
        )}


        {/* Dynamic clean template dispatch */}
        <div id="resume-capture-area" className="cv-preview">
          {currentTemplate === "classic" && <TemplateClassic data={data} />}
          {currentTemplate === "modern" && <TemplateModern data={data} />}
          {currentTemplate === "executive" && <TemplateExecutive data={data} />}
          {currentTemplate === "minimal" && <TemplateMinimal data={data} />}
          {currentTemplate === "timeline" && <TemplateTimeline data={data} />}
        </div>

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