import { Router } from 'express';
import {
  getPublicStudyMaterials,
  downloadFreeStudyMaterial,
  getAdminStudyMaterials,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
} from '../controllers/studyMaterial.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/study-materials', getPublicStudyMaterials);
router.get('/study-materials/:id/download', downloadFreeStudyMaterial);

// Admin Protected Routes
router.get('/admin/study-materials', authenticate, requireAdmin, getAdminStudyMaterials);
router.post('/admin/study-materials', authenticate, requireAdmin, createStudyMaterial);
router.put('/admin/study-materials/:id', authenticate, requireAdmin, updateStudyMaterial);
router.delete('/admin/study-materials/:id', authenticate, requireAdmin, deleteStudyMaterial);

export default router;
