import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  public sendPageView(url: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as any).gtag;
    if (gtag) {
      console.log('[GA4] Enviando page_view:', url);
      gtag('event', 'page_view', {
        page_path: url,
      });
    } else {
      console.warn('[GA4] gtag no está definido en window.');
    }
  }

  public sendEvent(eventName: string, eventParams: Record<string, unknown> = {}): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as any).gtag;
    if (gtag) {
      console.log(`[GA4] Enviando evento: ${eventName}`, eventParams);
      gtag('event', eventName, eventParams);
    } else {
      console.warn('[GA4] gtag no está definido en window.');
    }
  }
}
