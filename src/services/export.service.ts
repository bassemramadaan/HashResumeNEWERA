import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const ExportService = {
  /**
   * Generates a PDF from a given HTML element.
   * @param elementId The ID of the HTML element to export.
   * @param filename The desired filename for the downloaded PDF.
   */
  async exportToPDF(
    elementId: string,
    filename: string = "resume.pdf",
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found.`);
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(filename);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      throw new Error("Failed to generate PDF.", { cause: error });
    }
  },

  /**
   * Generates a Word document from resume data.
   * Note: This is a placeholder for the actual docx generation logic.
   */
  async exportToWord(
    resumeData: unknown,
    filename: string = "resume.docx",
  ): Promise<void> {
    console.log("Exporting to Word with data:", resumeData);
    // In a real implementation, you would use the 'docx' library to build the document.
    // For now, we simulate the process.
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Successfully exported ${filename}`);
        resolve();
      }, 1000);
    });
  },
};
