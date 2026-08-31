import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Wrench, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const Pricing: React.FC = () => {
  const customizationTiers = [
    {
      name: 'Basic Customization',
      price: '₹499+',
      desc: 'Quick UI adjustments, branding changes, and title modifications.',
      features: [
        'Custom Logo & Color Palette Replacement',
        'Project Title & Header Customization',
        'Footer & Contact Info Modification',
        '1 Round of Revision',
        '24-48 Hours Delivery',
      ],
      cta: 'Request Basic Setup',
      customMessage: 'Hi, I need Basic Customization for a project package (Logo, Title, Branding).',
    },
    {
      name: 'Advanced Customization',
      price: '₹1,499+',
      recommended: true,
      desc: 'Add custom features, additional database fields, or API integrations.',
      features: [
        'All Basic Customizations',
        'New Feature / CRUD Module Addition',
        'Custom MongoDB / SQL Schema Changes',
        'Third-Party API Integration (Payment/AI)',
        'Custom Live Cloud Deployment Assistance',
        'Priority Developer Support',
      ],
      cta: 'Request Advanced Mod',
      customMessage: 'Hi, I need Advanced Customization (adding new feature/API integration).',
    },
    {
      name: 'Full Custom Project Dev',
      price: 'Contact Us',
      desc: 'Bespoke end-to-end software development tailored to your specific thesis or startup specification.',
      features: [
        'Complete Custom Requirements Engineering',
        'Frontend + Backend Microservices Architecture',
        'Custom Database & Storage Design',
        'Comprehensive Custom Report & PPTX',
        'Dedicated Senior Engineer Guidance',
      ],
      cta: 'Contact Engineering Team',
      customMessage: 'Hi, I want to discuss a Full Custom Software Project build.',
    },
  ];

  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3.5 py-1 rounded-full text-xs font-semibold text-primary-400">
            <Wrench className="w-3.5 h-3.5" />
            <span>Developer Support & Services</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparent Pricing & Customization
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            All project packages in our marketplace include full source code. Need extra features, branding tweaks, or custom cloud setup? We offer developer services.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customizationTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-surface/80 border rounded-2xl p-6 flex flex-col justify-between relative transition-all duration-200 ${
                tier.recommended
                  ? 'border-primary-500 shadow-glow-md bg-surface'
                  : 'border-border/80 hover:border-primary-500/50'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-bold text-xl text-white">{tier.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{tier.desc}</p>

                <ul className="space-y-2.5 pt-4 border-t border-border/60 text-xs text-gray-300">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-border/60 mt-6">
                <WhatsAppButton
                  variant="inline"
                  label={tier.cta}
                  customMessage={tier.customMessage}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface/40 border border-border/60 rounded-2xl p-8 text-center max-w-3xl mx-auto space-y-3">
          <h3 className="font-bold text-lg text-white">Have a specific custom project requirement?</h3>
          <p className="text-gray-400 text-xs">
            Send us your problem statement or functional specification on WhatsApp for a quick estimate.
          </p>
          <div className="pt-2 flex justify-center">
            <WhatsAppButton
              variant="inline"
              label="Talk to Lead Developer"
              customMessage="Hi, I would like to discuss a custom project requirement."
            />
          </div>
        </div>

      </div>
    </div>
  );
};
