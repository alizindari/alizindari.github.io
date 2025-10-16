import { ArrowLeft, Home } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

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

  const renderContent = (content: string) => {
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/);
    
    return parts.map((part, index) => {
      if ((part.startsWith('$$') && part.endsWith('$$')) || (part.startsWith('$') && part.endsWith('$'))) {
        // Skip rendering math blocks/inline formulas per requirement
        return null;
      } else {
        // Simple markdown-like parsing
        return part.split('\n').map((line, lineIndex) => {
          if (line.startsWith('# ')) {
            return <h1 key={lineIndex} className="text-3xl font-heading font-bold text-foreground mb-6 mt-8 first:mt-0">{line.slice(2)}</h1>;
          } else if (line.startsWith('## ')) {
            return <h2 key={lineIndex} className="text-2xl font-heading font-semibold text-foreground mb-4 mt-6">{line.slice(3)}</h2>;
          } else if (line.startsWith('### ')) {
            return <h3 key={lineIndex} className="text-xl font-heading font-medium text-foreground mb-3 mt-5">{line.slice(4)}</h3>;
          } else if (line.startsWith('- ')) {
            return <li key={lineIndex} className="text-foreground leading-relaxed ml-4">{line.slice(2)}</li>;
          } else if (line.trim() === '') {
            return <br key={lineIndex} />;
          } else if (line.match(/^\d+\./)) {
            return <li key={lineIndex} className="text-foreground leading-relaxed ml-4 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
          } else if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={lineIndex} className="text-foreground leading-relaxed mb-4 font-semibold">{line.slice(2, -2)}</p>;
          } else {
            return <p key={lineIndex} className="text-foreground leading-relaxed mb-4">{line}</p>;
          }
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </button>
          <button 
            onClick={onHome}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home size={20} />
            Home
          </button>
        </div>

        {/* Article */}
        <article className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
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
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-md capitalize hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={`View posts tagged ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="card-academic">
            <div className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </div>
          </div>

        </article>
      </div>
    </div>
  );
};

export default BlogPostView;