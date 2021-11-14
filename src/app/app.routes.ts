import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WarehouseComponent } from './pages/warehouse/warehouse.component';
import { ConfigComponent } from './pages/config/config.component';

/**
 * Router Setting
 *
 * Write your component (Page) here to load.
 */
export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'dashboard/:user/:sort',
    component: DashboardComponent
  },
  {
    path: 'warehouse',
    component: WarehouseComponent
  },
  {
    path: 'config',
    component: ConfigComponent
  },
];
