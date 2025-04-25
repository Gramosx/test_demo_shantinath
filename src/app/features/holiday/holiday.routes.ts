import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/types/enums';

export const HOLIDAY_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./holiday-list.component')
            .then(m => m.HolidayListComponent)
    },
    {
        path: 'new',
        loadComponent: () => import('./holiday-form.component')
            .then(m => m.HolidayFormComponent),
        canActivate: [roleGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])]
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./holiday-form.component')
            .then(m => m.HolidayFormComponent),
        canActivate: [roleGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])]
    }
];
