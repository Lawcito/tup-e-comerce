import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule, MatCardModule, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loading = signal(false);
  private authService = inject(AuthService);

  onLogin(): void {
    this.loading.set(true);
    this.authService.login().finally(() => this.loading.set(false));
  }
}
