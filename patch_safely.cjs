const fs = require('fs');

function patchTemplate(code, templateName) {
  // Find start and end of template
  const funcStart = code.indexOf(\`const render\${templateName} = () => (\`);
  if (funcStart === -1) return code;
  
  let nextFunc = code.indexOf('const render', funcStart + 10);
  if (nextFunc === -1) nextFunc = code.length;
  
  let templateCode = code.substring(funcStart, nextFunc);
  
  // Find {experience.length > 0 && (...)}
  // and {education.length > 0 && (...)}
  // but only if they are adjacent or separated by whitespace
  // Wait, I will use a very careful regex ONLY in this template block
  
  const regex = /\{experience\.length > 0 && \(\s*(<section[\s\S]*?<\/section>)\s*\)\}\s*\{education\.length > 0 && \(\s*(<section[\s\S]*?<\/section>)\s*\)\}/g;
  
  templateCode = templateCode.replace(regex, (match, expSection, eduSection) => {
      console.log(\`Patched \${templateName}\`);
      return \`{(settings.isFreshGrad ? ["education", "experience"] : ["experience", "education"]).map((sectionId) => {\n            if (sectionId === "experience" && experience.length > 0) {\n              return (\n\${expSection}\n              );\n            }\n            if (sectionId === "education" && education.length > 0) {\n              return (\n\${eduSection}\n              );\n            }\n            return null;\n          })}\`;
  });
  
  return code.substring(0, funcStart) + templateCode + code.substring(nextFunc);
}

let code = fs.readFileSync('src/components/preview/ResumePreview.tsx', 'utf8');

['Medical', 'Legal', 'Elegant', 'Engineering', 'Finance'].forEach(name => {
    code = patchTemplate(code, name);
});

fs.writeFileSync('src/components/preview/ResumePreview.tsx', code);
console.log("Patching complete");
