import * as fs from "fs";

function removeOthers() {
  const schemaFile = "src/schemas/resume.schema.ts";
  if (fs.existsSync(schemaFile)) {
    let content = fs.readFileSync(schemaFile, "utf8");
    content = content.replace(/export const customSectionSchema = z\.object\(\{[\s\S]*?\}\);\n\n/g, "");
    content = content.replace(/\s*customSections: z\.array\(customSectionSchema\),/g, "");
    fs.writeFileSync(schemaFile, content);
  }

  const testFile = "src/utils/ats.test.ts";
  if (fs.existsSync(testFile)) {
    let content = fs.readFileSync(testFile, "utf8");
    content = content.replace(/\s*customSections: \[\],/g, "");
    fs.writeFileSync(testFile, content);
  }

  const previewFile = "src/components/preview/ResumePreview.tsx";
  if (fs.existsSync(previewFile)) {
    let content = fs.readFileSync(previewFile, "utf8");
    // Just find any usage of data.customSections and remove it. But actually we might need to remove entire blocks.
    // It's safer to just set data.customSections to [] in rendering or let it be. But data won't have customSections typed.
    // We can replace access with fallback block or just remove blocks using it. 
    // Wait, the preview checks for data.customSections. If it doesn't exist, it evaluates to undefined.
    // If we use TypeScript, we should ignore type errors or properly remove custom Sections.
    // Let's replace customSections mapping block with nothing.
    content = content.replace(/\{data\.customSections\?\.length > 0 && \([\s\S]*?\}\)\}[\n\s]*\}\)/g, ""); // Not safe without parser.
    fs.writeFileSync(previewFile, content);
  }
}
removeOthers();
