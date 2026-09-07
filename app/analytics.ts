export const GA_MEASUREMENT_ID = 'G-54WWFECCE5';

type EventParameters = Readonly<Record<string, string | number | boolean>>;

declare global {
  interface Window {
    gtag?: (...args: readonly unknown[]) => void;
  }
}

export function trackEvent(name: string, parameters: EventParameters = {}): void {
  window.gtag?.('event', name, parameters);
}
