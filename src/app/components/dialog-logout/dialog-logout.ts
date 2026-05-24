import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-logout-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <mat-dialog-content>
      <div class="dialog-icon">
        <mat-icon color="warn">logout</mat-icon>
      </div>
      <h2 mat-dialog-title>¿Cerrar sesión?</h2>
      <p>¿Estás seguro de que querés salir de tu cuenta?</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        Cerrar sesión
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      text-align: center;
      padding-top: 24px;
    }
    .dialog-icon mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
    }
    h2 {
      margin: 12px 0 8px;
      font-size: 20px;
    }
    p {
      color: rgba(0,0,0,0.6);
      margin: 0;
    }
    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class ConfirmLogoutDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmLogoutDialogComponent>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}