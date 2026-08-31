import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: 'Coupon code required' });
      return;
    }

    const coupon = await Coupon.findOne({
      code: String(code).toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
      return;
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      res.status(400).json({ success: false, message: 'Coupon code has expired' });
      return;
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      return;
    }

    const baseAmount = Number(amount) || 0;
    if (baseAmount < coupon.minOrderAmount) {
      res.status(400).json({
        success: false,
        message: `Coupon requires a minimum order amount of ₹${coupon.minOrderAmount}`,
      });
      return;
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((baseAmount * coupon.value) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.value;
    }

    res.status(200).json({
      success: true,
      code: coupon.code,
      discount,
      finalAmount: Math.max(0, baseAmount - discount),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Coupon validation failed' });
  }
};
