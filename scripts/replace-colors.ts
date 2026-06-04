import fs from 'fs';
import path from 'path';

// Production guard to prevent accidental run during deployment or production runtime
if (process.env.NODE_ENV === 'production' || process.env.VITE_USER_NODE_ENV === 'production') {
  console.error('🚫 Error: This development replace-colors utility script is disabled in production environments!');
  process.exit(1);
}

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
