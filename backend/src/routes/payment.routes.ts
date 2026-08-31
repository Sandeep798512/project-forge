import { Router } from 'express';
import { createPaymentOrder, verifyPaymentSignature, handleRazorpayWebhook } from '../controllers/payment.controller';
import { validateCoupon } from '../controllers/coupon.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/payments/create-order', authenticate, createPaymentOrder);
router.post('/payments/verify', authenticate, verifyPaymentSignature);
router.post('/webhooks/razorpay', handleRazorpayWebhook);
router.post('/coupons/validate', validateCoupon);

export default router;
