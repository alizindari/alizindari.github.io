import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { BLOG_VISITS_SITE, canRecordBlogVisit, createBlogVisitsClient } from '@/lib/blogVisits';

const visits = createBlogVisitsClient({
  siteUrl: BLOG_VISITS_SITE,
  canRecordVisit: () => canRecordBlogVisit(
    window.location.hostname,
    import.meta.env.PROD,
    navigator.doNotTrack === '1' ||
      (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
  ),
  getSessionStorage: () => window.sessionStorage,
});

const fullNumber = new Intl.NumberFormat('en-US');
const compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

interface BlogVisitCounterProps {
  postSlug: string;
  recordVisit?: boolean;
}

const BlogVisitCounter = ({ postSlug, recordVisit = false }: BlogVisitCounterProps) => {
  const [result, setResult] = useState<{ slug: string; count?: number; failed?: boolean }>();

  useEffect(() => {
    let active = true;
    setResult(undefined);
    visits.getCount(postSlug, recordVisit).then(
      count => { if (active) setResult({ slug: postSlug, count }); },
      () => { if (active) setResult({ slug: postSlug, failed: true }); },
    );
    return () => { active = false; };
  }, [postSlug, recordVisit]);

  const current = result?.slug === postSlug ? result : undefined;
  const count = current?.count;
  const label = !visits.configured ? 'Visit counter awaiting setup' : count === undefined
    ? current?.failed ? 'Visit count temporarily unavailable' : 'Loading visit count'
    : `${fullNumber.format(count)} ${count === 1 ? 'visit' : 'visits'}`;

  if (!visits.configured && import.meta.env.PROD) return null;

  return (
    <span
      role="status"
      aria-live="off"
      aria-label={label}
      title={`${label}. Visits since tracking began, updated periodically. Repeat opens in the same tab count once.`}
      data-post-visits={postSlug}
      className="inline-flex h-8 w-[8.5rem] shrink-0 items-center justify-center gap-2 rounded-md border border-emerald-700/15 bg-emerald-50/80 px-2.5 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
    >
      <Eye size={17} strokeWidth={1.7} className="shrink-0" aria-hidden="true" />
      <span aria-hidden="true" className="flex items-baseline gap-1.5 whitespace-nowrap text-sm">
        <span className={`text-base font-semibold tabular-nums ${visits.configured && !current ? 'motion-safe:animate-pulse' : ''}`}>
          {count === undefined ? <>&ndash;</> : count < 10_000 ? fullNumber.format(count) : compactNumber.format(count)}
        </span>
        <span>{count === 1 ? 'visit' : 'visits'}</span>
      </span>
    </span>
  );
};

export default BlogVisitCounter;
