import { ArrowLeft, Home } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import MathRenderer from './MathRenderer';

interface BlogPostViewProps {
  postId: number;
  onBack: () => void;
  onHome: () => void;
  onTagClick?: (tag: string) => void;
}

const BlogPostView = ({ postId, onBack, onHome, onTagClick }: BlogPostViewProps) => {

  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
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
          return <li key={key} className="text-base sm:text-lg text-foreground leading-relaxed ml-4">{renderInlineMath(line.slice(2), key)}</li>;
        } else if (line.trim() === '') {
          return <br key={key} />;
        } else if (line.match(/^\d+\./)) {
          return <li key={key} className="text-base sm:text-lg text-foreground leading-relaxed ml-4 list-decimal">{renderInlineMath(line.replace(/^\d+\.\s*/, ''), key)}</li>;
        } else if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={key} className="text-base sm:text-lg text-foreground leading-relaxed mb-3 sm:mb-4 font-semibold">{renderInlineMath(line.slice(2, -2), key)}</p>;
        } else {
          return <p key={key} className="text-base sm:text-lg text-foreground leading-relaxed mb-3 sm:mb-4">{renderInlineMath(line, key)}</p>;
        }
      });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
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
          <div className="card-academic p-4 sm:p-6">
            <div className="blog-article prose prose-sm sm:prose-base md:prose-lg max-w-none">
              {renderContent(post.content)}
            </div>
          </div>

        </article>
      </div>
    </div>
  );
};

export default BlogPostView;
