const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const legalSourceDir = path.join(repoRoot, 'docs', 'legal');
const publicDir = path.resolve(__dirname, '../public');

const pages = [
  {
    source: 'keplerx-privacy.md',
    output: 'privacy',
    description: 'Read the KeplerX Privacy Policy to learn how we handle personal information on our website and in our service engagements.',
  },
  {
    source: 'keplerx-terms.md',
    output: 'terms',
    description: 'Read the KeplerX Terms of Use governing your use of our website and our service engagements.',
  },
];

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return html;
}

function markdownToHtml(markdown) {
  const lines = markdown.trim().split(/\r?\n/);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(`<blockquote>${quoteLines.map(inlineMarkdown).join('<br>')}</blockquote>`);
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^-\s+/, ''));
        index += 1;
      }
      blocks.push(`<ul>${items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
      continue;
    }

    const paragraphLines = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^>\s?/.test(lines[index]) &&
      !/^-\s+/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push(`<p>${paragraphLines.map(inlineMarkdown).join('<br>')}</p>`);
  }

  return blocks.join('\n');
}

function footerHtml() {
  return `
    <footer class="legal-footer">
      <p>© 2026 KeplerX. All rights reserved.</p>
      <p>B-122, AEECHS, Gulistan-e-Johar Block 8, Karachi East, Karachi, Pakistan</p>
      <p><a href="mailto:info@keplerx.co">info@keplerx.co</a> <span aria-hidden="true">|</span> <a href="tel:+923347360763">+92 334 7360763</a></p>
      <p><a href="/privacy/">Privacy Policy</a> <span aria-hidden="true">|</span> <a href="/terms/">Terms of Use</a></p>
    </footer>`;
}

function pageHtml(title, description, body) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#021012">
    <link rel="icon" type="image/webp" href="/keplerx-favicon.webp">
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      html { background: #021012; }
      body { margin: 0; min-height: 100vh; background: #021012; color: #edf7f7; font-family: Arial, Helvetica, sans-serif; line-height: 1.7; }
      a { color: #6ec1e4; }
      a:hover { color: #61ce70; }
      .legal-shell { width: min(100% - 40px, 820px); margin: 0 auto; padding: 48px 0 32px; }
      .legal-header { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-bottom: 40px; border-bottom: 1px solid rgba(110, 193, 228, .18); }
      .legal-logo { display: inline-flex; align-items: center; }
      .legal-logo img { display: block; width: auto; height: 40px; }
      .back-link { font-size: .92rem; text-decoration: none; }
      main { padding: 48px 0 24px; }
      h1, h2, h3, h4, h5, h6 { color: #fff; line-height: 1.25; margin: 1.8em 0 .7em; }
      h1 { margin-top: 0; font-size: clamp(2rem, 5vw, 3rem); }
      h2 { font-size: 1.55rem; }
      p, ul, blockquote { margin: 0 0 1.2rem; }
      ul { padding-left: 1.4rem; }
      li { margin: .45rem 0; }
      blockquote { margin-left: 0; padding: 16px 20px; border-left: 3px solid #6ec1e4; background: rgba(4, 28, 32, .75); color: #d7e8e8; }
      .legal-footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(110, 193, 228, .18); color: #9bb1b2; font-size: .9rem; }
      .legal-footer p { margin: .35rem 0; }
      .legal-footer a { text-decoration: none; }
      @media (max-width: 560px) { .legal-shell { width: min(100% - 28px, 820px); padding-top: 28px; } .legal-header { align-items: flex-start; flex-direction: column; padding-bottom: 28px; } main { padding-top: 32px; } }
    </style>
  </head>
  <body>
    <div class="legal-shell">
      <header class="legal-header">
        <a class="legal-logo" href="/" aria-label="KeplerX home"><img src="/keplerx-logo-white.webp" alt="KeplerX"></a>
        <a class="back-link" href="/">Back to KeplerX</a>
      </header>
      <main>${body}</main>
      ${footerHtml()}
    </div>
  </body>
</html>
`;
}

for (const page of pages) {
  const sourcePath = path.join(legalSourceDir, page.source);
  const outputDir = path.join(publicDir, page.output);
  const markdown = fs.readFileSync(sourcePath, 'utf8');
  const title = markdown.match(/^#\s+(.+)$/m)[1];
  const html = pageHtml(title, page.description, markdownToHtml(markdown));

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

console.log('Generated public/privacy/index.html and public/terms/index.html');
