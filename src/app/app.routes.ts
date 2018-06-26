import { Routes } from '@angular/router';
import * as pages from './pages/';

export const ROUTES: Routes = [
  { path: 'login', component: pages.LoginComponent },
  { path: 'home', component: pages.HomeComponent },
  {
    path: '',
    component: pages.HomeComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'log-book', component: pages.VariablesComponent },
      { path: 'settings', component: pages.SettingsComponent },
      { path: 'variables', component: pages.VariablesComponent },
      { path: 'variables-logs', component: pages.VariablesLogsComponent },
      { path: 'variables-logs/:varname', component: pages.VariablesLogsComponent },
      { path: 'device', component: pages.DeviceComponent },
      { path: 'device/:id', component: pages.DeviceComponent },
      { path: 'device/:id/module', component: pages.ModuleComponent },
      { path: 'device/:id/modules', component: pages.ModulesComponent },
      { path: 'device/:id/module/:moduleId', component: pages.ModuleComponent },
    ]
  },
  { path: '**', component: pages.NoContentComponent },
];
