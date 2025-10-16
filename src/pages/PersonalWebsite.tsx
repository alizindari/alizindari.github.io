import { useState, useEffect, useRef } from 'react';
import Navigation from '../components/Navigation';
import HomePage from '../components/HomePage';
import BlogPage from '../components/BlogPage';
import BlogPostView from '../components/BlogPostView';
import PublicationsPage from '../components/PublicationsPage';
import PresentationsPage from '../components/PresentationsPage';

const PersonalWebsite = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedBlogTag, setSelectedBlogTag] = useState<string | null>(null);
  const [blogScrollPosition, setBlogScrollPosition] = useState(0);
  const restoringScrollRef = useRef(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedPostId(null);
    setSelectedBlogTag(null);
    // Reset scroll position when switching tabs
    setBlogScrollPosition(0);
  };

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Scroll to top when blog post is selected, restore position when deselected
  useEffect(() => {
    if (selectedPostId !== null) {
      // Going to a blog post - scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (activeTab === 'blog' && !restoringScrollRef.current) {
      // Returning to blog - restore scroll position
      restoringScrollRef.current = true;
      setTimeout(() => {
        window.scrollTo({ top: blogScrollPosition, behavior: 'instant' });
        restoringScrollRef.current = false;
      }, 0);
    }
  }, [selectedPostId, activeTab, blogScrollPosition]);

  const handlePostClick = (postId: number) => {
    // Store current scroll position before navigating to post
    setBlogScrollPosition(window.scrollY);
    setSelectedPostId(postId);
  };

  const handleTagClick = (tag: string) => {
    setSelectedBlogTag(tag);
  };

  const handleBackToBlog = () => {
    setSelectedPostId(null);
  };

  const handleBackFromTag = () => {
    setSelectedBlogTag(null);
  };

  const handleGoHome = () => {
    setSelectedPostId(null);
    setSelectedBlogTag(null);
    setActiveTab('home');
  };

  const handleOpenTagFromPost = (tag: string) => {
    setSelectedBlogTag(tag);
    setSelectedPostId(null);
    setActiveTab('blog');
  };

  const renderContent = () => {
    if (selectedPostId !== null) {
      return (
        <BlogPostView 
          postId={selectedPostId} 
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
            selectedTag={selectedBlogTag}
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
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      {renderContent()}
    </div>
  );
};

export default PersonalWebsite;