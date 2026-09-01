import { Response } from 'express';
import Entitlement from '../models/Entitlement';
import Download from '../models/Download';
import ProductAsset from '../models/ProductAsset';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getMyPurchases = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const entitlements = await Entitlement.find({
      user: req.user.id,
      isRevoked: false,
    })
      .populate('product')
      .populate('order', 'orderId finalAmount status createdAt')
      .sort({ grantedAt: -1 });

    // Populate active ProductAssets for each product
    const purchasesWithAssets = await Promise.all(
      entitlements.map(async (item) => {
        const itemObj = item.toObject();
        if (itemObj.product) {
          const assets = await ProductAsset.find({
            product: (itemObj.product as any)._id,
            isActive: true,
          }).select('title assetType originalName mimeType size downloadCount');
          (itemObj.product as any).assets = assets;
        }
        return itemObj;
      })
    );

    res.status(200).json({
      success: true,
      purchases: purchasesWithAssets,
    });
  } catch (error) {
    console.error('[GET PURCHASES ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer purchases' });
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
      .populate('asset', 'title assetType originalName')
      .sort({ downloadedAt: -1 });

    res.status(200).json({ success: true, downloads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch download history' });
  }
};
