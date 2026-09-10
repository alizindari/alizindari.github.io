export const BLOG_VISITS_HOST = 'alizindari.github.io';
// Public site address, not a secret API key.
export const BLOG_VISITS_SITE = 'https://alizinless.goatcounter.com';

const CACHE_MS = 60_000;

interface VisitsClientOptions {
  siteUrl: string;
  canRecordVisit: () => boolean;
  getSessionStorage: () => Pick<Storage, 'getItem' | 'setItem'>;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

interface CounterEntry {
  count?: number;
  fetchedAt: number;
  pending?: Promise<number>;
}

export function canRecordBlogVisit(hostname: string, production: boolean, privacyOptOut = false) {
  return production && hostname === BLOG_VISITS_HOST && !privacyOptOut;
}

export function createBlogVisitsClient({
  siteUrl,
  canRecordVisit,
  getSessionStorage,
  fetcher = fetch,
  timeoutMs = 6000,
}: VisitsClientOptions) {
  const origin = /^https:\/\/[a-z0-9]+(?:-[a-z0-9]+)*\.goatcounter\.com\/?$/.test(siteUrl)
    ? new URL(siteUrl).origin
    : null;
  const sessionPrefix = `blog-visit:goatcounter:${origin}:`;
  const entries = new Map<string, CounterEntry>();
  const attemptedVisits = new Set<string>();

  const hasVisited = (slug: string) => {
    if (attemptedVisits.has(slug)) return true;
    try {
      return getSessionStorage().getItem(sessionPrefix + slug) === '1';
    } catch {
      return false;
    }
  };

  const markVisited = (slug: string) => {
    attemptedVisits.add(slug);
    try {
      getSessionStorage().setItem(sessionPrefix + slug, '1');
    } catch {
      // Memory still prevents duplicate counts when browser storage is blocked.
    }
  };

  const request = async (url: string, tracking = false) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher(url, {
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
        // The documented tracking pixel doesn't need a readable response.
        mode: tracking ? 'no-cors' : 'cors',
        keepalive: tracking,
      });
      if (!tracking && !response.ok && response.status !== 404) {
        throw new Error('Visit counter unavailable');
      }
      // Keep the timeout active until the JSON body is received as well.
      const data: unknown = tracking ? null : await response.json();
      return { status: response.status, data };
    } finally {
      clearTimeout(timeout);
    }
  };

  const requestCount = async (slug: string, increment: boolean) => {
    const path = `/blog/${slug}/`;
    if (increment) {
      const params = new URLSearchParams({ p: path, rnd: Math.random().toString(36).slice(2) });
      try {
        await request(`${origin}/count?${params}`, true);
      } catch {
        // A blocked tracking request must not prevent reading the published total.
      }
    }
    const response = await request(`${origin}/counter/${encodeURIComponent(path)}.json`);
    const data = response.data;
    if (
      !data || typeof data !== 'object' || !('count' in data) ||
      typeof data.count !== 'string' || !/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(data.count)
    ) {
      throw new Error('Invalid visit count');
    }
    // GoatCounter's public JSON endpoint returns a comma-formatted string.
    const count = Number(data.count.replace(/,/g, ''));
    // An unvisited path returns HTTP 404 with a valid zero-count JSON response.
    if (!Number.isSafeInteger(count) || (response.status === 404 && count !== 0)) {
      throw new Error('Invalid visit count');
    }
    return count;
  };

  const getCount = async (slug: string, recordVisit = false): Promise<number> => {
    if (!origin) throw new Error('Visit counter is not configured');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid blog slug');
    let entry = entries.get(slug);
    if (!entry) {
      entry = { fetchedAt: 0 };
      entries.set(slug, entry);
    }

    const shouldIncrement = () => recordVisit && canRecordVisit() && !hasVisited(slug);

    // Serialize each post's reads and writes so a late list read cannot undo a visit.
    if (entry.pending) {
      try {
        await entry.pending;
      } catch (error) {
        if (!shouldIncrement()) throw error;
      }
      return getCount(slug, recordVisit);
    }

    const increment = shouldIncrement();
    if (!increment && entry.count !== undefined && Date.now() - entry.fetchedAt < CACHE_MS) {
      return entry.count;
    }

    // A timed-out write might have reached the server. Don't retry it on refresh.
    if (increment) markVisited(slug);
    entry.pending = requestCount(slug, increment)
      .then(count => {
        entry.count = count;
        entry.fetchedAt = Date.now();
        return count;
      })
      .finally(() => {
        entry.pending = undefined;
      });

    return entry.pending;
  };

  return { getCount, configured: origin !== null };
}
