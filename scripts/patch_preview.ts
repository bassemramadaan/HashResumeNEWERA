import * as fs from "fs";

function processPreview() {
  const file = "src/components/preview/ResumePreview.tsx";
  let content = fs.readFileSync(file, "utf8");

  // This removes {data.customSections?.length > 0 && (...)}
  content = content.replace(/\{data\.customSections\?\.length > 0 && \(\s*<div[\s\S]*?\{data\.customSections\.map\(\(section\) => \(\s*<div key=\{section\.id\}[\s\S]*?<\/div>\s*\)\)\}\s*<\/div>\s*\)\}/g, "");
  
  // This removes if (!data.customSections || data.customSections.length === 0) return null; blocks
  // Which typically looks like:
  // if (sectionId === "custom") {
  //   if (!data.customSections || data.customSections.length === 0) return null;
  //   return (
  //     <div key="custom" className="...">
  //       ...
  //       {data.customSections.map((section) => (
  //          ...
  //       ))}
  //     </div>
  //   );
  // }
  
  content = content.replace(/if \(sectionId === "custom"\) \{[\s\S]*?if \(!data\.customSections[\s\S]*?return \([\s\S]*?\{data\.customSections\.map\([\s\S]*?<\/div>\s*\);\s*\}/g, "");

  fs.writeFileSync(file, content);
}
processPreview();
