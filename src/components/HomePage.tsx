import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Github, GraduationCap, Linkedin, Mail } from 'lucide-react';
import JellyCube from './JellyCube';

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
      date: "2022-06-01",
      title: "Internship at LIONS Lab @ EPFL",
      description: "I joined LIONS Lab @ EPFL as a research intern, working on the adversarial robustness of self-supervised models."
    },
    {
      date: "2021-07-01",
      title: "Internship at VITA Lab @ EPFL",
      description: "I joined VITA Lab @ EPFL as a research intern, working on motion forecasting for self-driving cars."
    }
  ];

  const researchAreas = [
    "Theory of Deep Learning",
    "High Dimensional and Dynamical Systems",
    "Structured Optimization, especially for neural networks",
  ];

  const [showAllNews, setShowAllNews] = useState(false);

  return (
    <div className="home-page times-page min-h-screen">
      <main>
        <section className="home-intro">
          <div className="site-container home-intro-grid">
            <div className="home-intro-copy min-w-0">
              <h1 className="home-name text-foreground">
                Ali Zindari
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                I&apos;m a PhD student in the{' '}
                <a href="https://ellis.eu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  ELLIS
                </a>{' '}
                program, jointly at{' '}
                <a href="https://cispa.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  CISPA
                </a> and{' '}
                <a href="https://www.epfl.ch" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  EPFL
                </a>
                , supervised by{' '}
                <a href="https://sstich.ch" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Prof. Sebastian U. Stich
                </a>{' '}
                and{' '}
                <a href="https://people.epfl.ch/martin.jaggi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Prof. Martin Jaggi
                </a>
                .
              </p>

              <div className="profile-links mt-8 flex items-center gap-2.5" aria-label="Profile links">
                <a
                  href="/cv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-primary"
                  aria-label="Open CV"
                  title="CV"
                >
                  <FileText size={19} strokeWidth={1.8} />
                </a>
                <a
                  href="https://scholar.google.com/citations?user=gy3ALNoAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-primary"
                  aria-label="Google Scholar"
                  title="Google Scholar"
                >
                  <GraduationCap size={21} strokeWidth={1.8} />
                </a>
                <a
                  href="https://github.com/alizindari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-primary"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <Github size={19} strokeWidth={1.8} />
                </a>
                <a
                  href="https://www.linkedin.com/in/ali-zindari-a64bb6187/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-primary"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin size={19} strokeWidth={1.8} />
                </a>
                <a
                  href="mailto:zindari.ali@gmail.com"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-primary"
                  aria-label="Email"
                  title="Email"
                >
                  <Mail size={19} strokeWidth={1.8} />
                </a>
                <a
                  href="https://x.com/ali__zindari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-primary"
                  aria-label="X"
                  title="X"
                >
                  <span className="font-sans text-base font-semibold" aria-hidden="true">X</span>
                </a>
              </div>
            </div>

            <div className="home-portrait-group">
              <figure className="home-portrait">
                <img
                  src="/ali-zindari-acropolis.png"
                  alt="Ali Zindari at the Acropolis in Athens"
                  width={1086}
                  height={1448}
                  fetchPriority="high"
                  className="aspect-square w-full object-cover"
                />
                <figcaption className="mt-2 text-center text-sm leading-snug text-muted-foreground">
                  Athens Acropolis
                </figcaption>
              </figure>
              <JellyCube />
            </div>
          </div>
        </section>

        <section className="home-about" aria-labelledby="about-heading">
          <div className="site-container home-section-grid">
            <div className="home-section-heading">
              <h2 id="about-heading" className="text-3xl font-bold text-foreground">
                About
              </h2>
              <p className="mt-2 text-base text-muted-foreground">Research interests</p>
              <ul className="research-areas mt-6 text-base sm:text-lg">
                {researchAreas.map((area) => (
                  <li key={area} className="leading-snug text-foreground">
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-copy space-y-6 text-justify text-lg leading-8 text-foreground hyphens-auto">
              <p>
                Generally speaking, I&apos;m interested in how useful capabilities <span className="font-semibold text-primary">emerge</span> in transformers with many parameters. It seems that to have useful models, we need several elements to come together: a proper architecture, a good optimizer, enough <span className="font-semibold text-primary">degrees of freedom</span> in the model (high overparameterization), and <span className="font-semibold text-primary">randomness</span> and <span className="font-semibold text-primary">noise</span> in the optimization process. I would like to use tools from high-dimensional statistics, dynamical systems, and optimization to see what we can explain about these models.
              </p>
              <p>
                Lately, I&apos;ve become interested in developing architectures that use both <strong className="font-semibold text-primary">long-term and short-term memory</strong> during inference, with mechanisms for deciding which <strong className="font-semibold text-primary">information</strong> to keep and which to erase.
              </p>
            </div>
          </div>
        </section>

        <section className="home-news" aria-labelledby="news-heading">
          <div className="site-container home-section-grid">
            <div className="home-section-heading">
              <h2 id="news-heading" className="text-3xl font-bold text-foreground">
                News
              </h2>
              <p className="mt-2 text-base text-muted-foreground">Recent updates</p>
            </div>

            <div className="news-list">
              {(showAllNews ? newsItems : newsItems.slice(0, 4)).map((item, index) => (
                <article
                  key={`${item.date}-${item.title}`}
                  className={`news-item grid gap-2 border-t border-border py-5 first:border-t-0 first:pt-0 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5 ${
                    index === (showAllNews ? newsItems.length : 4) - 1 ? 'pb-3' : ''
                  }`}
                >
                  <time dateTime={item.date} className="text-sm text-muted-foreground sm:pt-1">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </time>
                  <div>
                    <h3 className="text-lg font-semibold leading-snug text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
              <button
                onClick={() => setShowAllNews(!showAllNews)}
                className="mt-5 inline-flex items-center gap-2 text-base font-medium text-primary hover:underline sm:ml-[8rem]"
                aria-expanded={showAllNews}
              >
                {showAllNews ? (
                  <>
                    Hide older news
                    <ChevronUp size={17} aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Show older news
                    <ChevronDown size={17} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
