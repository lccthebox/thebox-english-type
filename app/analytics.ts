export const GA_MEASUREMENT_ID = 'G-CHZDT11MK6';

type EventParameters = Readonly<Record<string, string | number | boolean>>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: readonly unknown[]) => void;
  }
}

export function initializeAnalytics(): void {
  if (window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args) => window.dataLayer?.push(args);
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackEvent(name: string, parameters: EventParameters = {}): void {
  window.gtag?.('event', name, parameters);
}
