import { Response } from 'express';
import Entitlement from '../models/Entitlement';
import Download from '../models/Download';
import Order from '../models/Order';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getMyPurchases = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const entitlements = await Entitlement.find({ user: req.user.id, isRevoked: false })
      .populate({
        path: 'product',
        select: 'title slug shortDescription thumbnail price currentVersion deliverables techStack',
      })
      .populate({
        path: 'order',
        select: 'orderId finalAmount status createdAt',
      })
      .sort({ grantedAt: -1 });

    res.status(200).json({
      success: true,
      purchases: entitlements,
    });
  } catch (error: any) {
    console.error('[GET PURCHASES ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user purchases' });
  }
};

export const getMyDownloadHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const downloads = await Download.find({ user: req.user.id })
      .populate('product', 'title slug thumbnail')
      .sort({ downloadedAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      downloads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch download history' });
  }
};
