import { Router } from 'express';
import { getMyPurchases, getMyDownloadHistory } from '../controllers/entitlement.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/purchases', authenticate, getMyPurchases);
router.get('/downloads', authenticate, getMyDownloadHistory);

export default router;
