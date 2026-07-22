const fs = require('fs');

let code = fs.readFileSync('src/pages/EditorPage.tsx', 'utf8');

const start = `      <AnimatePresence>
        {showFullPreview && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-neutral-950/90 backdrop-blur-md">`;
const end = `      </AnimatePresence>

      {/* Mobile ATS Info Panel Overlay */}`;

const startIndex = code.indexOf(start);
const endIndex = code.indexOf(end);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + `</>\n      )}\n\n      {/* Mobile ATS Info Panel Overlay */}` + code.substring(endIndex + end.length);
  fs.writeFileSync('src/pages/EditorPage.tsx', code, 'utf8');
  console.log('done');
} else {
  console.log('not found');
}
