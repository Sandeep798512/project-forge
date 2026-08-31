import { Response } from 'express';
import SupportTicket from '../models/SupportTicket';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createSupportTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { subject, description, priority, orderId, productId } = req.body;

    if (!subject || !description) {
      res.status(400).json({ success: false, message: 'Subject and description are required.' });
      return;
    }

    const ticketId = `TCK-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const ticket = await SupportTicket.create({
      ticketId,
      user: req.user.id,
      order: orderId || undefined,
      product: productId || undefined,
      subject,
      description,
      priority: priority || 'medium',
      status: 'open',
      messages: [
        {
          sender: 'user',
          senderName: req.user.name,
          message: description,
          createdAt: new Date(),
        },
      ],
    });

    await AuditLog.create({
      user: req.user.id,
      action: 'SUPPORT_TICKET_CREATED',
      details: { ticketId, subject },
    });

    res.status(201).json({ success: true, ticket });
  } catch (error: any) {
    console.error('[CREATE TICKET ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to create support ticket' });
  }
};

export const getMySupportTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const tickets = await SupportTicket.find({ user: req.user.id })
      .populate('product', 'title slug thumbnail')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

export const replySupportTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: 'Message content is required.' });
      return;
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Support ticket not found.' });
      return;
    }

    const senderRole = req.user.role === 'admin' ? 'admin' : 'user';

    ticket.messages.push({
      sender: senderRole,
      senderName: req.user.name,
      message,
      createdAt: new Date(),
    });

    ticket.status = senderRole === 'admin' ? 'waiting_for_customer' : 'in_progress';
    await ticket.save();

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add reply to ticket' });
  }
};
