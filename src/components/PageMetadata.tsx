import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageMetadataProps {
  title: string;
  description: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
};

const PageMetadata = ({ title, description, type = 'website', noIndex = false }: PageMetadataProps) => {
  const location = useLocation();

  useEffect(() => {
    const canonicalPath = location.pathname === '/'
      ? '/'
      : `${location.pathname.replace(/\/+$/, '')}/`;
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;
    const imageUrl = `${window.location.origin}/ali-zindari-profile.jpg`;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', imageUrl);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, location.pathname, noIndex, title, type]);

  return null;
};

export default PageMetadata;
