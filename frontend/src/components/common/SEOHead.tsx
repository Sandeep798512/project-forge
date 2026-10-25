import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object | object[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalPath = '',
  ogImage = 'https://campusget.vercel.app/campusget-icon-light-tile.png',
  ogType = 'website',
  structuredData,
}) => {
  useEffect(() => {
    // 1. Title
    const fullTitle = title.includes('CampusGet') ? title : `${title} | CampusGet`;
    document.title = fullTitle;

    // Helper to update or create a meta tag
    const setMetaTag = (attribute: 'name' | 'property', name: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // 2. Primary Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // 3. Canonical Link
    const baseUrl = 'https://campusget.vercel.app';
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const canonicalUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
    
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl || baseUrl;

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl || baseUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'CampusGet');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:card', 'summary_large_image');

    // 6. JSON-LD Dynamic Structured Data Schema
    const schemaId = 'dynamic-seo-schema';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;

    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = schemaId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup dynamic page schema on page transition
      const cleanupTag = document.getElementById(schemaId);
      if (cleanupTag) {
        cleanupTag.remove();
      }
    };
  }, [title, description, keywords, canonicalPath, ogImage, ogType, structuredData]);

  return null;
};
