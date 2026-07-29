import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('e-comerce');
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.analyticsService.sendPageView(event.urlAfterRedirects);
      });
  }

  public throwTestError(): void {
    throw new Error('Sentry Test Error');
  }
}
