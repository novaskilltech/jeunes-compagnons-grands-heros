import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
mkdirSync(output, { recursive: true });
cpSync(join(root, 'assets'), join(output, 'assets'), { recursive: true });
for (const image of ['couverture', 'miniature-og']) {
  const jpeg = join(output, 'assets', `${image}.jpg`);
  if (!existsSync(jpeg)) {
    await sharp(join(root, 'assets', `${image}.svg`)).jpeg({ quality: 88, mozjpeg: true }).toFile(jpeg);
  }
}
if (!existsSync(join(output, 'assets', 'livre.pdf'))) {
  await import('./generer-pdf.mjs');
}
const host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '';
const url = host ? (host.startsWith('http://') || host.startsWith('https://') ? host : `https://${host}`).replace(/\/+$/, '') + '/' : '';
if (url && !url.startsWith('https://')) throw Error('SITE_URL must be HTTPS.');
const og = url ? new URL('assets/miniature-og.jpg', url).href : '/assets/miniature-og.jpg';
let html = readFileSync(join(root, 'index.html'), 'utf8');
html = html.replaceAll('__PUBLIC_URL__', url || '/').replaceAll('__OG_IMAGE_URL__', og);
if (html.includes('__PUBLIC_URL__') || html.includes('__OG_IMAGE_URL__')) throw Error('Unresolved social metadata placeholders');
writeFileSync(join(output, 'index.html'), html);
console.log(`Built static site in dist; canonical URL ${url || '(relative, local build)'}`);
