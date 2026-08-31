import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, MessageSquare, Ticket, LifeBuoy, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { useAuth } from '../context/AuthContext';

export const Support: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3.5 py-1 rounded-full text-xs font-semibold text-primary-400">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Developer Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Technical Support & Helpdesk
          </h1>
          <p className="text-gray-400 text-sm">
            Need help configuring your environment or running code locally? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: WhatsApp Instant Support */}
          <div className="bg-surface/80 border border-border/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">WhatsApp Developer Desk</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Connect directly with technical engineers for instant setup troubleshooting, query clarification, or installation support.
              </p>
            </div>
            <div className="pt-4 border-t border-border/60">
              <WhatsAppButton variant="inline" label="Open WhatsApp Chat" />
            </div>
          </div>

          {/* Card 2: Support Ticket System */}
          <div className="bg-surface/80 border border-border/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Support Ticket System</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Create a tracked support ticket tied to your specific order. Our engineering team reviews code logs and provides fixes.
              </p>
            </div>
            <div className="pt-4 border-t border-border/60">
              {isAuthenticated ? (
                <Link
                  to="/dashboard/support"
                  className="inline-flex items-center space-x-2 bg-primary-600/20 text-primary-400 border border-primary-500/40 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-primary-600/30 transition-colors"
                >
                  <span>Manage Support Tickets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/login?redirect=/dashboard/support"
                  className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-glow-sm"
                >
                  <span>Sign In to Create Ticket</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
