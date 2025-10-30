
import master_thesis_image from '@/assets/presentations/Master_Thesis.pdf';
import deep_linear_models from '@/assets/presentations/deep_linear_models.pdf';
import imprecise_ml from '@/assets/presentations/imprecise_ml.pdf';
import games_for_ml from '@/assets/presentations/games.pdf';
import { ExternalLink } from 'lucide-react';

const PresentationsPage = () => {
  const presentations = [
    {
      id: 4,
      title: "Fine-Grained Analysis of Local SGD",
      venue: "Saarland University",
      year: 2025,
      image: master_thesis_image,
      description: "My master thesis presentation on new rates for Local SGD.",
      pdfUrl: "/src/files/presentations/Master_Thesis_Presentation.pdf"
    },
    {
      id: 3,
      title: "Deep Linear Models",
      venue: "Saarland University",
      year: 2025,
      image: deep_linear_models,
      description: "Presentation for a master seminar at Saarland University on deep linear networks.",
      pdfUrl: "/src/files/presentations/deep_linear_models.pdf"
    },
    {
      id: 2,
      title: "Imprecise Linear Regression",
      venue: "Saarland University",
      year: 2025,
      image: imprecise_ml,
      description: "Presentation about imprecise ML for a master seminar.",
      pdfUrl: "/src/files/presentations/imprecise_ml_seminar.pdf"
    },
    {
      id: 1,
      title: "Convergence of First-Order Methods for Saddle Point Problems",
      venue: "Saarland University",
      year: 2025,
      image: games_for_ml,
      description: "Presentation about convergence of EG, GDA and PPM for simple quadratics.",
      pdfUrl: "/src/files/presentations/gml_presentation.pdf"
    }
  ];

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Presentations</h1>
          <p className="text-lg text-muted-foreground">
            Conference talks and invited presentations on machine learning and optimization
          </p>
        </header>

        <div className="space-y-8">
          {presentations.map((presentation) => (
            <article 
              key={presentation.id}
              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="md:flex">
                <div className="md:w-1/3 h-82 md:h-52 overflow-hidden bg-muted">
                  <img 
                    src={presentation.image} 
                    alt={presentation.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-3">
                    {presentation.title}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-primary">
                      {presentation.venue}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • {presentation.year}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {presentation.description}
                  </p>
                  <a
                    href={presentation.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    View Slides (PDF)
                    <ExternalLink className="w-4 h-4" />
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
