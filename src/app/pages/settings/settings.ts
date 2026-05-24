import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService, AuthUser } from '../../services/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ConfirmLogoutDialogComponent } from '../../components/dialog-logout/dialog-logout';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  user = signal<AuthUser | null>(null);
  private dialog = inject(MatDialog);

  constructor(private authService: AuthService) {
    onAuthStateChanged(getAuth(), (firebaseUser) => {
      if (firebaseUser) {
        this.user.set({
          displayName: firebaseUser.displayName ?? 'Usuario',
          email: firebaseUser.email ?? ''
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
}