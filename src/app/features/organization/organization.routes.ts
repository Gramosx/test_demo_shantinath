import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/types/enums';
import { organizationListResolver, organizationDetailResolver } from '../../core/resolvers/organization.resolver';

export const ORGANIZATION_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./list/organization-list.component')
            .then(m => m.OrganizationListComponent),
        resolve: {
            organizationData: organizationListResolver
        }
    },
    {
        path: 'new',
        loadComponent: () => import('./form/organization-form.component')
            .then(m => m.OrganizationFormComponent),
        canActivate: [roleGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])]
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./form/organization-form.component')
            .then(m => m.OrganizationFormComponent),
        canActivate: [roleGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])],
        resolve: {
            organization: organizationDetailResolver
        }
    },
    {
        path: ':id',
        loadComponent: () => import('./detail/organization-detail.component')
            .then(m => m.OrganizationDetailComponent),
        resolve: {
            organization: organizationDetailResolver
        }
    }
];
