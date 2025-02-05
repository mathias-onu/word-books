import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { 
        path: 'order', 
        loadComponent: () => import('./components/order/order.component').then(m => m.OrderComponent),
        pathMatch: 'full'
    },
    { 
        path: 'admin', 
        loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
        pathMatch: 'full'
    }
];
