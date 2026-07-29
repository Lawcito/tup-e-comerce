import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-info-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <mat-dialog-content>
      <div class="dialog-logo">
        <img src="assets/logo_clocknails.png" alt="Logo de Clock Nails" />
      </div>
      <h2 mat-dialog-title>{{ appName }}</h2>
      <p class="app-version">{{ 'appInfoDialog.version' | translate }}: {{ appVersion }}</p>
      <p class="user-agent-label">{{ 'appInfoDialog.userAgent' | translate }}</p>
      <p class="user-agent">{{ userAgent }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="onClose()">
        {{ 'appInfoDialog.close' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        text-align: center;
        padding-top: 24px;
      }
      .dialog-logo img {
        width: 64px;
        height: 64px;
        object-fit: contain;
      }
      h2 {
        margin: 12px 0 4px;
        font-size: 20px;
      }
      .app-version {
        color: rgba(0, 0, 0, 0.6);
        margin: 0 0 12px;
      }
      .user-agent-label {
        font-size: 13px;
        font-weight: 600;
        margin: 12px 0 4px;
        color: rgba(0, 0, 0, 0.6);
      }
      .user-agent {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.5);
        word-break: break-all;
        margin: 0;
      }
      mat-dialog-actions {
        padding: 16px 24px;
      }
    `,
  ],
})
export class AppInfoDialogComponent {
  private dialogRef = inject(MatDialogRef<AppInfoDialogComponent>);

  appName = 'Clocknails';
  appVersion = '1.0.0';
  userAgent = navigator.userAgent;

  onClose(): void {
    this.dialogRef.close();
  }
}
