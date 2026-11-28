
import master_thesis_image from '@/assets/presentations/Master_Thesis.svg';
import deep_linear_models from '@/assets/presentations/deep_linear_models.svg';
import imprecise_ml from '@/assets/presentations/imprecise_ml.svg';
import games_for_ml from '@/assets/presentations/games.svg';
import qualifying_exam_image from '@/assets/presentations/qualifying_exam.svg';

// Import PDF files for links
import master_thesis_pdf from '@/files/presentations/Master_Thesis_Presentation.pdf';
import deep_linear_models_pdf from '@/files/presentations/deep_linear_models.pdf';
import imprecise_ml_pdf from '@/files/presentations/imprecise_ml_seminar.pdf';
import games_pdf from '@/files/presentations/gml_presentation.pdf';
import qualifying_exam_pdf from '@/files/presentations/Ali_Zindari_QE_Slides_Handout.pdf';

import { FileDown } from 'lucide-react';
import { getDocumentViewerUrl } from '@/lib/documentViewer';
import AcademicTemplateLink from './AcademicTemplateLink';
import YearArchive from './YearArchive';

const PresentationsPage = () => {
  const presentations = [
    {
      id: 5,
      title: "Learning When to Adapt",
      venue: "PhD Qualifying Exam",
      year: 2026,
      image: qualifying_exam_image,
      description: "My PhD qualifying exam presentation on fine-tuning with less forgetting, focusing on DISeL, LoRA, and the theory of adaptation and retention.",
      pdfUrl: qualifying_exam_pdf
    },
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
    <main className="presentations-page times-page min-h-screen">
      <div className="site-container site-page-content">
        <header className="page-heading mb-8 text-center sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">Presentations</h1>
          <AcademicTemplateLink />
        </header>

        <YearArchive entries={presentations}>
          {(presentation) => (
            <article key={presentation.id} className="archive-entry">
              <header className="archive-entry-heading">
                <h3>{presentation.title}</h3>
                <p className="text-base font-medium text-primary">{presentation.venue}</p>
              </header>
              <div className="archive-entry-body">
                <p className="text-base leading-relaxed text-foreground mb-4">
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
              <img className="archive-figure" src={presentation.image} alt={`${presentation.title} preview`} loading="lazy" />
            </article>
          )}
        </YearArchive>
      </div>
    </main>
  );
};

export default PresentationsPage;
