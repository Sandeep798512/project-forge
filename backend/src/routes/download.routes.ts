import { Router } from 'express';
import { requestDownloadToken, requestAssetDownload, serveProtectedFile } from '../controllers/download.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Protected token request endpoints
router.post('/downloads/:productId/request', authenticate, requestDownloadToken);
router.post('/downloads/:productId/assets/:assetId/request', authenticate, requestAssetDownload);

// Public token file serving endpoint (token is signed and verified via HMAC SHA-256)
router.get('/downloads/file/:token', serveProtectedFile);

export default router;
