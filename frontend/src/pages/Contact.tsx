import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Contact Developer Support</h1>
          <p className="text-gray-400 text-sm">Have a question before buying? Need assistance with a project download?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Info */}
          <div className="space-y-6 bg-surface/80 border border-border/80 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">Direct Communication Channels</h2>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">WhatsApp Support (Fastest)</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Instant developer assistance during 9 AM - 10 PM IST.</p>
                  <div className="mt-2">
                    <WhatsAppButton variant="inline" label="Chat on WhatsApp" />
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-4 border-t border-border/60">
                <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Email Desk</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{BRAND.supportEmail}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-4 border-t border-border/60">
                <div className="w-9 h-9 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Office Location</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{BRAND.legal.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="bg-surface/80 border border-border/80 rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Message Received!</h3>
                <p className="text-gray-400 text-xs">Our engineering support team will respond to your email within 4 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-1">Send an Inquiry</h2>
                <p className="text-[11px] text-amber-400/90 font-medium bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                  🔒 <strong>Security Notice:</strong> Do not submit passwords, API keys, private credentials, or confidential information in this form.
                </p>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-border/80 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-500"
                    placeholder="Sandeep Gaud"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-border/80 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-500"
                    placeholder="sandeep@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-background border border-border/80 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-500"
                    placeholder="Question about AI Resume Analyzer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-background border border-border/80 rounded-xl px-4 py-2 text-sm text-gray-100 placeholder-gray-500"
                    placeholder="Describe your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-glow-sm flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
