import localsgd_nips from '@/assets/papers/localsgd_nips.pdf';
import decoupled_icml from '@/assets/papers/decoupled.pdf';
import localsgd_colt from '@/assets/papers/localsgd_colt.pdf';
import localsgd_opt from '@/assets/papers/localised_opt.pdf';
import gan from '@/assets/papers/gan.pdf';
import bifurcated from '@/assets/papers/bifurcated.pdf';

const PublicationsPage = () => {
  const publications = [
    {
      id: 6,
      title: "Revisiting Consensus Error: A Fine-grained Analysis of Local SGD under Second-order Data Heterogeneity",
      authors: "K.K.Patel, A.Zindari, S.Stich, L.Wang",
      venue: "Advances in Neural Information Processing Systems (NeurIPS)",
      year: "2025",
      type: "Conference", 
      image: localsgd_nips,
      abstract: "Recent work has suggested that a second-order heterogeneity assumption may suffice to justify the empirical gains of local SGD. We confirm this conjecture by establishing new upper and lower bounds on the convergence of local SGD. These bounds demonstrate how a low second-order heterogeneity, combined with third-order smoothness, enables local SGD to interpolate between heterogeneous and homogeneous regimes while maintaining communication efficiency",
      doi: "arXiv:2405.11667",
      pdf: "https://arxiv.org/pdf/2501.14652?"
    },
    {
      id: 5,
      title: "Decoupled SGDA for Games with Intermittent Communication",
      authors: "A.Zindari, P.Yazdkhasti, A.Rodomanov, T.Chavdarova, S.Stich",
      venue: "International Conference on Machine Learning (ICML)",
      year: "2025",
      type: "Conference", 
      image: decoupled_icml,
      abstract: "We introduce Decoupled SGDA, a novel adaptation of Stochastic Gradient Descent Ascent (SGDA) tailored for multiplayer games with intermittent strategy communication. Our method is capble of achieving communication acceleration in weakly coupled games.",
      doi: "arXiv:2405.11667",
      pdf: "https://arxiv.org/pdf/2501.14652?"
    },
    {
      id: 4,
      title: "The Limits and Potentials of Local SGD for Distributed Heterogeneous Learning with Intermittent Communication",
      authors: "K.K.Patel, M.Glasgow, A.Zindari, L.Wang, S.Stich, Z.Cheng, N.Joshi, N.Srebro",
      venue: "Conference on Learning Theory (COLT)",
      year: "2024",
      type: "Conference", 
      image: localsgd_colt,
      abstract: "We analyze the theoretical limits and potentials of Local SGD in distributed heterogeneous learning settings with intermittent communication. Our work provides new convergence guarantees and insights into the effectiveness of this popular distributed optimization method.",
      doi: "arXiv:2405.11667",
      pdf: "https://arxiv.org/pdf/2405.11667"
    },
    {
      id: 3,
      title: "On the Convergence of Local SGD Under Third-Order Smoothness and Hessian Similarity",
      authors: "A.Zindari, R.Luo, S.Stich",
      venue: "Opt4ML workshop @ NeurIPS",
      year: "2023",
      type: "Conference",
      image: localsgd_opt, 
      abstract: "This paper investigates the convergence properties of Local SGD under third-order smoothness assumptions and Hessian similarity conditions, providing theoretical insights into distributed optimization in non-convex settings.",
      doi: "Opt4ML 2023",
      pdf: "https://opt-ml.org/papers/2023/paper51.pdf"
    },
    {
      id: 2,
      title: "Segmentation of Lungs COVID Infected Regions by Attention Mechanism and Synthetic Generated Data",
      authors: "A.Zindari, P.Yazdkhasti, Z.Nabizadeh, P.Khadivi, N.Karimi, S.Samavi",
      venue: "arXiv preprint",
      year: "2021",
      type: "Journal",
      image: gan,
      abstract: "We propose an attention-based approach for segmenting COVID-19 infected regions in lung CT images, enhanced with synthetic data generation techniques to improve model robustness and accuracy.",
      doi: "arXiv:2108.08895", 
      pdf: "https://arxiv.org/ftp/arxiv/papers/2108/2108.08895.pdf"
    },
    {
      id: 1,
      title: "Bifurcated Autoencoder for Segmentation of COVID-19 Infected Regions in CT Images",
      authors: "P. Yazdkhasti, A. Zindari, Z. Nabizadeh, R. Roshandel, P. Khadvi, N. Karimi, S. Samavi",
      venue: "arXiv preprint", 
      year: "2020",
      type: "Journal",
      image: bifurcated,
      abstract: "This work introduces a bifurcated autoencoder architecture specifically designed for accurate segmentation of COVID-19 infected regions in CT images, demonstrating improved performance over traditional approaches.",
      doi: "arXiv:2011.00631",
      pdf: "https://arxiv.org/ftp/arxiv/papers/2011/2011.00631.pdf"
    }
  ];

  const getVenueColor = (type: string) => {
    return type === 'Journal' ? 'bg-primary/10 text-primary' : 'bg-accent text-accent-foreground';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Publications
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Peer-reviewed research contributions to the fields of machine learning and computer science
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {publications.map((pub) => (
            <article key={pub.id} className="card-academic">
              <div className="flex gap-8">
                <div className="flex-shrink-0">
                  <img 
                    src={pub.image} 
                    alt={`${pub.title} visualization`}
                    className="w-72 h-72 object-cover rounded-lg border border-border shadow-card"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-heading font-semibold text-foreground leading-tight">
                      {pub.title}
                    </h2>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getVenueColor(pub.type)}`}>
                        {pub.type}
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {pub.year}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-2">
                    {pub.authors}
                  </p>
                  
                  <p className="text-primary font-medium mb-4">
                    {pub.venue}
                  </p>
                  
                  <p className="text-foreground leading-relaxed mb-6">
                    {pub.abstract}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <a 
                      href={pub.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicationsPage;