import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Github, GraduationCap, Linkedin, Mail } from 'lucide-react';
import cv from '@/files/homepage/CV.pdf';
import { getDocumentViewerUrl } from '@/lib/documentViewer';
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
      date: "2022-01-01",
      title: "Internship at LIONS Lab @ EPFL",
      description: "Joined LIONS Lab @ EPFL as an intern."
    }
  ];

  const researchAreas = [
    "Theory of Deep Learning",
    "High Dimensional and Dynamical Systems",
    "Structured Optimization, especially for neural networks",
  ];

  const [showAllNews, setShowAllNews] = useState(false);

  return (
    <div className="times-page min-h-screen bg-background">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <section className="border-b border-border pb-12 sm:pb-14">
          <div className="grid min-w-0 grid-cols-1 items-center gap-9 md:grid-cols-[minmax(0,1fr)_11rem] md:gap-9 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-8">
            <div className="min-w-0">
              <h1 className="text-5xl font-bold text-foreground sm:text-6xl lg:text-7xl">
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
                </a>,{' '}
                <a href="https://www.uni-saarland.de/en/home.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Universit&auml;t des Saarlandes
                </a>, and{' '}
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

              <div className="mt-8 flex items-center gap-2.5" aria-label="Profile links">
                <a
                  href={getDocumentViewerUrl(cv, 'Curriculum Vitae')}
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

            <div className="flex w-full min-w-0 max-w-sm items-center gap-1 md:flex-col lg:flex-row">
              <img
                src="/ali-zindari-profile.jpg"
                alt="Ali Zindari"
                width={400}
                height={400}
                fetchPriority="high"
                className="aspect-square w-32 shrink-0 rounded-md border border-border object-cover shadow-sm sm:w-44 md:w-full lg:w-44"
              />
              <JellyCube />
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-12 sm:py-14 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14" aria-labelledby="about-heading">
          <div>
            <h2 id="about-heading" className="text-3xl font-bold text-foreground">
              About
            </h2>
            <p className="mt-2 text-base text-muted-foreground">Research interests</p>
            <ul className="mt-6 border-t border-border text-base sm:text-lg">
              {researchAreas.map((area) => (
                <li key={area} className="border-b border-border py-3.5 leading-snug text-foreground">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 text-justify text-lg leading-8 text-foreground hyphens-auto">
            <p>
              Generally speaking, I&apos;m interested in how useful capabilities <span className="font-semibold text-primary">emerge</span> in transformers with many parameters. It seems that to have useful models, we need several elements to come together: a proper architecture, a good optimizer, enough <span className="font-semibold text-primary">degrees of freedom</span> in the model (high overparameterization), and <span className="font-semibold text-primary">randomness</span> and <span className="font-semibold text-primary">noise</span> in the optimization process. I would like to use tools from high-dimensional statistics, dynamical systems, and optimization to see what we can explain about these models.
            </p>
            <p>
              Lately, I&apos;ve been curious about the role of <strong className="font-semibold text-primary">memory</strong> in models and how it can actually help. I want to understand the best way to add memory to transformer architectures, how <strong className="font-semibold text-primary">compression</strong> can preserve useful <strong className="font-semibold text-primary">information</strong> and lead to good predictions, and what kind of memory <strong className="font-semibold text-primary">hierarchy</strong> we need, perhaps something closer to human memory, with both fast and slow parts. This could help models avoid forgetting and truly learn continuously.
            </p>
          </div>
        </section>

        <section className="grid gap-8 border-t border-border py-12 sm:py-14 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14" aria-labelledby="news-heading">
          <div>
            <h2 id="news-heading" className="text-3xl font-bold text-foreground">
              News
            </h2>
            <p className="mt-2 text-base text-muted-foreground">Recent updates</p>
          </div>

          <div>
            {(showAllNews ? newsItems : newsItems.slice(0, 4)).map((item, index) => (
              <article
                key={`${item.date}-${item.title}`}
                className={`grid gap-2 border-t border-border py-5 first:border-t-0 first:pt-0 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5 ${
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
        </section>
      </main>
    </div>
  );
};

export default HomePage;
