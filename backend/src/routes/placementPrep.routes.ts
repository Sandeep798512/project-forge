import { Router } from 'express';
import {
  getPublicPlacementPrep,
  getPlacementPrepBySlug,
  getAdminPlacementPrep,
  createPlacementPrep,
  updatePlacementPrep,
  deletePlacementPrep,
} from '../controllers/placementPrep.controller';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/placement-prep', getPublicPlacementPrep);
router.get('/placement-prep/:slug', optionalAuthenticate, getPlacementPrepBySlug);

// Admin Protected Routes
router.get('/admin/placement-prep', authenticate, requireAdmin, getAdminPlacementPrep);
router.post('/admin/placement-prep', authenticate, requireAdmin, createPlacementPrep);
router.put('/admin/placement-prep/:id', authenticate, requireAdmin, updatePlacementPrep);
router.delete('/admin/placement-prep/:id', authenticate, requireAdmin, deletePlacementPrep);

export default router;
