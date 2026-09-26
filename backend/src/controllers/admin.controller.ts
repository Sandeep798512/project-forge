import { Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Order from '../models/Order';
import Payment from '../models/Payment';
import User from '../models/User';
import Download from '../models/Download';
import Coupon from '../models/Coupon';
import AuditLog from '../models/AuditLog';
import SupportTicket from '../models/SupportTicket';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getAdminMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalOrders,
      paidOrders,
      totalCustomers,
      totalProducts,
      totalDownloads,
      revenueAggregation,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'paid' }),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Download.countDocuments(),
      Order.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$finalAmount' } } },
      ]),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        paidOrders,
        totalCustomers,
        totalProducts,
        totalDownloads,
        conversionRate: totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : 0,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin metrics' });
  }
};

export const createProductAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    
    if (!productData.title || !productData.slug || !productData.price) {
      res.status(400).json({ success: false, message: 'Title, slug, and price are required.' });
      return;
    }

    const existing = await Product.findOne({ slug: productData.slug });
    if (existing) {
      res.status(409).json({ success: false, message: 'A product with this slug already exists.' });
      return;
    }

    // Auto-calculate discount percentage Flipkart style
    if (productData.originalPrice && productData.price && productData.originalPrice > productData.price) {
      productData.discountPercentage = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
    }

    const product = await Product.create(productData);

    await AuditLog.create({
      user: req.user?.id,
      action: 'ADMIN_PRODUCT_CREATED',
      details: { title: product.title, productId: product._id },
    });

    res.status(201).json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create product' });
  }
};

export const updateProductAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Auto-calculate discount percentage Flipkart style
    if (updateData.originalPrice && updateData.price && updateData.originalPrice > updateData.price) {
      updateData.discountPercentage = Math.round(((updateData.originalPrice - updateData.price) / updateData.originalPrice) * 100);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    await AuditLog.create({
      user: req.user?.id,
      action: 'ADMIN_PRODUCT_UPDATED',
      details: { title: product.title, productId: product._id },
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

export const deleteProductAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    await AuditLog.create({
      user: req.user?.id,
      action: 'ADMIN_PRODUCT_DELETED',
      details: { productId: id },
    });

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

export const getAdminOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin orders' });
  }
};

export const getAdminCoupons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

export const createCouponAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create coupon' });
  }
};

export const toggleCouponStatusAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found' });
      return;
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    await AuditLog.create({
      user: req.user?.id,
      action: coupon.isActive ? 'ADMIN_COUPON_ACTIVATED' : 'ADMIN_COUPON_DEACTIVATED',
      details: { couponCode: coupon.code, couponId: coupon._id, isActive: coupon.isActive },
    });

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} ${coupon.isActive ? 'activated' : 'deactivated'} successfully.`,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update coupon status' });
  }
};

export const deleteCouponAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      res.status(404).json({ success: false, message: 'Coupon not found' });
      return;
    }

    await AuditLog.create({
      user: req.user?.id,
      action: 'ADMIN_COUPON_DELETED',
      details: { couponCode: coupon.code, couponId: id },
    });

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} permanently deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
};

export const getAdminAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
};
