type AnalyticsEvent = 'resume_started' | 'resume_completed' | 'download_clicked' | 'payment_initiated' | 'payment_success' | 'language_changed';

let isInitialized = false;

export const initGA = () => {
  if (typeof window === "undefined") return;

  // Respect index.html static script tag if already loaded
  if ((window as any).gtag) {
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

  if ((window as any).gtag) {
    (window as any).gtag('config', measurementId, {
      page_path: path
    });
    console.log(`[Analytics] PageView tracked: ${path}`);
  }
};

export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, any>) => {
  console.log(`[Analytics] ${event}`, properties);
  
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, properties);
  }
};
