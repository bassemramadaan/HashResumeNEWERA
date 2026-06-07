import fs from 'fs';
import path from 'path';

const pages = [
  { route: '', file: 'src/pages/Landing/index.tsx', priority: '1.0', changefreq: 'daily' },
  { route: 'templates', file: 'src/pages/TemplatesPage.tsx', priority: '0.9', changefreq: 'weekly' },
  { route: 'cover-letter', file: 'src/pages/CoverLetterPage.tsx', priority: '0.8', changefreq: 'weekly' },
  { route: 'blog', file: 'src/pages/BlogPage.tsx', priority: '0.8', changefreq: 'daily' },
  { route: 'hash-hunt', file: 'src/pages/HashHuntPage.tsx', priority: '0.4', changefreq: 'weekly' },
  { route: 'privacy', file: 'src/pages/PrivacyPage.tsx', priority: '0.5', changefreq: 'monthly' },
  { route: 'terms', file: 'src/pages/TermsOfServicePage.tsx', priority: '0.5', changefreq: 'monthly' },
  { route: 'trust', file: 'src/pages/TrustPage.tsx', priority: '0.6', changefreq: 'monthly' },
  { route: 'how-ats-works', file: 'src/pages/HowAtsWorksPage.tsx', priority: '0.6', changefreq: 'monthly' },
  { route: 'faq', file: 'src/pages/FAQPage.tsx', priority: '0.7', changefreq: 'monthly' },
  { route: 'interview-prep', file: 'src/pages/InterviewCoachPage.tsx', priority: '0.7', changefreq: 'weekly' }
];

const domain = 'https://hashresume.com';
const now = new Date().toISOString().split('T')[0];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

pages.forEach(({ route, file, priority, changefreq }) => {
  let lastmod = now;
  try {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      // Format as YYYY-MM-DD
      lastmod = stats.mtime.toISOString().split('T')[0];
    }
  } catch (err) {
    console.warn(`[Sitemap] Warning getting modified time for ${file}, falling back to build date:`, err.message);
  }

  // To prevent trailing slashes except for root
  const urlPath = route ? `/${route}` : '';

  xml += '  <url>\n';
  xml += `    <loc>${domain}${urlPath}</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += `    <priority>${priority}</priority>\n`;
  xml += '  </url>\n';
});

xml += '</urlset>\n';

const destination = path.resolve('public/sitemap.xml');
fs.writeFileSync(destination, xml, 'utf8');
console.log(`[Sitemap] Successfully auto-generated ${destination} with fresh dates!`);
