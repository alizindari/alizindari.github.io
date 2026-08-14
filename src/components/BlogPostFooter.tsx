import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { BlogPost } from '../data/blogPosts';

interface BlogPostFooterProps {
  post: BlogPost;
}

const SITE_URL = 'https://alizindari.github.io';

const BlogPostFooter = ({ post }: BlogPostFooterProps) => {
  const [copied, setCopied] = useState(false);

  const citation = useMemo(() => {
    const year = post.date.slice(0, 4);
    const shortTitle = post.slug.split('-')[0];
    const url = `${SITE_URL}/blog/${post.slug}/`;

    return `@misc{zindari${year}${shortTitle},
  author = {Zindari, Ali},
  title  = {{${post.title}}},
  year   = {${year}},
  url    = {${url}},
  note   = {Blog post}
}`;
  }, [post.date, post.slug, post.title]);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyCitation = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
  };

  return (
    <footer className="mt-10 border-t border-border pt-7 text-left">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Cite this post</h2>
        <button
          type="button"
          onClick={copyCitation}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          aria-label="Copy BibTeX citation"
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy BibTeX'}
        </button>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-muted/45 p-4 text-sm leading-relaxed text-foreground">
        <code>{citation}</code>
      </pre>

      <p className="mt-6 flex items-start gap-2 text-base leading-relaxed text-foreground sm:text-lg">
        <Mail size={18} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
        <span>
          If you have any questions or feedback,{' '}
          <a
            href="mailto:zindari.ali@gmail.com"
            className="font-medium text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-primary-light"
          >
            send me an email
          </a>
          .
        </span>
      </p>
    </footer>
  );
};

export default BlogPostFooter;
