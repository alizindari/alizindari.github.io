import { useState } from 'react';
import { blogPosts } from '../data/blogPosts';

interface BlogPageProps {
  onPostClick?: (postId: number) => void;
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
  onBackFromTag?: () => void;
}

const BlogPage = ({ onPostClick, onTagClick, selectedTag, onBackFromTag }: BlogPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{ type: string; value: string; postId?: number }[]>([]);

  // Generate search suggestions
  const generateSuggestions = (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    const newSuggestions: { type: string; value: string; postId?: number }[] = [];
    const termLower = term.toLowerCase();

    // Add matching post titles
    blogPosts.forEach(post => {
      if (post.title.toLowerCase().includes(termLower)) {
        newSuggestions.push({
          type: 'post',
          value: post.title,
          postId: post.id
        });
      }
    });

    // Add matching tags
    const matchingTags = allTags.filter(tag => 
      tag.toLowerCase().includes(termLower)
    );
    matchingTags.forEach(tag => {
      newSuggestions.push({
        type: 'tag',
        value: tag
      });
    });

    // Add matching excerpts (first 60 chars)
    blogPosts.forEach(post => {
      if (post.excerpt.toLowerCase().includes(termLower) && 
          !newSuggestions.some(s => s.postId === post.id)) {
        newSuggestions.push({
          type: 'excerpt',
          value: post.excerpt.substring(0, 60) + '...',
          postId: post.id
        });
      }
    });

    setSuggestions(newSuggestions.slice(0, 8)); // Limit to 8 suggestions
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    generateSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: { type: string; value: string; postId?: number }) => {
    if (suggestion.type === 'tag') {
      onTagClick?.(suggestion.value);
    } else if (suggestion.postId) {
      onPostClick?.(suggestion.postId);
    }
    setShowSuggestions(false);
    setSearchTerm('');
  };

  // Get all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags))).sort();

  // Filter posts based on search term and selected tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {selectedTag && (
            <div className="mb-6">
              <button 
                onClick={onBackFromTag}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                ← Back to All Posts
              </button>
            </div>
          )}
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            {selectedTag ? `Posts tagged: ${selectedTag}` : 'Blog Posts'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Insights and explorations in machine learning, mathematics, and computer science
          </p>
          
          {!selectedTag && (
            <div>
              {/* Search Section */}
              <div className="max-w-2xl mx-auto mb-6 relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search blog posts or tags..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <svg className="absolute right-3 top-3.5 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-elegant max-h-80 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0 flex items-start gap-3"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {suggestion.type === 'post' && (
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                            {suggestion.type === 'tag' && (
                              <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            )}
                            {suggestion.type === 'excerpt' && (
                              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {suggestion.value}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {suggestion.type === 'post' ? 'Blog Post' : 
                               suggestion.type === 'tag' ? 'Tag' : 'Content'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Filter Section */}
              <div className="flex flex-wrap gap-2 justify-center">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick?.(tag)}
                    className="px-3 py-1 rounded-full text-sm transition-colors capitalize bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found matching your search criteria.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article key={post.id} className="card-academic overflow-hidden cursor-pointer hover:shadow-elegant transition-all duration-300" onClick={() => onPostClick?.(post.id)}>
                <img
                  src={post.image}
                  alt={`${post.title} cover image`}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-heading font-semibold text-foreground hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-3">
                        By {post.author}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-foreground leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <button
                          key={tag} 
                          onClick={(e) => {
                            e.stopPropagation();
                            onTagClick?.(tag);
                          }}
                          className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-md capitalize hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <button className="text-sm text-primary hover:text-primary-light font-medium transition-colors">
                      Read more →
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;