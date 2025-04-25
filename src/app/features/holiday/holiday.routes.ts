import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/types/enums';
import { holidayListResolver, holidayDetailResolver } from '../../core/resolvers/holiday.resolver';

export const HOLIDAY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./holiday-list.component')
      .then(m => m.HolidayListComponent),
    resolve: {
      holidays: holidayListResolver
    }
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
    canActivate: [roleGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])],
    resolve: {
      holiday: holidayDetailResolver
    }
  }
];
