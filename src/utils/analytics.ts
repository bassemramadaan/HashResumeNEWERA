declare global {
  interface Window {
    gtag?: (command: string, eventName: string, properties?: Record<string, unknown>) => void;
  }
}

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  // Replace this with Mixpanel, PostHog, or Google Analytics
  console.log(`[Event Tracked] ${eventName}`, properties || {});
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
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
