import React from 'react';
import { Search, Eye, CreditCard, Download, Wrench, MessageSquareText } from 'lucide-react';
import { BRAND } from '../../config/brand.config';
import { ScrollReveal, ScrollStagger } from '../common/ScrollReveal';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Choose a Project',
      desc: 'Browse our catalog of production-style MERN, AI/ML, Python, and management software packages.',
    },
    {
      num: '02',
      icon: Eye,
      title: 'Explore Live Demo',
      desc: 'Test interactive live demos, review full features list, database diagrams, and included materials.',
    },
    {
      num: '03',
      icon: CreditCard,
      title: 'Purchase Securely',
      desc: 'Checkout via Razorpay encrypted payment gateway with instant server-side verification.',
    },
    {
      num: '04',
      icon: Download,
      title: 'Get Instant Access',
      desc: 'Access your secure authenticated download portal under My Purchases immediately after payment.',
    },
    {
      num: '05',
      icon: Wrench,
      title: 'Set Up & Customize',
      desc: 'Follow the included step-by-step setup guides to run locally or customize features for your needs.',
    },
    {
      num: '06',
      icon: MessageSquareText,
      title: 'Get Dedicated Support',
      desc: 'Connect with technical developers via WhatsApp or ticket helpdesk if you need setup assistance.',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How {BRAND.name} Works
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            From discovering your project to running it locally in under 5 minutes.
          </p>
        </ScrollReveal>

        <ScrollStagger
          staggerDelay={80}
          animation="fade-up"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative bg-surface/60 border border-border/60 rounded-2xl p-6 hover:border-primary-500/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 text-primary-400 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xl font-extrabold text-gray-600">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </ScrollStagger>

      </div>
    </section>
  );
};
