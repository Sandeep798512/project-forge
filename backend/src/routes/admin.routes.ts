import { Router } from 'express';
import {
  getAdminMetrics,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getAdminOrders,
  getAdminCoupons,
  createCouponAdmin,
  toggleCouponStatusAdmin,
  deleteCouponAdmin,
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
router.patch('/coupons/:id/toggle', toggleCouponStatusAdmin);
router.delete('/coupons/:id', deleteCouponAdmin);
router.get('/audit-logs', getAdminAuditLogs);

export default router;
