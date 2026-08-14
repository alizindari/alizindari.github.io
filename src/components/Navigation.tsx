import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  activeTab: string;
}

const Navigation = ({ activeTab }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'blog', label: 'Blog', path: '/blog/' },
    { id: 'publications', label: 'Publications', path: '/publications/' },
    { id: 'presentations', label: 'Presentations', path: '/presentations/' }
  ];

  return (
    <nav
      className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
      aria-label="Primary navigation"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8 w-full">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-heading text-lg font-semibold text-foreground transition-colors hover:text-primary md:text-xl"
            >
              Ali Zindari
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1 flex-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-auto p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="md:hidden border-t border-border py-4 space-y-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-4 py-3 text-lg rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-foreground hover:bg-muted'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
