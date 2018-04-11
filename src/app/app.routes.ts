import { Routes } from '@angular/router';
import * as pages from './pages/';

export const ROUTES: Routes = [
  { path: 'login', component: pages.LoginComponent },
  {
    path: '',
    component: pages.HomeComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'settings', component: pages.SettingsComponent },
      { path: 'variables', component: pages.VariablesComponent }
    ]
  },
  { path: '**', component: pages.NoContentComponent },
];
