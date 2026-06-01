type AnalyticsEvent = 'resume_started' | 'resume_completed' | 'download_clicked' | 'payment_initiated' | 'payment_success' | 'language_changed';

interface WindowWithGtag extends Window {
  gtag?: (command: string, ...args: unknown[]) => void;
}

let isInitialized = false;

export const initGA = () => {
  if (typeof window === "undefined") return;

  const win = window as unknown as WindowWithGtag;

  // Respect index.html static script tag if already loaded
  if (win.gtag) {
    isInitialized = true;
    return;
  }

  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-PGWJLPG7DQ";
  if (!measurementId || measurementId === "G-XXXXXXXXXX" || isInitialized) return;

  // Dynamically inject Google Analytics script tags only if a valid measurement ID is set
  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      send_page_view: false
    });
  `;
  document.head.appendChild(script2);
  
  isInitialized = true;
  console.log(`[Analytics] Google Analytics dynamically initialized with: ${measurementId}`);
};

export const trackPageView = (path: string) => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-PGWJLPG7DQ";
  if (!measurementId || measurementId === "G-XXXXXXXXXX" || typeof window === "undefined") return;

  const win = window as unknown as WindowWithGtag;
  if (win.gtag) {
    win.gtag('config', measurementId, {
      page_path: path
    });
    console.log(`[Analytics] PageView tracked: ${path}`);
  }
};

export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, unknown>) => {
  console.log(`[Analytics] ${event}`, properties);
  
  const win = window as unknown as WindowWithGtag;
  if (typeof window !== "undefined" && win.gtag) {
    win.gtag("event", event, properties);
  }
};
