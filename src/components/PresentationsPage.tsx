
import master_thesis_image from '@/assets/presentations/Master_Thesis.svg';
import deep_linear_models from '@/assets/presentations/deep_linear_models.svg';
import imprecise_ml from '@/assets/presentations/imprecise_ml.svg';
import games_for_ml from '@/assets/presentations/games.svg';

// Import PDF files for links
import master_thesis_pdf from '@/files/presentations/Master_Thesis_Presentation.pdf';
import deep_linear_models_pdf from '@/files/presentations/deep_linear_models.pdf';
import imprecise_ml_pdf from '@/files/presentations/imprecise_ml_seminar.pdf';
import games_pdf from '@/files/presentations/gml_presentation.pdf';

import { FileDown } from 'lucide-react';
import { getDocumentViewerUrl } from '@/lib/documentViewer';
import AcademicTemplateLink from './AcademicTemplateLink';

const PresentationsPage = () => {
  const presentations = [
    {
      id: 4,
      title: "Fine-Grained Analysis of Local SGD",
      venue: "Saarland University",
      year: 2025,
      image: master_thesis_image,
      description: "My master's thesis presentation on refined convergence rates for Local SGD.",
      pdfUrl: master_thesis_pdf
    },
    {
      id: 3,
      title: "Deep Linear Models",
      venue: "Saarland University",
      year: 2025,
      image: deep_linear_models,
      description: "A master's seminar presentation on deep linear networks.",
      pdfUrl: deep_linear_models_pdf
    },
    {
      id: 2,
      title: "Imprecise Linear Regression",
      venue: "Saarland University",
      year: 2025,
      image: imprecise_ml,
      description: "A master's seminar presentation on imprecise linear regression.",
      pdfUrl: imprecise_ml_pdf
    },
    {
      id: 1,
      title: "Convergence of First-Order Methods for Saddle Point Problems",
      venue: "Saarland University",
      year: 2024,
      image: games_for_ml,
      description: "A presentation on the convergence of EG, GDA, and PPM for quadratic saddle-point problems.",
      pdfUrl: games_pdf
    }
  ];

  return (
    <main className="times-page min-h-screen py-8 sm:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8 text-center sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">Presentations</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Thesis and seminar presentations on machine learning and optimization
          </p>
          <AcademicTemplateLink className="mt-4" />
        </header>

        <div className="space-y-6 sm:space-y-8">
          {presentations.map((presentation) => (
            <article 
              key={presentation.id}
              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 sm:h-64 md:h-52 overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={presentation.image}
                    alt={`${presentation.title} preview`}
                    loading="lazy"
                    className="h-full w-full bg-white object-contain"
                  />
                </div>
                <div className="md:w-2/3 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
                    {presentation.title}
                  </h2>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                    <span className="text-xs sm:text-sm font-medium text-primary">
                      {presentation.venue}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      • {presentation.year}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    {presentation.description}
                  </p>
                  <a
                    href={getDocumentViewerUrl(presentation.pdfUrl, presentation.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <FileDown size={17} strokeWidth={1.9} aria-hidden="true" />
                    PDF
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PresentationsPage;
