import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, MessageSquare, Mail, Github, Instagram, Heart } from 'lucide-react';
import { BRAND } from '../../config/brand.config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface/90 border-t border-border/60 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/campusget-icon-light-tile.png"
                alt={BRAND.name}
                className="w-9 h-9 rounded-xl object-contain shadow-glow-sm"
              />
              <span className="font-extrabold text-xl text-white tracking-tight">{BRAND.name}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {BRAND.description}
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href={BRAND.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-lg border border-border hover:text-white hover:border-primary-500 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href={BRAND.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-lg border border-border hover:text-white hover:border-accent-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${BRAND.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-lg border border-border hover:text-emerald-400 hover:border-emerald-500 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2.5 font-normal">
              <li><Link to="/projects" className="hover:text-white transition-colors">All Projects</Link></li>
              <li><Link to="/projects?category=ai-ml" className="hover:text-white transition-colors">AI & ML Projects</Link></li>
              <li><Link to="/projects?category=mern-stack" className="hover:text-white transition-colors">MERN Stack Projects</Link></li>
              <li><Link to="/projects?category=management-systems" className="hover:text-white transition-colors">Management Systems</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Customization Services</Link></li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 font-normal">
              <li><Link to="/study-materials" className="hover:text-emerald-300 text-emerald-400 font-semibold transition-colors">Free Study Materials</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About {BRAND.name}</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Developer Support</Link></li>
              <li><a href={`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent('Hi, I need assistance with a project package.')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center space-x-1">
                <span>WhatsApp Helpdesk</span>
              </a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Legal & License</h4>
            <ul className="space-y-2.5 font-normal">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund & Access Policy</Link></li>
              <li><Link to="/license" className="hover:text-white transition-colors">Software License Agreement</Link></li>
              <li><Link to="/ip-complaint" className="hover:text-white transition-colors">IP & Copyright Notice</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-gray-500">
            <Shield className="w-4 h-4 text-primary-400" />
            <span>© {new Date().getFullYear()} {BRAND.legal.companyName}. All rights reserved.</span>
          </div>
          <p className="text-gray-500 flex items-center space-x-1">
            <span>Designed for CS/IT developers & students.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
