# Blog Visit Counters

Each post has one shared counter, shown only inside the article. The Times-font
badge is `src/components/BlogVisitCounter.tsx`; networking and deduplication are in
`src/lib/blogVisits.ts`. New posts are supported automatically through their slugs.

## Configuration

GitHub Pages cannot store shared visit counts. This integration uses the owner's
GoatCounter site: `https://alizinless.goatcounter.com` (`BLOG_VISITS_SITE` in
`src/lib/blogVisits.ts`). No password, private API key, or extra script is needed.

In GoatCounter settings, **Allow adding visitor counts on your website** must be
enabled. The dashboard itself can remain private. If moving to another account,
change `BLOG_VISITS_SITE`, rebuild, and deploy.

## How It Works

Opening an article sends its canonical path, `/blog/POST-SLUG/`, to the documented
[/count tracking endpoint](https://www.goatcounter.com/help/pixel). The article
badge reads the [public visitor count](https://www.goatcounter.com/help/visitor-counter)
from `/counter/ENCODED-PATH.json`. Published slugs should remain stable.

GoatCounter caches public counters for up to four hours. Counts aren't real-time,
and we never fake an immediate increase. For unvisited posts the service returns
HTTP 404 with a zero-count JSON body; only that confirmed zero is displayed as zero.
Past visits before setup cannot be recovered.

## Counting And Privacy

- Only production builds on `alizindari.github.io` record visits. Local development,
  production previews on localhost, and other hostnames only read public totals.
- Repeat opens/refreshes in the same browser tab session are sent once per post.
  A per-post sessionStorage flag handles refreshes; memory handles blocked storage
  within the current page. No persistent visitor ID is created by this code.
- Do Not Track and Global Privacy Control prevent tracking requests. Public count
  reads still contact GoatCounter. Requests omit cookies and referrers. Tracking
  sends only a public post path and an ephemeral cache-busting number, not a
  visitor identifier, search parameters, screen size, or browsing history.
- The service still receives IP addresses and normal browser headers and applies
  its own [session counting](https://www.goatcounter.com/help/sessions) and
  [privacy policy](https://www.goatcounter.com/privacy).
- These are approximate **visits**, not verified unique people or complete reads.
  Ad blockers, privacy settings, service filtering, and outages can undercount.

## Failure Handling

Reads are cached locally for one minute. Each request times out after six seconds.
A missing site, unavailable service, or disabled public counter shows a dash, not
a made-up zero. Writes aren't automatically retried: a lost response might still
have reached the server. A failed tracking request doesn't block reading a total.

Run `npm run test:blog-visits` with Node 22.6+ for isolated tests. Automated browser
tests must mock GoatCounter; don't inflate the real posts with test visits.
