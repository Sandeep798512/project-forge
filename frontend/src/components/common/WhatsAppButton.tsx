import React from 'react';
import { MessageSquare } from 'lucide-react';
import { BRAND } from '../../config/brand.config';

interface WhatsAppButtonProps {
  customMessage?: string;
  label?: string;
  variant?: 'floating' | 'button' | 'inline';
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  customMessage = 'Hi! I have a question about project packages on ProjectForge.',
  label = 'Chat on WhatsApp',
  variant = 'floating',
}) => {
  const url = `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(customMessage)}`;

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 flex items-center space-x-2 group"
        title="Need Technical Assistance? Talk on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pr-1">
          WhatsApp Support
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center space-x-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
    >
      <MessageSquare className="w-4 h-4" />
      <span>{label}</span>
    </a>
  );
};
