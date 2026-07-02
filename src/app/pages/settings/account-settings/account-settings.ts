import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth';

const STORAGE_KEY = 'account-settings';

interface StoredData {
  birthDate: string;
  phones: string[];
  addresses: string[];
}

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings implements OnInit {
  // ─── dependencias ────────────────────────────────────────────────
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // ─── datos de solo lectura ───────────────────────────────────────
  displayName = '';
  email = '';
  photoURL = '';

  // ─── formulario ──────────────────────────────────────────────────
  form!: FormGroup;

  // ─── ciclo de vida ───────────────────────────────────────────────
  ngOnInit(): void {
    const user = this.authService.getUser();
    this.displayName = user?.displayName ?? '';
    this.email = user?.email ?? '';
    this.photoURL = user?.photoURL ?? '';

    // Cargamos datos guardados previamente (si existen)
    const saved = this.loadFromStorage();

    this.form = this.fb.group({
      birthDate: new FormControl<string>(saved?.birthDate ?? ''),
      phones: this.fb.array(
        saved?.phones?.length ? saved.phones.map((p) => this.fb.control(p)) : [this.fb.control('')],
      ),
      addresses: this.fb.array(
        saved?.addresses?.length
          ? saved.addresses.map((a) => this.fb.control(a))
          : [this.fb.control('')],
      ),
    });
  }

  // ─── getters ─────────────────────────────────────────────────────
  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  // ─── teléfonos ───────────────────────────────────────────────────
  addPhone(): void {
    this.phones.push(this.fb.control(''));
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) this.phones.removeAt(index);
  }

  //-----Funcion solo numeros---------------------------------------
  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.key;
    // Permite solo dígitos del 0 al 9
    if (!/[0-9]/.test(charCode)) {
      event.preventDefault();
    }
  }

  // ─── direcciones ─────────────────────────────────────────────────
  addAddress(): void {
    this.addresses.push(this.fb.control(''));
  }

  removeAddress(index: number): void {
    if (this.addresses.length > 1) this.addresses.removeAt(index);
  }

  // ─── guardar ─────────────────────────────────────────────────────
  onSubmit(): void {
    const data: StoredData = {
      birthDate: this.form.value.birthDate ?? '',
      phones: this.form.value.phones ?? [],
      addresses: this.form.value.addresses ?? [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    this.snackBar.open('Datos guardados', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/settings']);
  }

  // ─── cancelar ────────────────────────────────────────────────────
  goBack(): void {
    this.router.navigate(['/settings']);
  }

  // ─── helpers de localStorage ─────────────────────────────────────
  private loadFromStorage(): StoredData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
