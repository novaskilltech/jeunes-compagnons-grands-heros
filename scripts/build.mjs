import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
mkdirSync(output, { recursive: true });
cpSync(join(root, 'assets'), join(output, 'assets'), { recursive: true });

const host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '';
const url = host ? (host.startsWith('http://') || host.startsWith('https://') ? host : `https://${host}`).replace(/\/+$/, '') + '/' : '';
if (url && !url.startsWith('https://')) throw Error('SITE_URL must be HTTPS.');
const og = url ? new URL('assets/miniature-og.jpg', url).href : '/assets/miniature-og.jpg';
let html = readFileSync(join(root, 'index.html'), 'utf8');
html = html.replaceAll('__PUBLIC_URL__', url || '/').replaceAll('__OG_IMAGE_URL__', og);
if (html.includes('__PUBLIC_URL__') || html.includes('__OG_IMAGE_URL__')) throw Error('Unresolved social metadata placeholders');
writeFileSync(join(output, 'index.html'), html);
console.log(`Built static site in dist; canonical URL ${url || '(relative, local build)'}`);
