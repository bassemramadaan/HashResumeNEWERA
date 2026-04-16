import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx') && !filePath.includes('preview')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // We want to replace text-white with text-slate-50 ONLY if the line also contains bg-slate-900
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('bg-slate-900') && lines[i].includes('text-white')) {
        lines[i] = lines[i].replace(/text-white/g, 'text-slate-50');
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log('Updated', filePath);
    }
  }
});
