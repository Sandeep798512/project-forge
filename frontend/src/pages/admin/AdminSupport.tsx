import React, { useState, useEffect } from 'react';
import { Headphones, Send, MessageSquare } from 'lucide-react';
import api from '../../services/api';

export const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/support/tickets');
      if (res.data.success) {
        setTickets(res.data.tickets);
        if (res.data.tickets.length > 0) setActiveTicket(res.data.tickets[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        fetchTickets();
      }
    } catch (err: any) {
      alert('Error sending reply');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Support Ticket Resolution Workspace</h1>
        <p className="text-gray-400 text-xs mt-1">Review student support tickets, error tracebacks, and reply to technical inquiries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Ticket List */}
        <div className="bg-surface/90 border border-border/80 rounded-2xl p-4 space-y-2">
          <h3 className="font-bold text-xs uppercase text-gray-400">Customer Tickets</h3>

          {loading ? (
            <div className="text-xs text-gray-400 p-4">Loading tickets...</div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {tickets.map((t) => (
                <button
                  key={t._id}
                  onClick={() => setActiveTicket(t)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    activeTicket?._id === t._id
                      ? 'bg-primary-600/20 border-primary-500/40 text-white'
                      : 'bg-background border-border/60 text-gray-300 hover:border-primary-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-primary-400 font-bold">{t.ticketId}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">{t.status}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs mt-1 truncate">{t.subject}</h4>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reply Thread */}
        <div className="md:col-span-2 bg-surface/90 border border-border/80 rounded-2xl p-6 flex flex-col justify-between min-h-[450px]">
          {activeTicket ? (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                <div className="pb-3 border-b border-border/60 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-primary-400 font-bold">{activeTicket.ticketId}</span>
                    <h3 className="font-bold text-base text-white">{activeTicket.subject}</h3>
                  </div>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {activeTicket.messages.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs ${
                        m.sender === 'user' ? 'bg-background border border-border/60' : 'bg-primary-600/20 border border-primary-500/30 text-white'
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-bold">{m.senderName} ({m.sender.toUpperCase()})</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="whitespace-pre-line text-xs">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendReply} className="pt-3 border-t border-border flex space-x-2">
                <input
                  type="text"
                  placeholder="Write official admin response..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-gray-100"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
              Select a ticket to open conversation workspace.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
