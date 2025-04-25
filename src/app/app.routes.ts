import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout.component';
import { LoginComponent } from './auth/components/login.component';
import { UserRole } from './core/types/enums';
import { tenderStatsResolver } from './core/resolvers/tender.resolver';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            { path: 'login', component: LoginComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
                resolve: {
                    stats: tenderStatsResolver
                }
            },
            {
                path: 'organizations',
                loadChildren: () => import('./features/organization/organization.routes').then(m => m.ORGANIZATION_ROUTES)
            },
            {
                path: 'tenders',
                loadChildren: () => import('./features/tender/tender.routes').then(m => m.TENDER_ROUTES)
            },
            {
                path: 'holidays',
                loadChildren: () => import('./features/holiday/holiday.routes').then(m => m.HOLIDAY_ROUTES),
                canActivate: [roleGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])]
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
