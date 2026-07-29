import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { AnalyticsService } from '../../services/analytics.service';
import * as Sentry from '@sentry/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule, MatCardModule, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loading = signal(false);
  private authService = inject(AuthService);
  private analyticsService = inject(AnalyticsService);

  onLogin(): void {
    this.loading.set(true);
    this.authService
      .login()
      .then(() => {
        const user = this.authService.getUser();
        if (user && user.email) {
          this.analyticsService.sendEvent('login', { email: user.email });
          Sentry.setUser({ email: user.email });
          throw new Error(
            'Error forzado luego del inicio de sesión exitoso. Usuario: ' + user.email,
          );
        }
      })
      .finally(() => this.loading.set(false));
  }
}
