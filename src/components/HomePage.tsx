import { useState } from 'react';

const HomePage = () => {
  const newsItems = [
    {
      date: "2025-09-01",
      title: "Paper accepted at NeurIPS 2025!",
      description: "Our work on Local SGD has been accepted to NeurIPS 2025! I will be attending EurIPS in Copenhagen! Let me know if you wanna chat."
    },
    {
      date: "2025-05-01",
      title: "Paper accepted at ICML 2025!",
      description: "Our Decoupled SGDA paper has been accepted to ICML 2025!"
    },
    {
      date: "2024-07-01",
      title: "ICML 2024 in Vienna",
      description: "I will be attending ICML 2024 in Vienna."
    },
    {
      date: "2024-04-01",
      title: "Paper accepted at COLT 2024!",
      description: "Our paper on Local SGD has been accepted to COLT 2024!"
    },
    {
      date: "2023-10-01",
      title: "Paper accepted at Opt4ML workshop",
      description: "Our paper has been accepted to Opt4ML workshop @ NeurIPS!"
    },
    {
      date: "2023-04-01",
      title: "Joined MLO Lab",
      description: "I joined Prof. Sebastian Stich's group as a research assistant."
    },
    {
      date: "2023-04-01",
      title: "Started Master's at Saarland University",
      description: "I started my master's in Mathematics & Computer Science at Saarland University."
    },
    {
      date: "2022-01-01",
      title: "Internship at LIONS Lab @ EPFL",
      description: "Joined LIONS Lab @ EPFL as an intern."
    }
  ];

  const researchAreas = [
    "Optimization Theory",
    "Deep Learning Theory", 
    "High Dimensional Probability and Learning Theory"
  ];

  const [showAllNews, setShowAllNews] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-5xl font-heading font-bold text-foreground mb-6">
            Ali Zindari
          </h1>
          <div className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Master's Student at Saarland University • Researcher at CISPA
          </div>
          <p className="text-lg text-foreground leading-relaxed max-w-4xl mx-auto mb-8">
            I'm a Master's student in Mathematics and Computer Science at Saarland University and a researcher at CISPA 
            working at MLO Lab with Prof. Sebastian U. Stich. Feel free to contact me at{' '}
            <a href="mailto:zindari.ali@gmail.com" className="text-primary hover:underline">
              zindari.ali@gmail.com
            </a>
          </p>
          <div className="flex justify-center">
            <a 
              href="/cv.pdf" 
              target="_blank"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </a>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-16">
          <h2 className="section-heading">About</h2>
          <div className="card-academic">
            <p className="text-foreground leading-relaxed mb-4">
              My main research interests nowadays are:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {researchAreas.map((area, index) => (
                <li key={index} className="text-foreground">
                  {area}
                </li>
              ))}
            </ul>
            <p className="text-foreground leading-relaxed mb-4">
              My research has primarily focused on optimization theory, particularly in distributed settings and minimax 
              problems. I have worked on understanding the effectiveness of Local SGD from a theoretical perspective, 
              providing new convergence guarantees for this method. More recently, I have been developing 
              communication-efficient approaches for solving minimax problems in distributed settings.
            </p>
            <p className="text-foreground leading-relaxed">
              Lately, my interests have shifted toward deep learning theory  with a focus on generalization error. I'm
              interested in the use of high dimensional probablity tools to understand neural networks.
            </p>
          </div>
        </section>

        {/* Research Areas */}
        {/* <section className="mb-16">
          <h2 className="section-heading">Research Interests</h2>
          <div className="card-academic">
            <ul className="list-disc list-inside space-y-2 mb-4">
              {researchAreas.map((area, index) => (
                <li key={index} className="text-foreground">
                  {area}
                </li>
              ))}
            </ul>
            <p className="text-foreground leading-relaxed mb-4">
              My research primarily focuses on optimization theory in distributed and minimax settings. I am particularly 
              interested in understanding the theoretical foundations of decentralized learning algorithms and developing 
              communication-efficient methods for large-scale machine learning systems.
            </p>
            <p className="text-foreground leading-relaxed">
              Recently, I have been exploring the intersection of optimization and deep learning theory, specifically 
              investigating how different optimizers affect generalization performance and their implicit biases during 
              training. This work aims to bridge the gap between practical optimization methods and theoretical understanding 
              of deep learning systems.
            </p>
          </div>
        </section> */}

        {/* News & Updates */}
        <section>
          <h2 className="section-heading">News & Updates</h2>
          <div className="space-y-3">
            {(showAllNews ? newsItems : newsItems.slice(0, 4)).map((item, index) => (
              <div key={index} className="flex items-start gap-4 py-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowAllNews(!showAllNews)}
              className="text-sm text-primary hover:underline mt-4"
              aria-expanded={showAllNews}
            >
              {showAllNews ? 'Hide older news ←' : 'Show older news →'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;