import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  Calendar,
  User,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { ENGINEERING_GUIDES } from '../data/engineeringGuidesData';

export const ProjectGuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const guide = ENGINEERING_GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    image: 'https://campusget.vercel.app/campusget-icon-light-tile.png',
    author: {
      '@type': 'Organization',
      name: guide.author,
      url: 'https://campusget.vercel.app/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CampusGet',
      logo: {
        '@type': 'ImageObject',
        url: 'https://campusget.vercel.app/campusget-icon-light-tile.png',
      },
    },
    datePublished: guide.datePublished,
    dateModified: guide.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://campusget.vercel.app/guides/${guide.slug}`,
    },
  };

  const faqSchema =
    guide.faqs && guide.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null;

  const combinedSchemas = faqSchema ? [articleSchema, faqSchema] : [articleSchema];

  return (
    <div className="min-h-screen py-10 md:py-16 bg-background">
      <SEOHead
        title={guide.seoTitle}
        description={guide.metaDescription}
        keywords={guide.keywords}
        canonicalPath={`/guides/${guide.slug}`}
        structuredData={combinedSchemas}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center space-x-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/guides" className="hover:text-white transition-colors">Engineering Guides</Link>
          <span>/</span>
          <span className="text-gray-200 truncate">{guide.title}</span>
        </nav>

        {/* HEADER */}
        <header className="space-y-4 border-b border-border/80 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
              {guide.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
              {guide.featuredBadge}
            </span>
            <span className="flex items-center space-x-1 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{guide.readTime}</span>
            </span>
            <span className="flex items-center space-x-1 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published: {guide.datePublished}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {guide.excerpt}
          </p>

          <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Authored by {guide.author}</span>
            </span>
          </div>
        </header>

        {/* MAIN BODY SECTIONS */}
        <article className="space-y-10 text-gray-300 text-sm sm:text-base leading-relaxed">
          {guide.sections.map((sec, sIdx) => (
            <section key={sIdx} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2 border-b border-border/60 pb-3">
                <span>{sec.heading}</span>
              </h2>

              {sec.subsections?.map((sub, subIdx) => (
                <div key={subIdx} className="space-y-3 bg-surface/50 border border-border/70 rounded-2xl p-6 sm:p-7">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {sub.title}
                  </h3>

                  {sub.body.map((para, pIdx) => (
                    <p key={pIdx} className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}

                  {sub.bulletPoints && sub.bulletPoints.length > 0 && (
                    <ul className="space-y-2 pt-2 text-xs sm:text-sm">
                      {sub.bulletPoints.map((pt, ptIdx) => (
                        <li key={ptIdx} className="flex items-start space-x-2.5 text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sub.proTip && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs sm:text-sm text-amber-200">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300">Pro-Tip for Students: </strong>
                        {sub.proTip}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>
          ))}

          {/* FAQS SECTION */}
          {guide.faqs && guide.faqs.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-border/80">
              <div className="flex items-center space-x-2 text-white font-bold text-xl">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>Frequently Asked Questions</span>
              </div>
              <div className="space-y-3">
                {guide.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="bg-surface/80 border border-border/70 rounded-xl p-5 space-y-2">
                    <h4 className="font-semibold text-white text-sm">
                      {faq.question}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ACTION CTA BOX */}
          <div className="bg-gradient-to-r from-indigo-950/70 via-surface to-purple-950/70 border border-indigo-500/40 rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Take Action & Build Your Career</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Ready to implement this with verified code & resources?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
              Skip days of debugging and incomplete tutorials. Download complete production source code, presentation decks, and academic IEEE reports.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={guide.ctaLink}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-sm transition-all"
              >
                <span>{guide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/guides"
                className="px-5 py-3 rounded-xl bg-surface hover:bg-background border border-border text-gray-300 hover:text-white font-semibold text-xs transition-colors"
              >
                All Engineering Guides
              </Link>
            </div>
          </div>

        </article>

        {/* BOTTOM NAVIGATION */}
        <div className="pt-8 border-t border-border/60 flex items-center justify-between">
          <Link
            to="/guides"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Guides</span>
          </Link>
          <div className="flex items-center space-x-2">
            {guide.tags.map((t, idx) => (
              <span key={idx} className="text-[10px] text-gray-400 bg-surface px-2.5 py-1 rounded-md border border-border/50">
                #{t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
