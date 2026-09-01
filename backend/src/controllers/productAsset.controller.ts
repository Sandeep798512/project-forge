import { Response } from 'express';
import Product from '../models/Product';
import ProductAsset, { AssetType } from '../models/ProductAsset';
import AuditLog from '../models/AuditLog';
import { storageService } from '../utils/storage.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const uploadProductAsset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productIdStr = String(req.params.productId);
    const { assetType, title, fileName, fileBase64, mimeType } = req.body;

    if (!assetType || !title || !fileName || !fileBase64) {
      res.status(400).json({
        success: false,
        message: 'Missing required parameters: assetType, title, fileName, and fileBase64 are required.',
      });
      return;
    }

    const product = await Product.findById(productIdStr);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product package not found.' });
      return;
    }

    const assetTypeStr = Array.isArray(assetType) ? String(assetType[0]) : String(assetType);
    const fileNameStr = Array.isArray(fileName) ? String(fileName[0]) : String(fileName);

    // Decode base64 file buffer
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    const storageKey = storageService.generateKey(productIdStr, assetTypeStr, fileNameStr);
    
    // Upload via StorageService
    const meta = await storageService.uploadAsset(storageKey, fileBuffer);

    // Create ProductAsset document
    const asset = await ProductAsset.create({
      product: productIdStr,
      assetType: assetTypeStr as AssetType,
      title,
      originalName: fileNameStr,
      storageKey,
      mimeType: mimeType || meta.mimeType,
      size: meta.size,
      isActive: true,
    });

    // Link asset reference in Product
    product.assets = product.assets || [];
    product.assets.push(asset._id as any);
    await product.save();

    await AuditLog.create({
      user: req.user?.id,
      action: 'PRODUCT_ASSET_UPLOADED',
      details: { productId: productIdStr, assetTitle: title, assetType: assetTypeStr, storageKey },
    });

    res.status(201).json({ success: true, asset });
  } catch (error: any) {
    console.error('[ASSET UPLOAD ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to upload product asset file' });
  }
};

export const getProductAssetsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productIdStr = String(req.params.productId);
    const assets = await ProductAsset.find({ product: productIdStr }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, assets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product assets' });
  }
};

export const updateProductAssetAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productIdStr = String(req.params.productId);
    const assetIdStr = String(req.params.assetId);
    const { title, isActive, assetType } = req.body;

    const asset = await ProductAsset.findOneAndUpdate(
      { _id: assetIdStr, product: productIdStr },
      { title, isActive, assetType },
      { new: true }
    );

    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }

    res.status(200).json({ success: true, asset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update asset' });
  }
};

export const deleteProductAssetAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productIdStr = String(req.params.productId);
    const assetIdStr = String(req.params.assetId);

    const asset = await ProductAsset.findOne({ _id: assetIdStr, product: productIdStr });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }

    // Delete file from storage
    await storageService.deleteAsset(asset.storageKey);

    // Remove DB record
    await ProductAsset.findByIdAndDelete(assetIdStr);

    // Pull from Product assets array
    await Product.findByIdAndUpdate(productIdStr, { $pull: { assets: assetIdStr } });

    await AuditLog.create({
      user: req.user?.id,
      action: 'PRODUCT_ASSET_DELETED',
      details: { productId: productIdStr, assetId: assetIdStr, storageKey: asset.storageKey },
    });

    res.status(200).json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete asset' });
  }
};
