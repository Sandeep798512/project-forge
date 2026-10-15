import { Router } from 'express';
import {
  getDashboardAnalytics,
  getAdminProducts,
  toggleProductPinAdmin,
  duplicateProduct,
  getProductVersions,
  createProductVersion,
  manageCategoryCrud,
  getAdminCustomers,
  toggleCustomerSuspension,
  getAdminEntitlements,
  toggleEntitlementRevocation,
  updateEntitlementDownloadLimit,
  getAdminDownloadActivity,
  getAdminReviews,
  moderateReview,
  getSiteContentAdmin,
  updateSiteContentAdmin,
  getFunnelAnalytics,
} from '../controllers/admin.enhanced.controller';

import {
  uploadProductAsset,
  getProductAssetsAdmin,
  updateProductAssetAdmin,
  deleteProductAssetAdmin,
} from '../controllers/productAsset.controller';

import {
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

import { authenticate, requireAdmin, requireRbacRole } from '../middlewares/auth.middleware';

const router = Router();

// Require JWT Auth and Admin Role
router.use(authenticate, requireAdmin);

// 1. Dashboard & Analytics
router.get('/analytics/overview', getDashboardAnalytics);
router.get('/analytics/funnel', getFunnelAnalytics);

// 2. Product Management & Duplication & CRUD
router.get('/products/enhanced', getAdminProducts);
router.post('/products', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), createProductAdmin);
router.put('/products/:id', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), updateProductAdmin);
router.delete('/products/:id', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), deleteProductAdmin);
router.patch('/products/:id/pin', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), toggleProductPinAdmin);
router.post('/products/:id/duplicate', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), duplicateProduct);

// 3. Product Asset File Management
router.post('/products/:productId/assets', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), uploadProductAsset);
router.get('/products/:productId/assets', getProductAssetsAdmin);
router.patch('/products/:productId/assets/:assetId', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), updateProductAssetAdmin);
router.delete('/products/:productId/assets/:assetId', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), deleteProductAssetAdmin);

// 4. Product Versioning
router.get('/products/:productId/versions', getProductVersions);
router.post('/products/:productId/versions', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), createProductVersion);

// 5. Categories CRUD
router.all('/categories/crud', manageCategoryCrud);

// 6. Orders & Payments
router.get('/orders/list', getAdminOrders);

// 7. Customers & Suspension
router.get('/customers/list', getAdminCustomers);
router.post('/customers/:customerId/toggle-suspend', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), toggleCustomerSuspension);

// 8. Entitlements
router.get('/entitlements/list', getAdminEntitlements);
router.post('/entitlements/:id/toggle-revoke', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), toggleEntitlementRevocation);
router.post('/entitlements/:id/update-limit', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), updateEntitlementDownloadLimit);

// 9. Downloads & Abuse Monitoring
router.get('/downloads/activity', getAdminDownloadActivity);

// 10. Review Moderation
router.get('/reviews/list', getAdminReviews);
router.post('/reviews/:id/moderate', requireRbacRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), moderateReview);

// 11. CMS & Content Management
router.get('/content', getSiteContentAdmin);
router.put('/content', requireRbacRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), updateSiteContentAdmin);

// 12. Coupons Management
router.get('/coupons/list', getAdminCoupons);
router.post('/coupons', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), createCouponAdmin);
router.patch('/coupons/:id/toggle', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), toggleCouponStatusAdmin);
router.delete('/coupons/:id', requireRbacRole(['SUPER_ADMIN', 'ADMIN']), deleteCouponAdmin);

export default router;
