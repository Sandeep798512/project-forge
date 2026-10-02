import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle, Send, Mail } from 'lucide-react';
import { BRAND } from '../config/brand.config';
import api from '../services/api';

export const IPComplaint: React.FC = () => {
  const [complainantName, setComplainantName] = useState('');
  const [complainantEmail, setComplainantEmail] = useState('');
  const [complainantPhone, setComplainantPhone] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [infringingUrl, setInfringingUrl] = useState('');
  const [ownershipStatement, setOwnershipStatement] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setStatusMsg(null);

      const payload = {
        name: complainantName.trim(),
        email: complainantEmail.trim(),
        subject: `IP / Copyright Complaint - ${infringingUrl.substring(0, 40)}`,
        category: 'IP_COMPLAINT',
        message: `
COMPLAINANT NAME: ${complainantName}
EMAIL: ${complainantEmail}
PHONE: ${complainantPhone || 'N/A'}
TARGET PRODUCT URL / REF: ${infringingUrl}

DESCRIPTION OF INFRINGED WORK:
${workDescription}

STATEMENT OF OWNERSHIP / AUTHORITY:
${ownershipStatement}
        `.trim(),
      };

      const res = await api.post('/support/tickets', payload);
      if (res.data.success || res.status === 200 || res.status === 201) {
        setStatusMsg({
          type: 'success',
          text: 'Your Intellectual Property Notice has been received. Our review team will investigate the complaint and respond within 24-48 business hours.',
        });
        setComplainantName('');
        setComplainantEmail('');
        setComplainantPhone('');
        setWorkDescription('');
        setInfringingUrl('');
        setOwnershipStatement('');
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || `Failed to submit IP complaint online. Please email your notice directly to ${BRAND.supportEmail}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-gray-300 text-sm leading-relaxed">
        
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Intellectual Property & Copyright Policy</h1>
          </div>
          <p className="text-xs text-gray-400">Last updated: September 10, 2026 • Contact: {BRAND.supportEmail}</p>
        </div>

        {/* Overview Box */}
        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-4">
          <h2 className="text-xl font-bold text-white">Copyright & IP Protection Statement</h2>
          <p>
            {BRAND.name} respects the intellectual property rights of creators, developers, and copyright holders. In accordance with applicable copyright laws, we maintain a neutral review process to investigate and address bona fide notices of alleged copyright or trademark infringement.
          </p>
          <p>
            If you believe in good faith that any package, material, or content hosted on CampusGet infringes upon your copyright or intellectual property rights, please submit a formal IP Complaint using the form below or by emailing <a href={`mailto:${BRAND.supportEmail}`} className="text-primary-400 hover:underline font-semibold">{BRAND.supportEmail}</a>.
          </p>
        </div>

        {/* Complaint Submission Form */}
        <div className="bg-surface/80 p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Mail className="w-5 h-5 text-primary-400" />
            <span>Submit Formal IP / Copyright Complaint</span>
          </h2>

          {statusMsg && (
            <div
              className={`p-4 rounded-xl text-xs flex items-start space-x-3 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">Complainant / Rightsholder Name *</label>
                <input
                  type="text"
                  required
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  placeholder="e.g. John Doe / Original Developer"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Official Contact Email *</label>
                <input
                  type="email"
                  required
                  value={complainantEmail}
                  onChange={(e) => setComplainantEmail(e.target.value)}
                  placeholder="copyright@example.com"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">Contact Phone (Optional)</label>
                <input
                  type="text"
                  value={complainantPhone}
                  onChange={(e) => setComplainantPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-gray-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">CampusGet Product URL / Ref *</label>
                <input
                  type="text"
                  required
                  value={infringingUrl}
                  onChange={(e) => setInfringingUrl(e.target.value)}
                  placeholder="e.g. https://campusget.in/projects/job-portal-hub"
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-gray-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1">Description of Infringed Work / Copyright Ownership *</label>
              <textarea
                rows={3}
                required
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="Identify the copyrighted work claimed to have been infringed, including registration details or original repository link if available."
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-gray-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1">Statement of Ownership / Authorized Representation *</label>
              <textarea
                rows={3}
                required
                value={ownershipStatement}
                onChange={(e) => setOwnershipStatement(e.target.value)}
                placeholder="Please state: 'I state under penalty of perjury that I am the copyright owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.'"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow-sm disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Notice...' : 'Submit Intellectual Property Notice'}</span>
            </button>
          </form>
        </div>

        {/* Workflow steps */}
        <div className="bg-surface/60 p-6 sm:p-8 rounded-2xl border border-border/60 space-y-3 text-xs">
          <h3 className="font-bold text-sm text-white">Investigation & Resolution Workflow</h3>
          <p>Complaints proceed through neutral administrative stages:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center font-mono font-bold">
            <div className="p-2.5 rounded-xl bg-background border border-border text-gray-300">1. RECEIVED</div>
            <div className="p-2.5 rounded-xl bg-background border border-amber-500/30 text-amber-400">2. UNDER_REVIEW</div>
            <div className="p-2.5 rounded-xl bg-background border border-primary-500/30 text-primary-400">3. ACTION_TAKEN</div>
            <div className="p-2.5 rounded-xl bg-background border border-emerald-500/30 text-emerald-400">4. CLOSED</div>
          </div>
        </div>

      </div>
    </div>
  );
};
