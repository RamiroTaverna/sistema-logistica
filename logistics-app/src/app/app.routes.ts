import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ShipmentsListComponent } from './components/shipments/shipments-list/shipments-list';
import { ShipmentFormComponent } from './components/shipments/shipment-form/shipment-form';
import { LoginComponent } from './components/auth/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'shipments', component: ShipmentsListComponent, canActivate: [authGuard] },
  { path: 'shipments/new', component: ShipmentFormComponent, canActivate: [authGuard] },
  { path: 'shipments/:id/edit', component: ShipmentFormComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' },
];
