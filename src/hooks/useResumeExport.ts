import { useState, useCallback, useEffect } from "react";
import { useResumeStore } from "../store/useResumeStore";

interface ExportStatus {
  show: boolean;
  step: number;
  format: "pdf" | "docx" | "txt";
}

interface UseResumeExportProps {
  language: string;
  data: any;
  isPremium: boolean;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function useResumeExport({
  language,
  data,
  isPremium,
  showToast
}: UseResumeExportProps) {
  const [exportStatus, setExportStatus] = useState<ExportStatus | null>(null);
  const [hasExported, setHasExported] = useState(false);
  const [showPostDownloadModal, setShowPostDownloadModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showResumeChecker, setShowResumeChecker] = useState(false);

  const generateFingerprint = useCallback((cvData: any): string => {
    const str = JSON.stringify({
      personalInfo: cvData.personalInfo,
      workExperience: cvData.experience,
      education: cvData.education,
      skills: cvData.skills,
    });
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }, []);

  const checkCanDownload = useCallback((): "free" | "needs-code" | "first-time" => {
    const savedFingerprint = localStorage.getItem("cv-last-download-fingerprint");
    if (!savedFingerprint) return "first-time";
    
    const currentFingerprint = generateFingerprint(data);
    if (currentFingerprint === savedFingerprint) return "free";
    
    return "needs-code";
  }, [data, generateFingerprint]);

  const onSuccessfulDownload = useCallback(() => {
    const fingerprint = generateFingerprint(data);
    const snapshot = JSON.stringify(data);
    localStorage.setItem("cv-last-download-fingerprint", fingerprint);
    localStorage.setItem("cv-last-download-snapshot", snapshot);
  }, [data, generateFingerprint]);

  const handlePrint = useCallback(() => {
    try {
      const resumeElement = document.getElementById("resume-capture-area");
      if (!resumeElement) {
        console.error("Resume capture area not found for print");
        window.print();
        return;
      }

      let printContainer = document.getElementById("resume-print-container");
      if (!printContainer) {
        printContainer = document.createElement("div");
        printContainer.id = "resume-print-container";
        const clone = resumeElement.cloneNode(true) as HTMLElement;
        clone.id = "resume-print-capture-area";
        printContainer.appendChild(clone);
        document.body.appendChild(printContainer);
      }
      
      document.body.classList.add("printing-resume-active");

      setTimeout(() => {
        window.print();
        const pc = document.getElementById("resume-print-container");
        if (pc) pc.remove();
        document.body.classList.remove("printing-resume-active");
      }, 50);
    } catch (err) {
      console.error("Print failed:", err);
      window.print();
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("cv-locked");
    localStorage.removeItem("cv-is-locked");
    useResumeStore.getState().unlockResume();

    const handleBeforePrint = () => {
      if (!document.getElementById("resume-print-container")) {
        const resumeElement = document.getElementById("resume-capture-area");
        if (resumeElement) {
          const printContainer = document.createElement("div");
          printContainer.id = "resume-print-container";
          const clone = resumeElement.cloneNode(true) as HTMLElement;
          clone.id = "resume-print-capture-area";
          printContainer.appendChild(clone);
          document.body.appendChild(printContainer);
          document.body.classList.add("printing-resume-active");
        }
      }
    };

    const handleAfterPrint = () => {
      const printContainer = document.getElementById("resume-print-container");
      if (printContainer) {
        printContainer.remove();
      }
      document.body.classList.remove("printing-resume-active");
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const handleExportClick = useCallback(() => {
    setShowResumeChecker(true);
  }, []);

  const handleProceedToExport = useCallback(async (
    formatInput: "pdf" | "docx" | "txt" | any = "pdf",
    forceAllow = false
  ) => {
    const format: "pdf" | "docx" | "txt" = (typeof formatInput === "string" && ["pdf", "docx", "txt"].includes(formatInput))
      ? formatInput
      : "pdf";

    setShowResumeChecker(false);

    const canDownloadState = checkCanDownload();
    const isFreeDownload = canDownloadState === "free";
    const allowed = forceAllow || isPremium || isFreeDownload;

    if (!allowed) {
      setShowPaymentModal(true);
      return;
    }

    setExportStatus({ show: true, step: 0, format });
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    if (format === "pdf") {
      try {
        setExportStatus({ show: true, step: 1, format }); 
        await sleep(1000);
        setExportStatus({ show: true, step: 2, format }); 
        await sleep(1000);
        setExportStatus({ show: true, step: 3, format }); 
        
        setExportStatus(null);
        handlePrint();
        
        setHasExported(true);
        onSuccessfulDownload();
        
        setTimeout(() => setShowPostDownloadModal(true), 300);
      } catch (err: any) {
        console.error("Export failed:", err);
        showToast(language === "ar" ? "حدث خطأ أثناء التصدير. يرجى المحاولة مرة أخرى." : "Export failed. Please try again.", "error");
        setExportStatus(null);
      }
    } else if (format === "docx") {
      try {
        setExportStatus({ show: true, step: 1, format });
        await sleep(800);
        setExportStatus({ show: true, step: 3, format });
        await sleep(800);
        
        const resumeElement = document.getElementById("resume-capture-area");
        if (!resumeElement) throw new Error("Resume element not found");

        const styles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules || [])
                .map(rule => rule.cssText)
                .join("\n");
            } catch {
              return "";
            }
          })
          .join("\n");

        const htmlContent = `
          <!DOCTYPE html>
          <html dir="${document.documentElement.dir || "ltr"}" xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
              <meta charset="UTF-8">
              <style>
                ${styles}
                * {
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  white-space: normal !important;
                  box-sizing: border-box !important;
                }
                body {
                  margin: 0;
                  padding: 0;
                  width: 794px;
                  font-family: Arial, sans-serif;
                }
              </style>
            </head>
            <body>
              ${resumeElement.outerHTML}
            </body>
          </html>
        `;
        
        const converted = new Blob(["\ufeff", htmlContent], {
            type: "application/msword"
        });
        
        const url = URL.createObjectURL(converted);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.personalInfo?.fullName || "CV"}_HashResume.doc`;
        a.click();
        URL.revokeObjectURL(url);

        onSuccessfulDownload();
        setExportStatus({ show: true, step: 5, format });
        (window as any).triggerFrictionlessConfetti?.();
        await sleep(1000);
        setExportStatus(null);
        setHasExported(true);
        setShowPostDownloadModal(true);
      } catch (e) {
        console.error("Word gen err:", e);
        setExportStatus(null);
      }
    } else if (format === "txt") {
      try {
        setExportStatus({ show: true, step: 1, format });
        await sleep(550);
        const text = `${data.personalInfo?.fullName || ""}\n${data.personalInfo?.email || ""}\n${data.personalInfo?.phone || ""}\n\nEXPERIENCE\n${(data.experience || [])
          .map((exp: any) => `${exp.role || ""} at ${exp.company || ""}\n${exp.description || ""}`)
          .join("\n\n")}`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${data.personalInfo?.fullName || "resume"}.txt`;
        link.click();
        onSuccessfulDownload();
        setExportStatus({ show: true, step: 5, format });
        await sleep(1000);
        setExportStatus(null);
        setHasExported(true);
      } catch (e) {
        console.error("Txt gen err:", e);
        setExportStatus(null);
      }
    }
  }, [language, data, isPremium, checkCanDownload, handlePrint, onSuccessfulDownload, showToast]);

  return {
    exportStatus,
    setExportStatus,
    hasExported,
    setHasExported,
    showPostDownloadModal,
    setShowPostDownloadModal,
    showPaymentModal,
    setShowPaymentModal,
    showResumeChecker,
    setShowResumeChecker,
    handleExportClick,
    handleProceedToExport,
    handlePrint,
    checkCanDownload,
    generateFingerprint,
    onSuccessfulDownload
  };
}
