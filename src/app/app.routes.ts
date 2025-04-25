import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AUTH_ROUTES } from './auth/auth.routes';
import { USER_ROUTES } from './user/user.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: AUTH_ROUTES
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        children: USER_ROUTES
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
