const fs = require('fs');
let code = fs.readFileSync('src/components/preview/ResumePreview.tsx', 'utf8');

const regex = /{experience\.length > 0 && \(\s*(<section(?!.*className="mb-10")>[\s\S]*?<\/section>)\s*\)}\s*{education\.length > 0 && \(\s*(<section>[\s\S]*?<\/section>)\s*\)}/g;

code = code.replace(regex, (match, expSection, eduSection) => {
  return `{(settings.isFreshGrad ? ["education", "experience"] : ["experience", "education"]).map((sectionId) => {
            if (sectionId === "experience" && experience.length > 0) {
              return (
${expSection}
              );
            }
            if (sectionId === "education" && education.length > 0) {
              return (
${eduSection}
              );
            }
            return null;
          })}`;
});

fs.writeFileSync('src/components/preview/ResumePreview.tsx', code);
console.log("Done");
