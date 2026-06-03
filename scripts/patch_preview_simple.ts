import * as fs from "fs";

function patch() {
  const file = "src/components/preview/ResumePreview.tsx";
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(/data\.customSections/g, "([] as any[])");
  
  // also EditorSidebar
  const sidebarFile = "src/components/editor/EditorSidebar.tsx";
  let sidebar = fs.readFileSync(sidebarFile, "utf8");
  sidebar = sidebar.replace(/, "custom"/g, "");
  fs.writeFileSync(sidebarFile, sidebar);

  // also MobileEditorLayout
  const mobileFile = "src/components/editor/MobileEditorLayout.tsx";
  let mobile = fs.readFileSync(mobileFile, "utf8");
  mobile = mobile.replace(/,\s*"custom"/g, "");
  mobile = mobile.replace(/\{\s*id:\s*"custom"[\s\S]*?\},/g, "");
  fs.writeFileSync(mobileFile, mobile);
  
  fs.writeFileSync(file, content);
}
patch();
