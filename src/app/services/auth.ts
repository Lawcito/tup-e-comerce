import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import i18next from '../i18n';

const firebaseConfig = {
  apiKey: 'AIzaSyDdSGd2cM2JemXn7ahXzyJs6bCqvMikIxw',
  authDomain: 'tup-e-comerce.firebaseapp.com',
  projectId: 'tup-e-comerce',
  storageBucket: 'tup-e-comerce.firebasestorage.app',
  messagingSenderId: '376739417761',
  appId: '1:376739417761:web:e0821a510a273fd21baae0',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export interface AuthUser {
  displayName: string;
  email: string;
  photoURL: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatePromise: Promise<void>;
  private router = inject(Router);
  private zone = inject(NgZone);

  constructor() {
    this.authStatePromise = new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve();
        this.zone.run(() => {
          if (user) {
            if (this.router.url === '/login') {
              this.router.navigate(['/items']);
            }
          } else {
            this.router.navigate(['/login']);
          }
        });
      });
    });
  }

  isAuthenticated(): Promise<boolean> {
    return this.authStatePromise.then(() => {
      return auth.currentUser !== null;
    });
  }

  login(): Promise<void> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).then(() => undefined);
  }

  logout(): Promise<void> {
    return signOut(auth);
  }

  isLoggedIn(): boolean {
    return auth.currentUser !== null;
  }

  getUser(): AuthUser | null {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      displayName: user.displayName ?? i18next.t('common.user'),
      email: user.email ?? '',
      photoURL: user.photoURL,
    };
  }
}
