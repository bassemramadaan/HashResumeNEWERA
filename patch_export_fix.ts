import fs from "fs";

const file = "src/pages/EditorPage.tsx";
let code = fs.readFileSync(file, "utf8");

// We want to replace the whole handleProceedToExport.
const startStr = 'const handleProceedToExport = async (';
const endStr = 'const handlePrint = async () => {';

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
  };

  `;
  code = code.substring(0, startIdx) + newHandleProceed + code.substring(endIdx);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced handleProceedToExport!");
} else {
  console.error("Could not find start or end index.");
}
