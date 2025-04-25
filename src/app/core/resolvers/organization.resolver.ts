import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { Organization, OrganizationResponse } from '../types/models';
import { OrganizationService } from '../services/organization.service';

export const organizationListResolver: ResolveFn<OrganizationResponse> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<OrganizationResponse> => {
    const organizationService = inject(OrganizationService);

    // Get any filter parameters from the route
    const country = route.queryParams['country'];
    const search = route.queryParams['search'];
    const page = route.queryParams['page'] ? parseInt(route.queryParams['page']) : 1;
    const limit = route.queryParams['limit'] ? parseInt(route.queryParams['limit']) : 10;

    return organizationService.getOrganizations(country, search, page, limit).pipe(
        catchError(error => {
            console.error('Error loading organizations:', error);
            // Return empty data in case of error
            return of({ data: [], total: 0 });
        })
    );
};

export const organizationDetailResolver: ResolveFn<Organization> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<Organization> => {
    const organizationService = inject(OrganizationService);
    const id = route.paramMap.get('id');

    if (!id) {
        throw new Error('Organization ID is required');
    }

    return organizationService.getOrganizationById(id).pipe(
        catchError(error => {
            console.error(`Error loading organization with ID ${id}:`, error);
            // Return empty organization in case of error
            return of({
                name: '',
                address: '',
                country: '',
                alias: '',
                units: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        })
    );
};
