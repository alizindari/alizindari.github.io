import { useEffect } from 'react';
import cv from '@/files/homepage/CV.pdf';

const CV = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Curriculum Vitae - Ali Zindari';

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = meta?.content;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = 'View the CV of Ali Zindari (PDF).';

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.origin + '/cv';

    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== undefined) meta.content = prevDesc!;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Curriculum Vitae</h1>
        <p className="text-muted-foreground mt-2 text-sm">PDF viewer with download option</p>
        <div className="mt-4">
          <a
            href={cv}
            download
            className="hover:opacity-80 transition-opacity underline text-primary text-sm"
          >
            Download PDF
          </a>
        </div>
      </header>
      <section className="container mx-auto px-0 sm:px-6 pb-12">
        <div className="w-full border border-border bg-card shadow-sm">
          <iframe src={cv} className="w-full h-[85vh] sm:h-[80vh]" title="CV PDF" />
        </div>
      </section>
    </main>
  );
};

export default CV;
