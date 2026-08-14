import { lazy, Suspense, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import HomePage from '../components/HomePage';
import PageMetadata from '../components/PageMetadata';

const BlogPage = lazy(() => import('../components/BlogPage'));
const BlogPostView = lazy(() => import('../components/BlogPostView'));
const PublicationsPage = lazy(() => import('../components/PublicationsPage'));
const PresentationsPage = lazy(() => import('../components/PresentationsPage'));

const PageLoading = () => (
  <div className="flex min-h-[50vh] items-center justify-center" role="status">
    <span className="text-sm text-muted-foreground">Loading page...</span>
  </div>
);

const postMetadata: Record<string, { title: string; description: string }> = {
  'convergence-of-gradient-descent-for-smooth-functions': {
    title: 'Convergence of Gradient Descent for Smooth Functions | Ali Zindari',
    description: 'A concise derivation of the standard convergence guarantee for gradient descent on smooth nonconvex functions.',
  },
  'washing-machine-dilemma': {
    title: 'The Washing Machine Dilemma | Ali Zindari',
    description: 'A playful optimization model for balancing wardrobe size, laundry costs, capacity, drying time, and uncertainty.',
  },
};

const PersonalWebsite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug, tag } = useParams<{ slug?: string; tag?: string }>();
  const blogScrollPositionRef = useRef(0);
  const previousPathRef = useRef(location.pathname);

  const activeTab = location.pathname.startsWith('/blog')
    ? 'blog'
    : location.pathname.startsWith('/publications')
      ? 'publications'
      : location.pathname.startsWith('/presentations')
        ? 'presentations'
        : 'home';

  const metadata = slug
    ? postMetadata[slug] ?? {
        title: 'Post not found | Ali Zindari',
        description: 'The requested blog post could not be found.',
        noIndex: true,
      }
    : tag
      ? {
          title: `Posts tagged ${tag} | Ali Zindari`,
          description: `Blog posts by Ali Zindari tagged ${tag}.`,
        }
      : activeTab === 'blog'
        ? {
            title: 'Blog | Ali Zindari',
            description: 'Notes and explorations by Ali Zindari on machine learning, mathematics, optimization, and related questions.',
          }
        : activeTab === 'publications'
          ? {
              title: 'Publications | Ali Zindari',
              description: 'Research publications by Ali Zindari on optimization, distributed learning, fine-tuning, and machine learning theory.',
            }
          : activeTab === 'presentations'
            ? {
                title: 'Presentations | Ali Zindari',
                description: 'Thesis and seminar presentations by Ali Zindari on machine learning and optimization.',
              }
            : {
                title: 'Ali Zindari | Machine Learning Research',
                description: 'Ali Zindari is an ELLIS PhD student at CISPA and EPFL working on deep learning theory, optimization, and memory in transformer models.',
              };

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const returningFromPost = /^\/blog\/?$/.test(location.pathname)
      && previousPath.startsWith('/blog/')
      && !previousPath.startsWith('/blog/tag/');

    if (returningFromPost) {
      setTimeout(() => {
        window.scrollTo({ top: blogScrollPositionRef.current, behavior: 'instant' });
      }, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    previousPathRef.current = location.pathname;
  }, [location.pathname]);

  const handlePostClick = (postSlug: string) => {
    blogScrollPositionRef.current = window.scrollY;
    navigate(`/blog/${postSlug}/`);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/blog/tag/${encodeURIComponent(tag)}/`);
  };

  const handleBackToBlog = () => {
    navigate('/blog/');
  };

  const handleBackFromTag = () => {
    navigate('/blog/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleOpenTagFromPost = (tag: string) => {
    navigate(`/blog/tag/${encodeURIComponent(tag)}/`);
  };

  const renderContent = () => {
    if (slug) {
      return (
        <BlogPostView 
          postSlug={slug}
          onBack={handleBackToBlog}
          onHome={handleGoHome}
          onTagClick={handleOpenTagFromPost}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'blog':
        return (
          <BlogPage 
            onPostClick={handlePostClick}
            onTagClick={handleTagClick}
            selectedTag={tag ?? null}
            onBackFromTag={handleBackFromTag}
          />
        );
      case 'publications':
        return <PublicationsPage />;
      case 'presentations':
        return <PresentationsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMetadata
        title={metadata.title}
        description={metadata.description}
        type={slug ? 'article' : 'website'}
        noIndex={'noIndex' in metadata ? metadata.noIndex : false}
      />
      <Navigation activeTab={activeTab} />
      <Suspense fallback={<PageLoading />}>
        {renderContent()}
      </Suspense>
    </div>
  );
};

export default PersonalWebsite;
