import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const siteUrl = 'https://alizindari.github.io';

const routes = [
  {
    path: 'blog',
    title: 'Blog | Ali Zindari',
    description: 'Notes and explorations by Ali Zindari on machine learning, mathematics, optimization, and related questions.',
    type: 'website',
  },
  {
    path: 'blog/washing-machine-dilemma',
    title: 'The Washing Machine Dilemma | Ali Zindari',
    description: 'A playful optimization model for balancing wardrobe size, laundry costs, capacity, drying time, and uncertainty.',
    type: 'article',
  },
  {
    path: 'blog/convergence-of-gradient-descent-for-smooth-functions',
    title: 'Convergence of Gradient Descent for Smooth Functions | Ali Zindari',
    description: 'A concise derivation of the standard convergence guarantee for gradient descent on smooth nonconvex functions.',
    type: 'article',
  },
  {
    path: 'publications',
    title: 'Publications | Ali Zindari',
    description: 'Research publications by Ali Zindari on optimization, distributed learning, fine-tuning, and machine learning theory.',
    type: 'website',
  },
  {
    path: 'presentations',
    title: 'Presentations | Ali Zindari',
    description: 'Thesis and seminar presentations by Ali Zindari on machine learning and optimization.',
    type: 'website',
  },
];

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const replaceMeta = (html, route) => {
  const canonical = `${siteUrl}/${route.path}/`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);

  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${route.type}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`);
};

await Promise.all(routes.map(async (route) => {
  const routeDir = path.join(distDir, route.path);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), replaceMeta(template, route), 'utf8');
}));

console.log(`Generated ${routes.length} static route entry points.`);
