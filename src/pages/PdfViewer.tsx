import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const PdfViewer = () => {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const rawSrc = params.get('src');
  const titleParam = params.get('title') || 'Document';

  const src = rawSrc ? decodeURIComponent(rawSrc) : null;

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${titleParam} - PDF`;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = meta?.content;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = `View ${titleParam} (PDF).`;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;

    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== undefined) meta.content = prevDesc!;
    };
  }, [titleParam]);

  if (!src) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No document specified.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">{titleParam}</h1>
        <p className="text-muted-foreground mt-2 text-sm">PDF viewer with download option</p>
        <div className="mt-4">
          <a
            href={src}
            download
            className="hover:opacity-80 transition-opacity underline text-primary text-sm"
          >
            Download PDF
          </a>
        </div>
      </header>
      <section className="container mx-auto px-0 sm:px-6 pb-12">
        <div className="w-full border border-border bg-card shadow-sm">
          <iframe src={src} className="w-full h-[85vh] sm:h-[80vh]" title={`${titleParam} PDF`} />
        </div>
      </section>
    </main>
  );
};

export default PdfViewer;
