import fs from 'fs';
import path from 'path';

// Production guard to prevent accidental run during deployment or production runtime
if (process.env.NODE_ENV === 'production' || process.env.VITE_USER_NODE_ENV === 'production') {
  console.error('🚫 Error: This development replace utility script is disabled in production environments!');
  process.exit(1);
}

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/green/g, 'indigo');
  content = content.replace(/slate/g, 'zinc');
  content = content.replace(/#22C55E/g, '#4F46E5');
  fs.writeFileSync(filePath, content, 'utf-8');
}

const dir1 = path.join(process.cwd(), 'src/components/editor');
const dir2 = path.join(process.cwd(), 'src/components/preview');
const file3 = path.join(process.cwd(), 'src/store/useResumeStore.ts');

fs.readdirSync(dir1).forEach(file => {
  if (file.endsWith('.tsx')) replaceInFile(path.join(dir1, file));
});

fs.readdirSync(dir2).forEach(file => {
  if (file.endsWith('.tsx')) replaceInFile(path.join(dir2, file));
});

replaceInFile(file3);

console.log('Replacements done!');
