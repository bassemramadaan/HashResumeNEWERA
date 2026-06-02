import * as fs from "fs";

function patch() {
  const file = "src/components/editor/MobileEditorLayout.tsx";
  let content = fs.readFileSync(file, "utf8");

  content = content.replace("bg-rose-550/10 border-rose-500/25", "bg-slate-900/10 border-slate-900/20");

  content = content.replace(
    'key={s.id}',
    'key={s.id}\n                    id={`m-tab-${s.id}`}'
  );

  if (!content.includes("document.getElementById(`m-tab-${activeSection}`)")) {
    if (!content.includes("useEffect,")) {
        content = content.replace('useState', 'useState, useEffect');
    }
    
    // Add the useEffect hook
    content = content.replace('const currentIndex = stepIds.indexOf(activeSection);', `const currentIndex = stepIds.indexOf(activeSection);

  useEffect(() => {
    const tabEl = document.getElementById(\`m-tab-\${activeSection}\`);
    if (tabEl) {
      tabEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSection]);`);
  }

  fs.writeFileSync(file, content);
  console.log("Patched MobileEditorLayout");
}
patch();
