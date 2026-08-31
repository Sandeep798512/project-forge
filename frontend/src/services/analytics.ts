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

export const trackEvent = (eventName: EventName, properties?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ANALYTICS EVENT: ${eventName}]`, properties || {});
  }
};
