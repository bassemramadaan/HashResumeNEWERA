import fs from "fs";

const file = "src/pages/EditorPage.tsx";
let code = fs.readFileSync(file, "utf8");

const startStr = 'const handleProceedToExport = async (';
const endStr = 'const tabs: TabItem[] = [';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const newHandleProceed = `const handleProceedToExport = async (
    formatInput: "pdf" | "docx" | "txt" | any = "pdf",
    forceAllow = false,
  ) => {
    const format: "pdf" | "docx" | "txt" = (typeof formatInput === "string" && ["pdf", "docx", "txt"].includes(formatInput))
      ? formatInput
      : "pdf";

    setShowResumeChecker(false);

    const canDownloadState = checkCanDownload();
    const isFreeDownload = canDownloadState === "free";

    const allowed = forceAllow || isFreeDownload || (isPremium && canDownloadState === "first-time");

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
        await handlePrint();
        
        setHasExported(true);
        onSuccessfulDownload();
        
        setTimeout(() => setShowPostDownloadModal(true), 300);
      } catch (err: any) {
        console.error("Export failed:", err);
        alert(language === "ar" ? "حدث خطأ أثناء التصدير. يرجى المحاولة مرة أخرى." : "Export failed. Please try again.");
        setExportStatus(null);
      }
    } else if (format === "docx") {
      try {
        setExportStatus({ show: true, step: 1, format });
        await sleep(800);
        setExportStatus({ show: true, step: 3, format });
        await sleep(800);
        
        const resumeElement = document.getElementById('resume-capture-area');
        if (!resumeElement) throw new Error("Resume element not found");

        // Get all active styles to inject into exported document
        const styles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules || [])
                .map(rule => rule.cssText)
                .join('\\n');
            } catch {
              return '';
            }
          })
          .join('\\n');

        const htmlContent = \`
          <!DOCTYPE html>
          <html dir="\${document.documentElement.dir || 'ltr'}" xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
              <meta charset="UTF-8">
              <style>
                \${styles}
                /* Force proper rendering */
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
              \${resumeElement.outerHTML}
            </body>
          </html>
        \`;
        
        // Use standard MS Word Blob application type
        const converted = new Blob(['\\ufeff', htmlContent], {
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(converted);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`\${fullName || 'CV'}_HashResume.doc\`;
        a.click();
        URL.revokeObjectURL(url);

        onSuccessfulDownload();
        setExportStatus({ show: true, step: 5, format });
        // Trigger confetti celebration!
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
        const data = useResumeStore.getState().data;
        const text = \`\${data.personalInfo.fullName}\\n\${data.personalInfo.email}\\n\${data.personalInfo.phone}\\n\\nEXPERIENCE\\n\${data.experience
          .map((exp) => \`\${exp.role} at \${exp.company}\\n\${exp.description}\`)
          .join("\\n\\n")}\`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = \`\${data.personalInfo.fullName || "resume"}.txt\`;
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
  };

  `;
  code = code.substring(0, startIdx) + newHandleProceed + code.substring(endIdx);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced handleProceedToExport with DOCX and TXT!");
} else {
  console.error("Could not find start or end index.");
}
