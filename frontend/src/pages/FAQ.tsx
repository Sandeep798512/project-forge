import React from 'react';
import { FAQSection, defaultFAQs } from '../components/marketplace/FAQSection';
import { SEOHead } from '../components/common/SEOHead';

export const FAQPage: React.FC = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: defaultFAQs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <SEOHead
        title="Frequently Asked Questions (FAQ) | CampusGet Source Code & Support"
        description="Got questions about CampusGet project downloads, source code licensing, Razorpay payments, setup documentation, or college submission support? Read our complete FAQ."
        keywords="campusget faq, project download help, btech project source code faq, razorpay payment safety, college viva questions"
        canonicalPath="/faq"
        structuredData={faqSchema}
      />
      <FAQSection />
    </div>
  );
};
