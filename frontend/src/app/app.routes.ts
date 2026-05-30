import { Routes } from '@angular/router';
// Ajustamos la ruta al nombre real de tus archivos .ts
import { LoginComponent } from './login/login'; 
import { DashboardComponent } from './dashboard/dashboard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent }
];