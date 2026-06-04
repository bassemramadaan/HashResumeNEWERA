const fs = require('fs');
['src/pages/Landing/FeaturesSection.tsx', 'src/pages/Landing/HeroSection.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/ease: "easeOut"/g, 'ease: "easeOut" as any');
  content = content.replace(/ease: "easeInOut"/g, 'ease: "easeInOut" as any');
  fs.writeFileSync(file, content);
});
