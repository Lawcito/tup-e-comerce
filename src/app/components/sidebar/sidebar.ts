import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';
import { ConfirmLogoutDialogComponent } from '../../components/dialog-logout/dialog-logout';
import { AppInfoDialogComponent } from '../../components/dialog-app-info/dialog-app-info';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

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

  openAppInfo(): void {
    this.dialog.open(AppInfoDialogComponent, {
      width: '360px',
    });
  }
}
