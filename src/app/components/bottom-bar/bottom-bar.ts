import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth';
import { AppInfoDialogComponent } from '../../components/dialog-app-info/dialog-app-info';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatDialogModule, TranslatePipe],
  templateUrl: './bottom-bar.html',
  styleUrls: ['./bottom-bar.css'],
})
export class BottomBarComponent {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  onLogout(): void {
    this.authService.logout();
  }

  openAppInfo(): void {
    this.dialog.open(AppInfoDialogComponent, {
      width: '360px',
    });
  }
}
