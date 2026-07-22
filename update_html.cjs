const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

indexHtml = indexHtml.replace(/family=Cairo:wght@400;600;700&family=Plus\+Jakarta\+Sans:wght@400;600;700/g, 'family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700');

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('done');
