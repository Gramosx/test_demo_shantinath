import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/types/enums';
import { tenderListResolver, tenderDetailResolver } from '../../core/resolvers/tender.resolver';

export const TENDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/tender-list.component')
      .then(m => m.TenderListComponent),
    resolve: {
      tenderData: tenderListResolver
    }
  },
  {
    path: 'new',
    loadComponent: () => import('./form/tender-form.component')
      .then(m => m.TenderFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./form/tender-form.component')
      .then(m => m.TenderFormComponent),
    canActivate: [roleGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])],
    resolve: {
      tender: tenderDetailResolver
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/tender-detail.component')
      .then(m => m.TenderDetailComponent),
    resolve: {
      tender: tenderDetailResolver
    }
  }
];
