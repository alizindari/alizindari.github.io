import presOptimization from '@/assets/pres-optimization.jpg';
import presDistributed from '@/assets/pres-distributed.jpg';
import presDeeplearning from '@/assets/pres-deeplearning.jpg';
import { ExternalLink } from 'lucide-react';

const PresentationsPage = () => {
  const presentations = [
    // {
    //   id: 1,
    //   title: "Advanced Optimization Algorithms for Deep Learning",
    //   venue: "International Conference on Machine Learning (ICML)",
    //   year: 2023,
    //   image: presOptimization,
    //   description: "A comprehensive overview of state-of-the-art optimization techniques including adaptive learning rates, momentum methods, and second-order optimization approaches.",
    //   pdfUrl: "/presentations/optimization-icml-2023.pdf"
    // },
    // {
    //   id: 2,
    //   title: "Distributed Training at Scale: Theory and Practice",
    //   venue: "Neural Information Processing Systems (NeurIPS)",
    //   year: 2022,
    //   image: presDistributed,
    //   description: "Exploring communication-efficient distributed learning algorithms, including Local SGD, gradient compression, and decentralized optimization methods.",
    //   pdfUrl: "/presentations/distributed-neurips-2022.pdf"
    // },
    // {
    //   id: 3,
    //   title: "Deep Learning Architectures for Computer Vision",
    //   venue: "Computer Vision and Pattern Recognition (CVPR)",
    //   year: 2022,
    //   image: presDeeplearning,
    //   description: "An in-depth analysis of modern CNN architectures, attention mechanisms, and transformer-based models for various computer vision tasks.",
    //   pdfUrl: "/presentations/deeplearning-cvpr-2022.pdf"
    // }
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
                <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-muted">
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
