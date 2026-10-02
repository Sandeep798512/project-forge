import api from './api';

export type EventName =
  | 'page_view'
  | 'project_view'
  | 'demo_click'
  | 'buy_click'
  | 'checkout_started'
  | 'payment_success'
  | 'payment_failed'
  | 'download_started'
  | 'whatsapp_clicked';

export const trackEvent = async (eventName: EventName, properties?: Record<string, any>) => {
  try {
    const productId = properties?.productId || properties?.id;
    await api.post('/analytics/event', {
      eventType: eventName,
      productId: productId || undefined,
      metadata: properties || undefined,
    });
  } catch (err) {
    // Fail silently so user interaction is never broken
  }
};
