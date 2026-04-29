import * as fs from 'fs';

const FILE_PATH = 'src/pages/LandingPage.tsx';
let content = fs.readFileSync(FILE_PATH, 'utf-8');

const startMarker = '{/* Hash Hunt Integration Section */}';
const endMarker = '{/* Pricing Section */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + content.substring(endIndex);
  fs.writeFileSync(FILE_PATH, content, 'utf-8');
  console.log('Removed Hash Hunt Section successfully!');
} else {
  console.log('Markers not found!');
}
