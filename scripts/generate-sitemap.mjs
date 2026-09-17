/**
 * Generates public/sitemap.xml from the project data.
 *
 * Hand-maintaining this guarantees it drifts the moment a project is added,
 * so it runs as part of `npm run build`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const profileSrc = readFileSync(resolve(root, 'src/data/profile.ts'), 'utf8');
const siteUrl = profileSrc.match(/export const siteUrl = '([^']+)'/)?.[1];
if (!siteUrl) throw new Error('Could not read siteUrl from src/data/profile.ts');

const projectsSrc = readFileSync(resolve(root, 'src/data/projects.ts'), 'utf8');
const slugs = [...projectsSrc.matchAll(/^\s{8}slug: '([^']+)',$/gm)].map((m) => m[1]);
if (slugs.length === 0) throw new Error('No project slugs found in src/data/projects.ts');

const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (duplicates.length) throw new Error(`Duplicate project slugs: ${duplicates.join(', ')}`);

const today = new Date().toISOString().slice(0, 10);

const url = (loc, priority, changefreq) =>
  `  <url>\n` +
  `    <loc>${loc}</loc>\n` +
  `    <lastmod>${today}</lastmod>\n` +
  `    <changefreq>${changefreq}</changefreq>\n` +
  `    <priority>${priority}</priority>\n` +
  `  </url>`;

const body = [
  url(`${siteUrl}/`, '1.0', 'monthly'),
  ...slugs.map((slug) => url(`${siteUrl}/projects/${slug}`, '0.8', 'yearly')),
].join('\n');

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf8');

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
writeFileSync(resolve(root, 'public/robots.txt'), robots, 'utf8');

console.log(`sitemap.xml: ${slugs.length + 1} URLs`);
