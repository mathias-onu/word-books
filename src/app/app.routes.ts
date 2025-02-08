import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'order', pathMatch: 'full' },
    { 
        path: 'login', 
        loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
        pathMatch: 'full'
    },
    { 
        path: 'order', 
        loadComponent: () => import('./components/order/order.component').then(c => c.OrderComponent),
        pathMatch: 'full'
    },
    { 
        path: 'admin', 
        loadComponent: () => import('./components/admin/admin.component').then(c => c.AdminComponent),
        pathMatch: 'full',
        canActivate: [AuthGuard]
    }
];
