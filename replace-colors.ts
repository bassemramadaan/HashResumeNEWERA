import fs from 'fs';
import path from 'path';

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/indigo/g, 'blue');
  content = content.replace(/zinc/g, 'slate');
  content = content.replace(/#4F46E5/g, '#2563EB');
  fs.writeFileSync(filePath, content, 'utf-8');
}

function walkDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(process.cwd(), 'src'));
console.log('Colors replaced!');
