import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Send, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';
import api from '../../services/api';

export const SupportTickets: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [productId, setProductId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tckRes, purRes] = await Promise.all([
        api.get('/support/tickets'),
        api.get('/me/purchases'),
      ]);
      if (tckRes.data.success) setTickets(tckRes.data.tickets);
      if (purRes.data.success) setPurchases(purRes.data.purchases);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/support/tickets', {
        subject,
        description,
        priority,
        productId: productId || undefined,
      });

      if (res.data.success) {
        setModalOpen(false);
        setSubject('');
        setDescription('');
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit ticket');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;

    try {
      const res = await api.post(`/support/tickets/${activeTicket._id}/reply`, {
        message: replyMessage,
      });

      if (res.data.success) {
        setActiveTicket(res.data.ticket);
        setReplyMessage('');
        fetchData();
      }
    } catch (err: any) {
      alert('Error sending reply');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Developer Technical Support</h1>
          <p className="text-gray-400 text-xs mt-1">Submit support tickets tied to your project packages or talk on WhatsApp.</p>
        </div>

        <div className="flex items-center space-x-3">
          <WhatsAppButton variant="inline" label="WhatsApp Helpdesk" />
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-glow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Support Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Ticket List + Conversation View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Ticket List (1/3) */}
        <div className="bg-surface/80 border border-border/80 rounded-2xl p-4 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 px-2">Your Tickets</h3>

          {loading ? (
            <div className="text-xs text-gray-400 p-4">Loading tickets...</div>
          ) : tickets.length > 0 ? (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <button
                  key={t._id}
                  onClick={() => setActiveTicket(t)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                    activeTicket?._id === t._id
                      ? 'bg-primary-600/20 border-primary-500/40 text-white'
                      : 'bg-background border-border/60 text-gray-300 hover:border-primary-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-primary-400 font-bold">{t.ticketId}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      t.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'
                    }`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs mt-1.5 line-clamp-1">{t.subject}</h4>
                  <p className="text-[11px] text-gray-400 mt-1">{new Date(t.updatedAt).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">
              No tickets created yet.
            </div>
          )}
        </div>

        {/* Conversation View (2/3) */}
        <div className="md:col-span-2 bg-surface/80 border border-border/80 rounded-2xl p-6 flex flex-col justify-between min-h-[450px]">
          {activeTicket ? (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div>
                    <span className="font-mono text-xs text-primary-400 font-bold">{activeTicket.ticketId}</span>
                    <h3 className="font-bold text-lg text-white mt-0.5">{activeTicket.subject}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20 uppercase">
                    {activeTicket.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Messages Thread */}
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                  {activeTicket.messages.map((m: any, idx: number) => {
                    const isUser = m.sender === 'user';
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl text-xs space-y-1 ${
                          isUser
                            ? 'bg-background border border-border/60 ml-6 text-gray-200'
                            : 'bg-primary-600/15 border border-primary-500/30 mr-6 text-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                          <span className={isUser ? 'text-gray-300' : 'text-primary-300 font-bold'}>{m.senderName} ({m.sender.toUpperCase()})</span>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="whitespace-pre-line text-xs leading-relaxed">{m.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-border/60 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your response or error traceback..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-gray-100 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-glow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-gray-500" />
              <p className="text-xs">Select a ticket from the left to view the technical discussion thread.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal for Creating New Ticket */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-white">Create Technical Support Ticket</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">Related Project Package</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                >
                  <option value="">General Inquiry</option>
                  {purchases.map((p) => (
                    <option key={p._id} value={p.product?._id}>
                      {p.product?.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Local MongoDB connection issue in AI Resume Analyzer"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Description & Error Traceback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe what error you encountered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-hover border border-border text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
