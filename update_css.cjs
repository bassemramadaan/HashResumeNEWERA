const fs = require('fs');
const content = fs.readFileSync('src/index.css', 'utf8');
const lines = content.split('\n');

const newCss = `/* ============================================================
   BULLETPROOF PRINT STYLES
   ============================================================ */

@page {
  size: A4;
  margin: 0;
}

@media print {
  html,
  body {
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    background-image: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    overflow: visible !important;
  }

  body {
    visibility: hidden !important;
  }

  body.printing-resume-active {
    visibility: visible !important;
  }

  body.printing-resume-active #root {
    display: block !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  body.printing-resume-active #resume-print-container,
  body.printing-resume-active #resume-print-container * {
    visibility: visible !important;
    opacity: 1 !important;
  }

  body.printing-resume-active #resume-print-container {
    display: block !important;
    position: fixed !important;
    inset: 0 !important;
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    background: #ffffff !important;
    overflow: visible !important;
    z-index: 999999 !important;
  }

  body.printing-resume-active #resume-print-capture-area {
    display: block !important;
    position: relative !important;
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    background: #ffffff !important;
    color: #000000 !important;
    box-shadow: none !important;
    border: none !important;
    overflow: visible !important;
    transform: none !important;
    scale: 1 !important;
    filter: none !important;
  }

  body.printing-resume-active #resume-print-capture-area .cv-preview,
  body.printing-resume-active #resume-print-capture-area #resume-capture-area,
  body.printing-resume-active #resume-print-capture-area #resume-capture-area * {
    visibility: visible !important;
    color: inherit !important;
    background-image: none !important;
  }

  body.printing-resume-active #resume-print-capture-area a {
    color: inherit !important;
    text-decoration: none !important;
  }

  body.printing-resume-active #resume-print-capture-area .shadow-sm,
  body.printing-resume-active #resume-print-capture-area .shadow,
  body.printing-resume-active #resume-print-capture-area .shadow-md,
  body.printing-resume-active #resume-print-capture-area .shadow-lg {
    box-shadow: none !important;
  }
}
`;

lines.splice(519, 65, newCss);

fs.writeFileSync('src/index.css', lines.join('\n'), 'utf8');
console.log('updated css');
