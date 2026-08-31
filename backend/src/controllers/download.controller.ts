import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import Entitlement from '../models/Entitlement';
import Download from '../models/Download';
import Product from '../models/Product';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middlewares/auth.middleware';

const SIGNED_URL_SECRET = process.env.JWT_SECRET || 'projectforge_super_secret_jwt_key_2026_change_in_production';

export const requestDownloadToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { productId } = req.params;

    // 1. Verify Entitlement ownership
    const entitlement = await Entitlement.findOne({
      user: req.user.id,
      product: productId,
      isRevoked: false,
    }).populate('product');

    if (!entitlement) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You do not own an active entitlement for this product package.',
      });
      return;
    }

    // 2. Check download limit
    if (entitlement.downloadCount >= entitlement.maxDownloads) {
      res.status(403).json({
        success: false,
        message: `Download limit reached (${entitlement.maxDownloads} downloads used). Please contact support to reset access.`,
      });
      return;
    }

    const product = entitlement.product as any;
    if (!product) {
      res.status(404).json({ success: false, message: 'Associated product package missing.' });
      return;
    }

    // 3. Generate short-lived signed download token (expires in 15 mins)
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const downloadPayload = `${req.user.id}:${product._id}:${entitlement._id}:${expiresAt}`;
    const hmac = crypto.createHmac('sha256', SIGNED_URL_SECRET).update(downloadPayload).digest('hex');
    
    const signedToken = Buffer.from(JSON.stringify({
      userId: req.user.id,
      productId: product._id,
      entitlementId: entitlement._id,
      expiresAt,
      sig: hmac,
    })).toString('base64url');

    const downloadUrl = `/api/downloads/file/${signedToken}`;

    res.status(200).json({
      success: true,
      downloadUrl,
      expiresInMinutes: 15,
    });
  } catch (error: any) {
    console.error('[DOWNLOAD REQUEST ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to generate secure download authorization.' });
  }
};

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

    const { userId, productId, entitlementId, expiresAt, sig } = payload;

    // Check expiration
    if (Date.now() > expiresAt) {
      res.status(410).send('Download authorization link has expired. Please request a new link from My Purchases.');
      return;
    }

    // Re-calculate HMAC signature
    const expectedPayload = `${userId}:${productId}:${entitlementId}:${expiresAt}`;
    const expectedSig = crypto.createHmac('sha256', SIGNED_URL_SECRET).update(expectedPayload).digest('hex');

    if (sig !== expectedSig) {
      res.status(403).send('Tampered download token signature rejected.');
      return;
    }

    // Fetch Entitlement & Product
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

    // Resolve zip file key
    const fileKey = product.deliverables[0]?.fileKey || 'packages/sample-project.zip';
    const filePath = path.resolve(__dirname, '../../storage/protected', fileKey);

    if (!fs.existsSync(filePath)) {
      console.warn(`[STORAGE WARNING] File not found on disk at: ${filePath}. Creating fallback package zip.`);
      const storageDir = path.dirname(filePath);
      if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
      fs.writeFileSync(filePath, `PK\x03\x04 - ProjectForge Deliverable Package for ${product.title}\nIncludes Source Code, PPT, Documentation & Viva QA.`);
    }

    // Update entitlement download count & log Audit download entry
    entitlement.downloadCount += 1;
    await entitlement.save();

    const userAgentStr = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'].join(' ')
      : req.headers['user-agent'] || 'Browser';

    await Download.create({
      user: userId,
      product: productId,
      entitlement: entitlementId,
      versionDownloaded: entitlement.purchasedVersion || '1.0.0',
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      userAgent: userAgentStr,
    });

    await AuditLog.create({
      user: userId,
      action: 'FILE_DOWNLOADED',
      details: { productTitle: product.title, fileKey, downloadCount: entitlement.downloadCount },
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
    });

    // Stream file with secure disposition headers
    const safeFilename = `${product.slug}-v${product.currentVersion}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error('[SERVE FILE ERROR]', error);
    res.status(500).send('Internal server error streaming file.');
  }
};
