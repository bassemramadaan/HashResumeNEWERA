const { execSync } = require('child_process');
execSync('git checkout -- src/components/preview/ResumePreview.tsx');
console.log('reverted');
