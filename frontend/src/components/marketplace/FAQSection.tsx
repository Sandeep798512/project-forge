import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export const defaultFAQs: FAQItem[] = [
  {
    question: 'What do I receive when I purchase a project package?',
    answer: 'You get full access to the complete source code (Frontend, Backend, Database schemas & seeds), system architecture diagrams, presentation deck (.PPTX), academic project report (.PDF), step-by-step setup guide, deployment instructions, and viva voce preparation material.',
  },
  {
    question: 'How do I download my project files after payment?',
    answer: 'Once payment is confirmed server-side, the project automatically unlocks under "My Purchases" in your account dashboard. You can download the source code zip package via secure, time-limited download links anytime.',
  },
  {
    question: 'Can I customize the project for my college requirements or portfolio?',
    answer: 'Yes! You receive full source code rights to edit, modify branding, change database schemas, add new features, or use the project in your personal portfolio and interview demos.',
  },
  {
    question: 'What if I face difficulty running or setting up the code locally?',
    answer: 'Every project includes a comprehensive Setup & Deployment Guide. Additionally, you get direct developer support via our WhatsApp helpdesk and built-in support ticket system to resolve any configuration or environment issues.',
  },
  {
    question: 'Are there any hidden subscription costs or recurring fees?',
    answer: 'No. All project packages are single one-time purchases with lifetime access to your purchased version and updates.',
  },
  {
    question: 'Do you offer custom feature development or UI modifications?',
    answer: 'Yes, we offer paid customization services starting from ₹499+. You can request UI branding changes, new feature integrations, or deployment assistance through our Customization request options.',
  },
];

export const FAQSection: React.FC<{ items?: FAQItem[] }> = ({ items = defaultFAQs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-surface/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3.5 py-1 rounded-full text-xs font-semibold text-primary-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Everything you need to know about our project packages, licensing, and support.
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-surface/80 border border-border/70 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between text-gray-100 hover:text-primary-400 font-semibold text-sm focus:outline-none"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-gray-400 text-xs sm:text-sm leading-relaxed border-t border-border/40">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
