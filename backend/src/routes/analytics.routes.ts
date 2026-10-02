import { Router } from 'express';
import { trackAnalyticsEvent } from '../controllers/analytics.controller';
import { optionalAuthenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/analytics/event', optionalAuthenticate, trackAnalyticsEvent);

export default router;
