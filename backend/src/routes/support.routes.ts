import { Router } from 'express';
import { createSupportTicket, getMySupportTickets, replySupportTicket } from '../controllers/support.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/support/tickets', optionalAuthenticate, createSupportTicket);
router.get('/support/tickets', authenticate, getMySupportTickets);
router.post('/support/tickets/:id/reply', authenticate, replySupportTicket);

export default router;
