import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService, AuthUser } from '../../services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ConfirmLogoutDialogComponent } from '../../components/dialog-logout/dialog-logout';
import i18next from '../../i18n';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  user = signal<AuthUser | null>(null);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  savedData = this.loadSavedData();

  constructor() {
    onAuthStateChanged(getAuth(), (firebaseUser) => {
      if (firebaseUser) {
        this.user.set({
          displayName: firebaseUser.displayName ?? i18next.t('common.user'),
          email: firebaseUser.email ?? '',
          photoURL: firebaseUser.photoURL, // ← agregar
        });
      } else {
        this.user.set(null);
      }
    });
  }

  getUser() {
    return this.user();
  }

  openLogoutConfirm(): void {
    const dialogRef = this.dialog.open(ConfirmLogoutDialogComponent, {
      width: '360px',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }

  private loadSavedData(): { birthDate: string; phones: string[]; addresses: string[] } | null {
    try {
      const raw = localStorage.getItem('account-settings');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
