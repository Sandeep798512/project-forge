import { Response } from 'express';
import AnalyticsEvent from '../models/AnalyticsEvent';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Public API to record real user interaction analytics events
 */
export const trackAnalyticsEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventType, productId, metadata } = req.body;

    if (!eventType) {
      res.status(400).json({ success: false, message: 'eventType is required' });
      return;
    }

    const userAgentStr = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'].join(' ')
      : req.headers['user-agent'] || 'Browser';

    await AnalyticsEvent.create({
      eventType,
      product: productId || undefined,
      user: req.user?.id || undefined,
      metadata: metadata || undefined,
      ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
      userAgent: userAgentStr,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    // Fail gracefully so client browsing is never interrupted
    console.error('[ANALYTICS TRACK ERROR]', error);
    res.status(200).json({ success: true });
  }
};
