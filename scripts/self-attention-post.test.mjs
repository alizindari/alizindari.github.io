import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, access } from 'node:fs/promises';
import katex from 'katex';
import { post5 } from '../src/data/blogPosts/post5.ts';

test('every figure marker resolves to an accessible local vector image', async () => {
  const markers = [...post5.content.matchAll(/\[\[figure:([a-z-]+)\]\]/g)].map(match => match[1]);
  assert.equal(markers.length, 7);
  assert.deepEqual([...markers].sort(), Object.keys(post5.figures).sort());
  for (const key of markers) {
    const figure = post5.figures[key];
    assert(figure.alt.length > 30);
    assert(figure.caption === '' || figure.caption.length > 10);
    assert(figure.width > 0 && figure.height > 0);
    const svg = await readFile(new URL(`../public${figure.src}`, import.meta.url), 'utf8');
    assert(svg.includes('<svg') && svg.includes('<path') && svg.includes('<use'));
    assert(!/<image[\s>]|<foreignObject[\s>]|<pageSet[\s>]/.test(svg));
  }
});

test('the illustrated cover is a high-resolution panoramic PNG', async () => {
  const cover = await readFile(new URL(`../public${post5.image}`, import.meta.url));
  assert.equal(cover.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(cover.toString('ascii', 12, 16), 'IHDR');
  const width = cover.readUInt32BE(16);
  const height = cover.readUInt32BE(20);
  assert(width >= 2000 && height >= 650);
  assert(Math.abs(width / height - 3) < 0.01);
});

test('all inline and display equations compile with KaTeX', () => {
  const equations = [...post5.content.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)];
  assert(equations.length > 50);
  for (const match of equations) {
    assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], { displayMode: match[1] !== undefined, throwOnError: true, strict: 'error' }));
  }
});

test('original text fonts and their redistribution license are retained', async () => {
  for (const file of ['regular.otf', 'bold.otf', 'italic.otf', 'bolditalic.otf']) {
    await access(new URL(`../public/blog/self-attention/fonts/texgyretermes-${file}`, import.meta.url));
  }
  await access(new URL('../public/blog/self-attention/fonts/GUST-FONT-LICENSE.txt', import.meta.url));
  const source = await readFile(new URL('../src/data/blogPosts/self-attention/figures.html', import.meta.url), 'utf8');
  assert.equal((source.match(/<section /g) ?? []).length, 11);
  assert(!/(?:src|href)="(?:\.\.\/)*slides\//.test(source));
});

test('the new post is registered in static routes and the sitemap', async () => {
  assert.equal(post5.theme, 'attention-slides');
  assert.equal(post5.difficulty, 1);
  assert.deepEqual(post5.references.map(reference => reference.url), [
    'https://arxiv.org/abs/1706.03762',
    'https://modernaicourse.org/',
  ]);
  for (const file of ['scripts/generate-static-routes.mjs', 'public/sitemap.xml', 'src/pages/PersonalWebsite.tsx']) {
    assert((await readFile(new URL(`../${file}`, import.meta.url), 'utf8')).includes(post5.slug));
  }
});
