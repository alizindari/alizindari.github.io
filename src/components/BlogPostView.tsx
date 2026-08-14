import { lazy, Suspense } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import BlogDifficulty from './BlogDifficulty';
import BlogPostFooter from './BlogPostFooter';
import MathRenderer from './MathRenderer';

const LaundryModelPlayground = lazy(() => import('./LaundryModelPlayground'));
const LaundryStochasticSimulator = lazy(() => import('./LaundryStochasticSimulator'));

interface BlogPostViewProps {
  postSlug: string;
  onBack: () => void;
  onHome: () => void;
  onTagClick?: (tag: string) => void;
}

const BlogPostView = ({ postSlug, onBack, onHome, onTagClick }: BlogPostViewProps) => {

  const post = blogPosts.find(p => p.slug === postSlug);

  if (!post) {
    return (
      <div className="blog-post-view min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Post not found</h1>
          <button 
            onClick={onBack}
            className="text-primary hover:text-primary-light transition-colors"
          >
            ← Back to blog
          </button>
        </div>
      </div>
    );
  }

  const renderInlineMath = (text: string, keyPrefix: string) => {
    return text.split(/(\$[^$\n]+\$)/g).map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <MathRenderer key={`${keyPrefix}-math-${index}`}>
            {part.slice(1, -1)}
          </MathRenderer>
        );
      }

      return part;
    });
  };

  const renderContent = (content: string) => {
    return content.split(/(\$\$[\s\S]*?\$\$)/g).map((block, blockIndex) => {
      if (block.startsWith('$$') && block.endsWith('$$')) {
        return (
          <MathRenderer key={`block-math-${blockIndex}`} display>
            {block.slice(2, -2).trim()}
          </MathRenderer>
        );
      }

      return block.split('\n').map((line, lineIndex) => {
        const key = `${blockIndex}-${lineIndex}`;

        if (line.startsWith('# ')) {
          return <h1 key={key} className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4 sm:mb-6 mt-6 sm:mt-8 first:mt-0">{renderInlineMath(line.slice(2), key)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={key} className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-3 sm:mb-4 mt-4 sm:mt-6">{renderInlineMath(line.slice(3), key)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={key} className="text-lg sm:text-xl font-heading font-medium text-foreground mb-2 sm:mb-3 mt-3 sm:mt-5">{renderInlineMath(line.slice(4), key)}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={key} className="text-base sm:text-lg text-foreground leading-[1.5] ml-4">{renderInlineMath(line.slice(2), key)}</li>;
        } else if (line.trim() === '') {
          return null;
        } else if (line.match(/^\d+\./)) {
          return <li key={key} className="text-base sm:text-lg text-foreground leading-[1.5] ml-4 list-decimal">{renderInlineMath(line.replace(/^\d+\.\s*/, ''), key)}</li>;
        } else if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={key} className="text-base sm:text-lg text-foreground leading-[1.5] mb-3 font-semibold">{renderInlineMath(line.slice(2, -2), key)}</p>;
        } else {
          return <p key={key} className="text-base sm:text-lg text-foreground leading-[1.5] mb-3">{renderInlineMath(line, key)}</p>;
        }
      });
    });
  };

  const playgroundMarker = '\n## Part III:';
  const playgroundMarkerIndex = post.id === 2
    ? post.content.indexOf(playgroundMarker)
    : -1;
  const contentBeforePlayground = playgroundMarkerIndex >= 0
    ? post.content.slice(0, playgroundMarkerIndex)
    : post.content;
  const contentAfterPlayground = playgroundMarkerIndex >= 0
    ? post.content.slice(playgroundMarkerIndex + 1)
    : '';

  return (
    <div className="blog-post-view min-h-screen bg-gradient-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Back to Blog</span>
            <span className="xs:hidden">Back</span>
          </button>
          <button 
            onClick={onHome}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Home</span>
            <span className="xs:hidden">Home</span>
          </button>
        </div>

        {/* Article */}
        <article className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 sm:mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
              <span>Written by Ali Zindari</span>
              <span>•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <BlogDifficulty level={post.difficulty} className="mt-5 max-w-lg" />
          </header>

          {/* Tags */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm bg-primary/10 text-primary rounded-md capitalize hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={`View posts tagged ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {post.content.trim() && (
            <div className="card-academic p-4 sm:p-6">
              <div className="blog-article max-w-none text-justify hyphens-auto">
                {renderContent(contentBeforePlayground)}
              </div>
              {post.id === 2 && (
                <Suspense fallback={<div className="mt-8 h-40 border-t border-border" />}>
                  <LaundryModelPlayground />
                </Suspense>
              )}
              {contentAfterPlayground && (
                <div className="blog-article mt-10 max-w-none border-t border-border pt-8 text-justify hyphens-auto">
                  {renderContent(contentAfterPlayground)}
                </div>
              )}
              {post.id === 2 && contentAfterPlayground && (
                <Suspense fallback={<div className="mt-10 h-52 border-t border-border" />}>
                  <LaundryStochasticSimulator />
                </Suspense>
              )}
              <BlogPostFooter post={post} />
            </div>
          )}

        </article>
      </div>
    </div>
  );
};

export default BlogPostView;
