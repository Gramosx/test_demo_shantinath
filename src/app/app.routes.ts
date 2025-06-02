import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout.component';
import { LoginComponent } from './auth/components/login.component';
import { UserRole } from './core/types/enums';
import { tenderStatsResolver, tenderListResolver, tenderDetailResolver } from './core/resolvers/tender.resolver';

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
            },
            {
                path: '',
                redirectTo: 'tenders',
                pathMatch: 'full'
            },
            {
                path: 'tenders',
                loadComponent: () => import('./features/tender/list/tender-list.component').then(m => m.TenderListComponent),
                resolve: {
                    tenders: tenderListResolver,
                    stats: tenderStatsResolver
                }
            },
            {
                path: 'tenders/new',
                loadComponent: () => import('./features/tender/form/tender-form.component').then(m => m.TenderFormComponent)
            },
            {
                path: 'tenders/:id',
                loadComponent: () => import('./features/tender/detail/tender-detail.component').then(m => m.TenderDetailComponent),
                resolve: {
                    tender: tenderDetailResolver
                }
            },
            {
                path: 'tenders/:id/edit',
                loadComponent: () => import('./features/tender/form/tender-form.component').then(m => m.TenderFormComponent),
                resolve: {
                    tender: tenderDetailResolver
                }
            },
            {
                path: 'users',
                loadComponent: () => import('./features/user/list/user-list.component').then(m => m.UserListComponent)
            },
            {
                path: 'users/new',
                loadComponent: () => import('./features/user/form/user-form.component').then(m => m.UserFormComponent)
            },
            {
                path: 'users/:id/edit',
                loadComponent: () => import('./features/user/form/user-form.component').then(m => m.UserFormComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
