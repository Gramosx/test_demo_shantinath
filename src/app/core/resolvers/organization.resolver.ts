import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Organization, OrganizationResponse } from '../types/models';
import { OrganizationService } from '../services/organization.service';

export const organizationListResolver: ResolveFn<OrganizationResponse> = (route) => {
    const organizationService = inject(OrganizationService);
    const page = Number(route.queryParamMap.get('page')) || 1;
    const limit = Number(route.queryParamMap.get('limit')) || 10;
    const search = route.queryParamMap.get('search') || undefined;
    const country = route.queryParamMap.get('country') || undefined;

    return organizationService.getOrganizations(country, search, page, limit);
};

export const organizationDetailResolver: ResolveFn<Organization | null> = (route) => {
    const organizationService = inject(OrganizationService);
    const id = route.paramMap.get('id');

    if (!id) {
        return null;
    }

    return organizationService.getOrganizationById(id);
};
