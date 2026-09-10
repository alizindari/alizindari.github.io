import assert from 'node:assert/strict';
import test from 'node:test';
import { canRecordBlogVisit, createBlogVisitsClient } from '../src/lib/blogVisits.ts';

const slug = 'washing-machine-dilemma';
const siteUrl = 'https://counter-tests.goatcounter.com';
const json = count => new Response(JSON.stringify({ count }));
const isTracking = url => new URL(url).pathname === '/count';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
}

function setup({ fetcher = async () => json('42'), ...options } = {}) {
  const requests = [];
  const storage = memoryStorage();
  const client = createBlogVisitsClient({
    siteUrl,
    canRecordVisit: () => true,
    getSessionStorage: () => storage,
    ...options,
    fetcher: (url, init) => {
      requests.push({ url: new URL(url), init });
      return fetcher(url, init);
    },
  });
  return { client, requests, storage };
}

test('only production records visits, respecting privacy opt-outs', () => {
  assert.equal(canRecordBlogVisit('alizindari.github.io', true), true);
  assert.equal(canRecordBlogVisit('alizindari.github.io', false), false);
  assert.equal(canRecordBlogVisit('localhost', true), false);
  assert.equal(canRecordBlogVisit('127.0.0.1', true), false);
  assert.equal(canRecordBlogVisit('preview.example.com', true), false);
  assert.equal(canRecordBlogVisit('alizindari.github.io', true, true), false);
});

test('listing counters only read public totals, omitting cookies and referrers', async () => {
  const { client, requests } = setup();
  assert.equal(await client.getCount(slug), 42);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url.origin, siteUrl);
  assert.equal(requests[0].url.pathname, `/counter/${encodeURIComponent(`/blog/${slug}/`)}.json`);
  assert.equal(requests[0].init.credentials, 'omit');
  assert.equal(requests[0].init.referrerPolicy, 'no-referrer');
  assert.equal(requests[0].init.cache, 'no-store');
});

test('concurrent listing reads share one request and cache its result', async () => {
  const { client, requests } = setup();
  assert.deepEqual(await Promise.all([client.getCount(slug), client.getCount(slug)]), [42, 42]);
  assert.equal(await client.getCount(slug), 42);
  assert.equal(requests.length, 1);
});

test('a cached list read does not suppress the first article visit', async () => {
  const { client, requests } = setup();
  await client.getCount(slug);
  assert.equal(await client.getCount(slug, true), 42);
  assert.equal(requests.length, 3);
  const tracked = requests[1];
  assert.equal(tracked.url.pathname, '/count');
  assert.equal(tracked.url.searchParams.get('p'), `/blog/${slug}/`);
  assert.deepEqual([...tracked.url.searchParams.keys()].sort(), ['p', 'rnd']);
  assert.equal(tracked.init.mode, 'no-cors');
  assert.equal(tracked.init.keepalive, true);
  assert.equal(tracked.init.credentials, 'omit');
  assert.equal(tracked.init.referrerPolicy, 'no-referrer');
});

test('concurrent article mounts send just one tracking request', async () => {
  const { client, requests } = setup();
  await Promise.all([client.getCount(slug, true), client.getCount(slug, true)]);
  await client.getCount(slug, true);
  assert.equal(requests.length, 2);
  assert.equal(requests.filter(request => isTracking(request.url)).length, 1);
});

test('refreshes read without tracking an already visited post', async () => {
  const { client, storage } = setup();
  await client.getCount(slug, true);
  const refreshed = setup({ getSessionStorage: () => storage });
  await refreshed.client.getCount(slug, true);
  assert.equal(refreshed.requests.length, 1);
  assert.equal(isTracking(refreshed.requests[0].url), false);
});

test('each post has an independent count and session flag', async () => {
  const { client, requests } = setup();
  await client.getCount(slug, true);
  await client.getCount('convergence-of-gradient-descent-for-smooth-functions', true);
  const tracking = requests.filter(request => isTracking(request.url));
  assert.equal(tracking.length, 2);
  assert.notEqual(tracking[0].url.searchParams.get('p'), tracking[1].url.searchParams.get('p'));
});

test('an in-flight list read is followed by exactly one article tracking request', async () => {
  let resolveRead;
  let firstRead = true;
  const { client, requests } = setup({
    fetcher: () => {
      if (firstRead) {
        firstRead = false;
        return new Promise(resolve => { resolveRead = resolve; });
      }
      return Promise.resolve(json('43'));
    },
  });
  const listing = client.getCount(slug);
  const article = client.getCount(slug, true);
  const duplicate = client.getCount(slug, true);
  assert.equal(requests.length, 1);
  resolveRead(json('42'));
  assert.deepEqual(await Promise.all([listing, article, duplicate]), [42, 43, 43]);
  assert.equal(await client.getCount(slug), 43);
  assert.equal(requests.length, 3);
});

test('development and opted-out visits only read without setting session flags', async () => {
  const { client, requests, storage } = setup({ canRecordVisit: () => false });
  await client.getCount(slug, true);
  assert.equal(requests.length, 1);
  assert.equal(isTracking(requests[0].url), false);
  assert.equal(storage.getItem(`blog-visit:goatcounter:${siteUrl}:${slug}`), null);
});

test('blocked storage still deduplicates within the current page', async () => {
  const { client, requests } = setup({ getSessionStorage: () => { throw new Error('Blocked'); } });
  await client.getCount(slug, true);
  await client.getCount(slug, true);
  assert.equal(requests.length, 2);
});

test('formatted counts and confirmed zero are valid, malformed data is rejected', async () => {
  assert.equal(await setup({ fetcher: async () => json('0') }).client.getCount(slug), 0);
  assert.equal(await setup({ fetcher: async () => json('12,345') }).client.getCount(slug), 12345);
  for (const value of ['-1', 42, '', null, '2.5', '12,34', '4 people', '9007199254740992']) {
    await assert.rejects(setup({ fetcher: async () => json(value) }).client.getCount(slug), /Invalid visit count/);
  }
  await assert.rejects(setup({ fetcher: async () => new Response('<html>Error</html>') }).client.getCount(slug));
});

test('disabled counters and server errors are never invented zeroes', async () => {
  for (const status of [403, 503]) {
    const { client } = setup({ fetcher: async () => new Response('', { status }) });
    await assert.rejects(client.getCount(slug), /unavailable/);
  }
});

test('new posts accept GoatCounter\'s 404 zero JSON, not arbitrary missing pages', async () => {
  const { client } = setup({ fetcher: async () => new Response('{"count":"0"}', { status: 404 }) });
  assert.equal(await client.getCount(slug), 0);
  for (const body of ['<html>Not found</html>', '{"count":"12"}', '{"error":"missing site"}']) {
    const missing = setup({ fetcher: async () => new Response(body, { status: 404 }) });
    await assert.rejects(missing.client.getCount(slug));
  }
});

test('failed reads are not cached', async () => {
  let failed = true;
  const { client, requests } = setup({ fetcher: async () => failed ? new Response('', { status: 503 }) : json('8') });
  await assert.rejects(client.getCount(slug));
  failed = false;
  assert.equal(await client.getCount(slug), 8);
  assert.equal(requests.length, 2);
});

test('failed tracking still reads the total and is not automatically retried', async () => {
  const { client, requests } = setup({
    fetcher: async url => {
      if (isTracking(url)) throw new Error('Response lost');
      return json('43');
    },
  });
  assert.equal(await client.getCount(slug, true), 43);
  assert.equal(await client.getCount(slug, true), 43);
  assert.equal(requests.filter(request => isTracking(request.url)).length, 1);
});

test('public totals are not artificially incremented while the service cache catches up', async () => {
  const { client } = setup({ fetcher: async () => json('12') });
  assert.equal(await client.getCount(slug, true), 12);
});

test('stale cached values are refreshed', async context => {
  let now = 100_000;
  context.mock.method(Date, 'now', () => now);
  const { client, requests } = setup();
  await client.getCount(slug);
  now += 60_001;
  await client.getCount(slug);
  assert.equal(requests.length, 2);
});

test('slow requests are aborted and rejected', async () => {
  const { client, requests } = setup({
    timeoutMs: 5,
    fetcher: (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true });
    }),
  });
  await assert.rejects(client.getCount(slug), /Aborted/);
  assert.equal(requests[0].init.signal.aborted, true);
});

test('invalid slugs and unconfigured or invalid sites never make requests', async () => {
  const { client, requests } = setup();
  for (const invalid of ['', '../home', 'blog/post', '?readOnly=false']) {
    await assert.rejects(client.getCount(invalid, true), /Invalid blog slug/);
  }
  assert.equal(requests.length, 0);
  for (const invalid of ['', 'http://test.goatcounter.com', 'https://goatcounter.com.evil.example', 'https://test.goatcounter.com/count']) {
    const missing = setup({ siteUrl: invalid });
    assert.equal(missing.client.configured, false);
    await assert.rejects(missing.client.getCount(slug, true), /not configured/);
    assert.equal(missing.requests.length, 0);
  }
});
