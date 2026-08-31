import { Router } from 'express';
import {
  getAdminMetrics,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getAdminOrders,
  getAdminCoupons,
  createCouponAdmin,
  getAdminAuditLogs,
} from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Protect all admin endpoints with authenticate + requireAdmin
router.use(authenticate, requireAdmin);

router.get('/metrics', getAdminMetrics);
router.post('/products', createProductAdmin);
router.put('/products/:id', updateProductAdmin);
router.delete('/products/:id', deleteProductAdmin);

router.get('/orders', getAdminOrders);
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createCouponAdmin);
router.get('/audit-logs', getAdminAuditLogs);

export default router;
