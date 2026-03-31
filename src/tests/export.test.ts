import { describe, it, vi } from "vitest";
import { ExportService } from "../services/export.service";

// Mocking the jsPDF and html2canvas modules
vi.mock("jspdf", () => {
  return {
    jsPDF: class {
      addImage = vi.fn();
      save = vi.fn();
    },
  };
});

vi.mock("html2canvas", () => {
  return {
    default: vi.fn().mockResolvedValue({
      toDataURL: vi
        .fn()
        .mockReturnValue(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        ),
      width: 100,
      height: 100,
    }),
  };
});

describe("ExportService", () => {
  it("should export to PDF", async () => {
    // Create a dummy element for html2canvas to process
    const dummyElement = document.createElement("div");
    dummyElement.id = "test-element";
    document.body.appendChild(dummyElement);

    await ExportService.exportToPDF("test-element", "test.pdf");

    // Clean up
    document.body.removeChild(dummyElement);
  });

  it("should export to Word", async () => {
    const resumeData = { personalInfo: { fullName: "John Doe" } };
    await ExportService.exportToWord(resumeData, "test.docx");
  });
});
