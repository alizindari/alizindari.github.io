import { useState } from 'react';
import resumeIcon from '@/assets/icons/resume.svg';
import linkedinIcon from '@/assets/icons/linkedin.svg';
import xIcon from '@/assets/icons/x.svg';
import googleScholarIcon from '@/assets/icons/google_scholar.svg';
import gmailIcon from '@/assets/icons/gmail.svg';
import cv from '@/files/homepage/CV.pdf';

const HomePage = () => {
  const newsItems = [
    {
      date: "2025-11-01",
      title: "Started PhD at CISPA & EPFL in the ELLIS program!",
      description: "I started my PhD jointly at CISPA and EPFL, supervised by Prof. Sebastian U. Stich and Prof. Martin Jaggi."
    },
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
    "Theory of Deep Learning",
    "High Dimensional and Dynamical Systems",
    "Optimization of Problems with Structure (e.g. neural networks)",
  ];

  const [showAllNews, setShowAllNews] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="mb-12 sm:mb-16 text-center" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground mb-4 sm:mb-6 px-2">
            Ali Zindari
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl text-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            PhD Student at{' '}
            <a href="https://cispa.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CISPA</a>
            {' '}&{' '}
            <a href="https://www.epfl.ch" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">EPFL</a>
            {' '}•{' '}
            <a href="https://ellis.eu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ELLIS</a>
            {' '}Program
          </div>
          <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed max-w-none mx-auto mb-6 sm:mb-8 px-4 xl:whitespace-nowrap">
            Supervised by{' '}
            <a href="https://sstich.ch" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Prof. Sebastian U. Stich
            </a>
            {' '}and{' '}
            <a href="https://people.epfl.ch/martin.jaggi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Prof. Martin Jaggi
            </a>.
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 px-4">
            <a 
              href={cv} 
              target="_blank"
              className="hover:opacity-70 transition-opacity"
              aria-label="Download CV"
            >
              <img src={resumeIcon} alt="CV" className="w-8 h-8 sm:w-10 sm:h-10" />
            </a>
            <a 
              href="https://scholar.google.com/citations?user=gy3ALNoAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="Google Scholar"
            >
              <img src={googleScholarIcon} alt="Google Scholar" className="w-8 h-8 sm:w-10 sm:h-10" />
            </a>
            <a 
              href="https://www.linkedin.com/in/ali-zindari-a64bb6187/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="LinkedIn"
            >
              <img src={linkedinIcon} alt="LinkedIn" className="w-8 h-8 sm:w-10 sm:h-10" />
            </a>
            <a 
              href="mailto:zindari.ali@gmail.com"
              className="hover:opacity-70 transition-opacity"
              aria-label="Email"
            >
              <img src={gmailIcon} alt="Email" className="w-8 h-8 sm:w-10 sm:h-10" />
            </a>
            <a 
              href="https://x.com/ali__zindari"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="X/Twitter"
            >
              <img src={xIcon} alt="X" className="w-8 h-8 sm:w-10 sm:h-10" />
            </a>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="section-heading text-xl sm:text-2xl">About</h2>
          <div className="card-academic p-4 sm:p-6 text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              My research sits at the intersection of:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-5 text-base sm:text-lg">
              {researchAreas.map((area, index) => (
                <li key={index}>
                  {area}
                </li>
              ))}
            </ul>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Generally speaking, I am interested in how capabilities emerge in systems with many interacting parts, especially highly overparameterized neural networks. It still feels surprising to me that with the right architecture, learning method, and scale, something that looks like intelligence can come out of the training process. I want to understand why that happens.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Recently, I have been thinking about fine-tuning, forgetting, and continual learning, and about how architecture fits into the picture. More specifically, I want to understand why forgetting happens in the first place: when it is truly catastrophic, when it is only a small drift, and what that says about how a model stores knowledge. I am especially interested in the role of memory: how knowledge should be stored so that it is not easily overwritten by new training, and whether forgotten knowledge can be recovered rather than learned again from scratch.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              
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
          <h2 className="section-heading text-xl sm:text-2xl">News & Updates</h2>
          <div className="space-y-3">
            {(showAllNews ? newsItems : newsItems.slice(0, 4)).map((item, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4 py-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base sm:text-lg text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground sm:whitespace-nowrap">
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
              className="text-sm sm:text-base text-primary hover:underline mt-4"
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
