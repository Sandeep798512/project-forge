import { Router } from 'express';
import { requestDownloadToken, serveProtectedFile } from '../controllers/download.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint to request short-lived signed URL token
router.post('/downloads/:productId/request', authenticate, requestDownloadToken);

// Endpoint to download protected zip file using signed token
router.get('/downloads/file/:token', serveProtectedFile);

export default router;
