import * as fs from "fs";

function removeCustomFromStore() {
  const storeFile = "src/store/useResumeStore.ts";
  let content = fs.readFileSync(storeFile, "utf8");

  content = content.replace(/export type CustomSection = \{[\s\S]*?\};\n\n/g, "");
  content = content.replace(/\s*customSections: CustomSection\[\];/g, "");
  content = content.replace(/\s*customSections: \(data\.customSections \|\| \[\]\)\.map\(\(s: any\) => `\$\{s\.title\}-\$\{s\.content\}`\),/g, "");
  content = content.replace(/\s*customSections: \[\],/g, "");
  content = content.replace(/\s*addCustomSection: \(section: Omit<CustomSection, "id">\) => void;\n\s*removeCustomSection: \(id: string\) => void;\n\s*updateCustomSection: \(id: string, updates: Partial<CustomSection>\) => void;\n\s*reorderCustomSections: \(sections: CustomSection\[\]\) => void;\n\s*duplicateCustomSection: \(id: string\) => void;/g, "");
  content = content.replace(/\s*addCustomSection: \([\s\S]*?duplicateCustomSection: \([\s\S]*?\},/g, "");

  fs.writeFileSync(storeFile, content);
}

removeCustomFromStore();
