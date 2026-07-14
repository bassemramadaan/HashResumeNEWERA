import React, { forwardRef, memo, useRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useResumeStore, ResumeData } from "../../store/useResumeStore";
import { useActiveSectionStore } from "../../store/useActiveSectionStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import TemplateClassic from "./TemplateClassic";
import TemplateModern from "./TemplateModern";
import TemplateExecutive from "./TemplateExecutive";
import TemplateMinimal from "./TemplateMinimal";
import TemplateTimeline from "./TemplateTimeline";
import TemplateTwoColumn from "./TemplateTwoColumn";

interface ResumePreviewProps {
  data?: ResumeData;
}

const ResumePreview = memo(
  forwardRef<HTMLDivElement, ResumePreviewProps>((props, ref) => {
    const storeData = useResumeStore((state) => state.data);
    const data = props.data || storeData;
    
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

    const {
      personalInfo = { fullName: "", jobTitle: "", email: "", phone: "", address: "", summary: "" },
      settings = { template: "classic", language: "en" },
    } = data;

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

    const tWatermark = {
      en: "Created with Hash Resume",
      ar: "تم إنشاء السيرة الذاتية بواسطة Hash Resume",
      fr: "Créé avec Hash Resume",
    };

    const currentTemplate = settings.template || "classic";
    const [isShimmering, setIsShimmering] = useState(false);

    useEffect(() => {
      setIsShimmering(true);
      const timer = setTimeout(() => {
        setIsShimmering(false);
      }, 220); // Snappy 220ms loading simulation
      return () => clearTimeout(timer);
    }, [settings?.template, settings?.sectionSpacing, settings?.fontFamily]);

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
        <div 
          data-font-family={settings.fontFamily || "inter"}
          data-spacing={settings.sectionSpacing || "normal"}
          data-font-size={settings.fontSize || "medium"}
          data-line-height={settings.lineHeight || "normal"}
          data-margin-size={settings.marginSize || "normal"}
          className={cn(
            "cv-preview min-h-[1056px]",
            settings.fontFamily === 'serif' ? 'font-serif' : settings.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
          )}
          style={{
            ['--spacing-multiplier' as any]: settings.sectionSpacing === 'compact' ? 0.75 : settings.sectionSpacing === 'relaxed' ? 1.5 : 1
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .cv-preview * {
              letter-spacing: normal !important;
              word-spacing: normal !important;
            }
            .cv-preview {
              overflow-wrap: break-word;
              word-wrap: break-word;
              hyphens: auto;
            }
            .cv-preview * {
              min-width: 0;
            }
            .cv-preview a, .cv-preview .break-all {
              word-break: break-all;
            }
            .cv-preview section {
              margin-bottom: calc(1.5rem * var(--spacing-multiplier)) !important;
            }
            /* Custom page margins styling */
            .cv-preview[data-margin-size="compact"] .p-\\[40px\\],
            .cv-preview[data-margin-size="compact"] .w-\\[794px\\] {
              padding: 20px 24px !important;
            }
            .cv-preview[data-margin-size="relaxed"] .p-\\[40px\\],
            .cv-preview[data-margin-size="relaxed"] .w-\\[794px\\] {
              padding: 56px 64px !important;
            }
            /* Adjust executive template padding if compact */
            .cv-preview[data-margin-size="compact"] .p-\\[24px\\] { padding: 12px 16px !important; }
            .cv-preview[data-margin-size="compact"] .p-\\[28px\\] { padding: 14px 18px !important; }
            /* Adjust executive template padding if relaxed */
            .cv-preview[data-margin-size="relaxed"] .p-\\[24px\\] { padding: 36px 44px !important; }
            .cv-preview[data-margin-size="relaxed"] .p-\\[28px\\] { padding: 40px 48px !important; }

            @media print {
              .cv-preview section, .cv-preview .avoid-break {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              .cv-preview h1, .cv-preview h2, .cv-preview h3 {
                page-break-after: avoid;
                break-after: avoid;
              }
            }
          `}} />
          <AnimatePresence mode="wait">
            {isShimmering ? (
              <motion.div
                key="shimmer-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="w-full min-h-[800px] p-8 sm:p-12 flex flex-col gap-6 bg-white print:hidden"
              >
                {/* Header Shimmer */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-7 bg-slate-100 rounded-md w-48 sm:w-64" />
                    <div className="h-4 bg-slate-100 rounded-md w-32 sm:w-44" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100/90 rounded w-28" />
                    <div className="h-3 bg-slate-100/90 rounded w-36" />
                  </div>
                </div>

                {/* Separator */}
                <div className="h-[1.5px] bg-slate-100 rounded animate-pulse" />

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 animate-pulse">
                  {/* Left Column / Main Info */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Summary Shimmer */}
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded-md w-24" />
                      <div className="h-3 bg-slate-100/85 rounded w-full" />
                      <div className="h-3 bg-slate-100/85 rounded w-11/12" />
                      <div className="h-3 bg-slate-100/85 rounded w-5/6" />
                    </div>

                    {/* Experience Shimmer */}
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 rounded-md w-28" />
                      
                      <div className="space-y-2.5">
                        <div className="flex justify-between">
                          <div className="h-3.5 bg-slate-100 rounded w-1/3" />
                          <div className="h-3 bg-slate-100 rounded w-16" />
                        </div>
                        <div className="h-3 bg-slate-100/70 rounded w-5/6" />
                        <div className="h-3 bg-slate-100/70 rounded w-4/5" />
                      </div>

                      <div className="space-y-2.5 pt-2">
                        <div className="flex justify-between">
                          <div className="h-3.5 bg-slate-100 rounded w-1/4" />
                          <div className="h-3 bg-slate-100 rounded w-16" />
                        </div>
                        <div className="h-3 bg-slate-100/70 rounded w-11/12" />
                        <div className="h-3 bg-slate-100/70 rounded w-4/5" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column / Sidebar Info */}
                  <div className="space-y-6 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-6 md:pt-0">
                    {/* Skills Shimmer */}
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded-md w-20" />
                      <div className="flex flex-wrap gap-2">
                        <div className="h-6 bg-slate-100 rounded-full w-14" />
                        <div className="h-6 bg-slate-100 rounded-full w-20" />
                        <div className="h-6 bg-slate-100 rounded-full w-16" />
                        <div className="h-6 bg-slate-100 rounded-full w-12" />
                        <div className="h-6 bg-slate-100 rounded-full w-18" />
                      </div>
                    </div>

                    {/* Contact Details Shimmer */}
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded-md w-24" />
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 rounded w-2/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentTemplate}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="w-full h-full"
              >
                {currentTemplate === "classic" && <TemplateClassic data={data} />}
                {currentTemplate === "modern" && <TemplateModern data={data} />}
                {currentTemplate === "executive" && <TemplateExecutive data={data} />}
                {currentTemplate === "minimal" && <TemplateMinimal data={data} />}
                {currentTemplate === "timeline" && <TemplateTimeline data={data} />}
                {currentTemplate === "two-column" && <TemplateTwoColumn data={data} />}
              </motion.div>
            )}
          </AnimatePresence>
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