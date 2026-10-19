import { useEffect } from 'react';
import cv from '@/files/homepage/CV.pdf';

const CV = () => {
  useEffect(() => {
    // Native PDF navigation avoids Safari's embedded-viewer link handling.
    window.location.replace(cv);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Curriculum Vitae</h1>
        <div className="mt-4">
          <a
            href={cv}
            className="hover:opacity-80 transition-opacity underline text-primary text-sm"
          >
            Open CV (PDF)
          </a>
        </div>
      </div>
    </main>
  );
};

export default CV;
