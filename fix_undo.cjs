const fs = require('fs');
let code = fs.readFileSync('src/components/preview/ResumePreview.tsx', 'utf8');

const regex = /\{\(settings\.isFreshGrad \? \["education", "experience"\] : \["experience", "education"\]\)\.map\(\(sectionId\) => \{\s*if \(sectionId === "experience" && experience\.length > 0\) \{\s*return \(\s*([\s\S]*?)\s*\);\s*\}\s*if \(sectionId === "education" && education\.length > 0\) \{\s*return \(\s*([\s\S]*?)\s*\);\s*\}\s*return null;\s*\}\)\}/g;

code = code.replace(regex, (match, expSection, eduSection) => {
    return `{experience.length > 0 && (\n${expSection}\n)}\n{education.length > 0 && (\n${eduSection}\n)}`;
});

fs.writeFileSync('src/components/preview/ResumePreview.tsx', code);
console.log("Restored");
