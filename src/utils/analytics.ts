export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Replace this with Mixpanel, PostHog, or Google Analytics
  console.log(`[Event Tracked] ${eventName}`, properties || {});
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

export const FUNNEL_EVENTS = {
  LANDING_VISIT: 'landing_visit',
  EDITOR_START: 'editor_start',
  TEMPLATE_CHOSEN: 'template_chosen',
  PREVIEW_OPENED: 'preview_opened',
  PAYMENT_CLICK: 'payment_click',
  PAID_DOWNLOAD: 'paid_download',
};
