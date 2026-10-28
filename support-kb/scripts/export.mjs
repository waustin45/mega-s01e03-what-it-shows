import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

// npm runs this after the real SvelteKit build. No second page renderer or server.
const root = fileURLToPath(new URL('../', import.meta.url));
const build = resolve(root, 'build');
const rendered = resolve(root, 'rendered');
const standalone = resolve(root, 'src/routes/kb/incidents/4471-split/page.html');
const builtPage = resolve(build, 'kb/incidents/4471-split.html');
let html = await readFile(builtPage, 'utf8');

// Preserve the built markup and CSS, removing hydration from the disk-readable snapshot.
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
html = html.replace(/<link\b[^>]*>/gi, (tag) => /rel="modulepreload"/.test(tag) ? '' : tag);
for (const match of [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/gi)]) {
  const cssPath = match[1].startsWith('/') ? resolve(build, match[1].slice(1)) : resolve(dirname(builtPage), match[1]);
  const css = await readFile(cssPath, 'utf8');
  html = html.replace(match[0], `<style>${css}</style>`);
}
// Full-site links use /kb when served. The standalone copy links to the committed HTML files.
html = html.replace(/href="(\/kb[^"?#]*)([?#][^"]*)?"/g, (_, route, suffix = '') => {
  const target = resolve(rendered, `${route.slice(1)}.html`);
  return `href="${relative(dirname(standalone), target).split(sep).join('/')}${suffix}"`;
});
html = html.replace(/[ \t]+$/gm, '');

// Launch first so a missing browser fails without half an export.
const browser = await chromium.launch();
try {
  await rm(rendered, { recursive: true, force: true });
  await cp(build, rendered, { recursive: true });
  await mkdir(dirname(standalone), { recursive: true });
  await writeFile(standalone, html);
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, colorScheme: 'light' });
  await page.goto(pathToFileURL(standalone).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(dirname(standalone), 'page.png'), fullPage: true });
  console.log('Refreshed rendered/, standalone page.html and page.png from build/.');
} finally {
  await browser.close();
}
