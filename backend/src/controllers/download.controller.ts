import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import User from '../models/User';
import Entitlement from '../models/Entitlement';
import Download from '../models/Download';
import Product from '../models/Product';
import ProductAsset from '../models/ProductAsset';
import AuditLog from '../models/AuditLog';
import { storageService } from '../utils/storage.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const SIGNED_URL_SECRET = process.env.JWT_SECRET || 'projectforge_super_secret_jwt_key_2026_change_in_production';

/**
 * Legacy download token request
 */
export const requestDownloadToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { productId } = req.params;

    const entitlement = await Entitlement.findOne({
      user: req.user.id,
      product: productId,
      isRevoked: false,
    });

    if (!entitlement) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You do not own an active entitlement for this product package.',
      });
      return;
    }

    if (entitlement.downloadCount >= entitlement.maxDownloads) {
      res.status(403).json({
        success: false,
        message: `Download limit reached (${entitlement.maxDownloads} downloads used). Please contact support.`,
      });
      return;
    }

    const expiresAt = Date.now() + 15 * 60 * 1000;
    const downloadPayload = `${req.user.id}:${productId}:${entitlement._id}:main:${expiresAt}`;
    const hmac = crypto.createHmac('sha256', SIGNED_URL_SECRET).update(downloadPayload).digest('hex');

    const signedToken = Buffer.from(
      JSON.stringify({
        userId: req.user.id,
        productId,
        entitlementId: entitlement._id,
        assetId: null,
        storageKey: 'packages/sample-project.zip',
        expiresAt,
        sig: hmac,
      })
    ).toString('base64url');

    res.status(200).json({
      success: true,
      downloadUrl: `/api/downloads/file/${signedToken}`,
      expiresInMinutes: 15,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to generate download link.' });
  }
};

/**
 * Generates short-lived (15-min) signed token for target asset
 */
export const requestAssetDownload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { productId, assetId } = req.params;

    // 1. Verify Entitlement ownership & active status
    const entitlement = await Entitlement.findOne({
      user: req.user.id,
      product: productId,
      isRevoked: false,
    });

    if (!entitlement) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You do not own an active entitlement for this product package.',
      });
      return;
    }

    // 2. Verify entitlement download limit
    if (entitlement.downloadCount >= entitlement.maxDownloads) {
      res.status(403).json({
        success: false,
        message: `Download limit reached (${entitlement.maxDownloads} downloads used). Please contact support to reset access.`,
      });
      return;
    }

    // 3. Verify asset exists & is active
    let asset: any = null;
    if (assetId && assetId !== 'default') {
      asset = await ProductAsset.findOne({ _id: assetId, product: productId, isActive: true });
    }

    const storageKey = asset ? asset.storageKey : 'packages/sample-project.zip';

    // 4. Generate short-lived HMAC signed token (expires in 15 mins)
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const downloadPayload = `${req.user.id}:${productId}:${entitlement._id}:${asset?._id || 'main'}:${expiresAt}`;
    const hmac = crypto.createHmac('sha256', SIGNED_URL_SECRET).update(downloadPayload).digest('hex');

    const signedToken = Buffer.from(
      JSON.stringify({
        userId: req.user.id,
        productId,
        entitlementId: entitlement._id,
        assetId: asset?._id || null,
        storageKey,
        expiresAt,
        sig: hmac,
      })
    ).toString('base64url');

    const downloadUrl = `/api/downloads/file/${signedToken}`;

    res.status(200).json({
      success: true,
      downloadUrl,
      assetType: asset?.assetType || 'SOURCE_CODE',
      mimeType: asset?.mimeType || 'application/zip',
      expiresInMinutes: 15,
    });
  } catch (error: any) {
    console.error('[DOWNLOAD REQUEST ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to generate secure download authorization.' });
  }
};

/**
 * Streams protected file to authenticated customer with signed token
 */
export const serveProtectedFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rawToken = req.params.token;

    if (!rawToken || typeof rawToken !== 'string') {
      res.status(400).send('Invalid download token');
      return;
    }

    // Decode & verify token
    let payload: any;
    try {
      const decodedJson = Buffer.from(rawToken, 'base64url').toString('utf8');
      payload = JSON.parse(decodedJson);
    } catch (e) {
      res.status(400).send('Malformed download token');
      return;
    }

    const { userId, productId, entitlementId, assetId, storageKey, expiresAt, sig } = payload;

    // Check expiration
    if (Date.now() > expiresAt) {
      res.status(410).send('Download authorization link has expired. Please request a new link from My Purchases.');
      return;
    }

    // Re-verify HMAC signature
    const expectedPayload = `${userId}:${productId}:${entitlementId}:${assetId || 'main'}:${expiresAt}`;
    const expectedSig = crypto.createHmac('sha256', SIGNED_URL_SECRET).update(expectedPayload).digest('hex');

    if (sig !== expectedSig) {
      res.status(403).send('Tampered download token signature rejected.');
      return;
    }

    // Verify user exists and is not suspended
    const user = await User.findById(userId);
    if (!user || user.isSuspended) {
      res.status(403).send('User account no longer exists or is suspended.');
      return;
    }

    // Fetch Entitlement
    const entitlement = await Entitlement.findById(entitlementId);
    if (!entitlement || entitlement.isRevoked) {
      res.status(403).send('Entitlement revoked or missing.');
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).send('Product package unavailable.');
      return;
    }

    let asset: any = null;
    if (assetId) {
      asset = await ProductAsset.findById(assetId);
    }

    const finalStorageKey = storageKey || asset?.storageKey || 'packages/sample-project.zip';
    const filePath = storageService.getAbsolutePath(finalStorageKey);

    // If file missing on disk, generate fallback deliverable file
    if (!fs.existsSync(filePath)) {
      console.warn(`[STORAGE WARNING] File not found on disk at: ${filePath}. Creating fallback deliverable.`);
      const storageDir = path.dirname(filePath);
      if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

      if (finalStorageKey.endsWith('.pdf')) {
        fs.writeFileSync(filePath, `%PDF-1.4\n% ProjectForge Official Deliverable: ${asset?.title || product.title}\nIncludes Documentation & Setup Guide.`);
      } else {
        fs.writeFileSync(filePath, `PK\x03\x04 - ProjectForge Deliverable Package for ${product.title}\nIncludes Source Code, PPT, Documentation & Viva QA.`);
      }
    }

    // Increment download counts
    entitlement.downloadCount += 1;
    await entitlement.save();

    if (asset) {
      asset.downloadCount += 1;
      await asset.save();
    }

    const userAgentStr = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'].join(' ')
      : req.headers['user-agent'] || 'Browser';

    // Record Download log
    await Download.create({
      user: userId,
      product: productId,
      entitlement: entitlementId,
      asset: asset?._id,
      assetType: asset?.assetType || 'SOURCE_CODE',
      versionDownloaded: entitlement.purchasedVersion || '1.0.0',
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      userAgent: userAgentStr,
      status: 'success',
    });

    await AuditLog.create({
      user: userId,
      action: 'FILE_DOWNLOADED',
      details: { productTitle: product.title, assetTitle: asset?.title || product.title, storageKey: finalStorageKey },
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
    });

    // Detect MIME type and Header Disposition
    const mimeType = asset?.mimeType || storageService.detectMimeType(finalStorageKey);
    const filename = asset?.originalName || `${product.slug}-v${product.currentVersion}.zip`;

    res.setHeader('Content-Type', mimeType);

    if (mimeType === 'application/pdf') {
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error('[SERVE FILE ERROR]', error);
    res.status(500).send('Internal server error streaming file.');
  }
};
