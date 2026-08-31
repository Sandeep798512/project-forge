import { Response } from 'express';
import crypto from 'crypto';
import Product from '../models/Product';
import Order from '../models/Order';
import Payment from '../models/Payment';
import Entitlement from '../models/Entitlement';
import Coupon from '../models/Coupon';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middlewares/auth.middleware';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_key_secret';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_placeholder';

// Helper: Verify HMAC SHA256 signature
const verifyHmacSignature = (body: string, signature: string, secret: string): boolean => {
  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expectedSig === signature;
};

export const createPaymentOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { productId, couponCode } = req.body;

    // 1. Fetch product & price server-side (NEVER trust frontend price)
    const product = await Product.findById(productId);
    if (!product || !product.isPublished) {
      res.status(404).json({ success: false, message: 'Product package unavailable' });
      return;
    }

    let finalAmount = product.price;
    let discountAmount = 0;
    let appliedCoupon: string | undefined = undefined;

    // 2. Validate Coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (coupon) {
        if (!coupon.expiresAt || coupon.expiresAt > new Date()) {
          if (product.price >= coupon.minOrderAmount) {
            if (coupon.type === 'percentage') {
              discountAmount = Math.round((product.price * coupon.value) / 100);
              if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
              }
            } else {
              discountAmount = coupon.value;
            }
            finalAmount = Math.max(0, product.price - discountAmount);
            appliedCoupon = coupon.code;
          }
        }
      }
    }

    // 3. Create Internal Order record
    const internalOrderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const order = await Order.create({
      orderId: internalOrderId,
      user: req.user.id,
      items: [
        {
          product: product._id,
          title: product.title,
          price: product.price,
        },
      ],
      totalAmount: product.price,
      discountAmount,
      finalAmount,
      couponCode: appliedCoupon,
      status: 'pending',
    });

    // 4. Create Razorpay Order ID (or test mode simulated Razorpay order)
    const razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    const payment = await Payment.create({
      paymentId: `PAY-${Date.now()}`,
      razorpayOrderId,
      order: order._id,
      user: req.user.id,
      amount: finalAmount,
      currency: 'INR',
      status: 'created',
    });

    res.status(200).json({
      success: true,
      orderId: order.orderId,
      razorpayOrderId,
      amount: finalAmount * 100, // Razorpay uses paise
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      product: {
        id: product._id,
        title: product.title,
        price: product.price,
      },
    });
  } catch (error: any) {
    console.error('[CREATE ORDER ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to create checkout order' });
  }
};

export const verifyPaymentSignature = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const payment = await Payment.findOne({ razorpayOrderId }).populate('order');
    if (!payment) {
      res.status(404).json({ success: false, message: 'Associated payment record not found.' });
      return;
    }

    // If using live Razorpay keys, verify HMAC signature: razorpayOrderId + "|" + razorpayPaymentId
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const isSignatureValid =
      RAZORPAY_KEY_SECRET === 'rzp_test_placeholder_key_secret'
        ? true // Test Mode Sandbox verification
        : verifyHmacSignature(text, razorpaySignature, RAZORPAY_KEY_SECRET);

    if (!isSignatureValid) {
      payment.status = 'failed';
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order) {
        order.status = 'failed';
        await order.save();
      }

      res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
      return;
    }

    // Mark Payment Paid
    payment.status = 'paid';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // Mark Order Paid
    const order = await Order.findById(payment.order);
    if (order) {
      order.status = 'paid';
      await order.save();

      // Idempotent Entitlement Creation
      for (const item of order.items) {
        let entitlement = await Entitlement.findOne({
          user: req.user.id,
          product: item.product,
        });

        if (!entitlement) {
          const product = await Product.findById(item.product);
          entitlement = await Entitlement.create({
            user: req.user.id,
            product: item.product,
            order: order._id,
            purchasedVersion: product?.currentVersion || '1.0.0',
            maxDownloads: product?.maxDownloadsAllowed || 20,
          });

          if (product) {
            product.downloadCount += 1;
            await product.save();
          }
        }
      }
    }

    await AuditLog.create({
      user: req.user.id,
      action: 'PAYMENT_VERIFIED',
      details: { razorpayOrderId, razorpayPaymentId, amount: payment.amount },
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Entitlement granted.',
      orderId: order?.orderId,
    });
  } catch (error: any) {
    console.error('[VERIFY PAYMENT ERROR]', error);
    res.status(500).json({ success: false, message: 'Payment verification error' });
  }
};

export const handleRazorpayWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = JSON.stringify(req.body);

    // Verify Webhook Signature if production secret configured
    if (RAZORPAY_WEBHOOK_SECRET !== 'rzp_webhook_secret_placeholder') {
      const isValid = verifyHmacSignature(rawBody, signature, RAZORPAY_WEBHOOK_SECRET);
      if (!isValid) {
        res.status(400).send('Invalid webhook signature');
        return;
      }
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured' || event === 'order.paid') {
      const rzpPaymentObj = payload?.payment?.entity || payload?.order?.entity;
      const razorpayOrderId = rzpPaymentObj?.order_id || rzpPaymentObj?.id;
      const razorpayPaymentId = rzpPaymentObj?.id;

      if (razorpayOrderId) {
        const payment = await Payment.findOne({ razorpayOrderId }).populate('order');
        if (payment && payment.status !== 'paid') {
          payment.status = 'paid';
          payment.razorpayPaymentId = razorpayPaymentId;
          payment.rawWebhookPayload = req.body;
          await payment.save();

          const order = await Order.findById(payment.order);
          if (order && order.status !== 'paid') {
            order.status = 'paid';
            await order.save();

            // Create Entitlement Idempotently
            for (const item of order.items) {
              const existingEntitlement = await Entitlement.findOne({
                user: order.user,
                product: item.product,
              });

              if (!existingEntitlement) {
                const product = await Product.findById(item.product);
                await Entitlement.create({
                  user: order.user,
                  product: item.product,
                  order: order._id,
                  purchasedVersion: product?.currentVersion || '1.0.0',
                  maxDownloads: product?.maxDownloadsAllowed || 20,
                });
              }
            }
          }
        }
      }
    }

    res.status(200).json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('[WEBHOOK ERROR]', error);
    res.status(500).send('Webhook processing error');
  }
};
