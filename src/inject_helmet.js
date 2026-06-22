const fs = require('fs');

function injectHelmet(filename, metaTitle, metaDesc, canonical) {
  let content = fs.readFileSync(filename, 'utf8');

  if (!content.includes('import { Helmet }')) {
    content = 'import { Helmet } from "react-helmet-async";\n' + content;
  }

  const helmetHtml = `
      <Helmet>
        <title>${metaTitle}</title>
        <meta name="description" content="${metaDesc}" />
        <link rel="canonical" href="${canonical}" />
      </Helmet>
`;
  
  const returnMatch = content.match(/return\s*\(\s*(<|>|null|return|"|'|{|\[|\w+)/);
  if (returnMatch) {
    const idx = returnMatch.index + returnMatch[0].length - returnMatch[1].length;
    let before = content.slice(0, idx);
    let after = content.slice(idx);
    
    // Instead of messing up exact returns, we can just replace `return (` with `return (\n    <>` + helmetHtml + `\n` and close with `</>` if we added a fragment. 
    // It's safer to just find the first div or whatever inside return( and insert it.
  }
}
