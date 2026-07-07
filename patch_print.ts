import fs from "fs";

const file = "src/pages/EditorPage.tsx";
let code = fs.readFileSync(file, "utf8");

const handlePrintRegex = /const handlePrint = async \(\) => \{[\s\S]*?\}\n    \} catch \(err\) \{[\s\S]*?\}\n  \};/m;

const newHandlePrint = `const handlePrint = async () => {
    try {
      const resumeElement = document.getElementById("resume-capture-area");
      if (!resumeElement) {
        console.error("No capture area found");
        return;
      }
      
      const printContainer = document.createElement("div");
      printContainer.id = "resume-print-container";
      
      const clone = resumeElement.cloneNode(true) as HTMLElement;
      clone.id = "resume-print-capture-area";
      
      printContainer.appendChild(clone);
      document.body.appendChild(printContainer);
      
      document.body.classList.add("printing-resume-active");
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        window.print();
      } catch (printErr) {
        console.error("Print blocked by iframe:", printErr);
        alert(language === "ar" ? "يرجى فتح التطبيق في نافذة جديدة (New Tab) لكي يعمل التصدير بشكل صحيح." : "Please open the application in a new tab to enable exporting.");
      }
      
      document.body.classList.remove("printing-resume-active");
      printContainer.remove();
    } catch (err) {
      console.error("Print failed:", err);
      alert(language === "ar" ? "يرجى فتح التطبيق في نافذة جديدة (New Tab) لكي يعمل التصدير بشكل صحيح." : "Please open the application in a new tab to enable exporting.");
    }
  };`;

code = code.replace(handlePrintRegex, newHandlePrint);
fs.writeFileSync(file, code);
