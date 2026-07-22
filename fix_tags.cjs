const fs = require('fs');

let code = fs.readFileSync('src/pages/EditorPage.tsx', 'utf8');

// I will insert `</Panel> ` and `</PanelGroup>` right before `{/* Mobile ATS Info Panel Overlay */}`
const target = "{/* Mobile ATS Info Panel Overlay */}"
code = code.replace(target, `          </div>
        </Panel>
        )}
      </PanelGroup>
      
      {/* Mobile ATS Info Panel Overlay */}`);

fs.writeFileSync('src/pages/EditorPage.tsx', code, 'utf8');
console.log('done');
