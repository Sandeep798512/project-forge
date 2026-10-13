import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, forgotPassword, resetPassword, deleteAccount, updatePassword } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Shared-network friendly general auth limiter (avoids blocking students sharing campus Wi-Fi)
const generalAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 60, // 60 requests per 15 mins per IP across campus networks
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth requests from this network. Please try again in 15 minutes.' },
});

// Dedicated IP limiter for password reset requests (accommodates shared campus NAT routers)
const forgotPasswordIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30, // max 30 requests per IP per 15 mins (individual emails are strictly limited to 3 in controller)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many password reset requests from this network. Please wait 15 minutes before trying again.' },
});

router.post('/register', generalAuthLimiter, register);
router.post('/login', generalAuthLimiter, login);
router.get('/me', authenticate, getMe);
router.delete('/me', authenticate, deleteAccount);
router.post('/forgot-password', forgotPasswordIpLimiter, forgotPassword);
router.post('/reset-password', generalAuthLimiter, resetPassword);
router.put('/update-password', authenticate, updatePassword);

export default router;
