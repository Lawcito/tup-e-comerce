import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { MainLayoutComponent } from './components/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'items',
        loadComponent: () => import('./pages/items/items').then((m) => m.Items),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'settings/account',
        loadComponent: () =>
          import('./pages/settings/account-settings/account-settings').then(
            (m) => m.AccountSettings,
          ),
      },
      { path: '', redirectTo: 'items', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
