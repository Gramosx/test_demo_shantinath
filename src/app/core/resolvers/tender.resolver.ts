import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { Tender, TenderResponse, TenderStats } from '../types/models';
import { TenderService } from '../services/tender.service';
import { TenderStatus, TenderType } from '../types/enums';

export const tenderListResolver: ResolveFn<TenderResponse> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<TenderResponse> => {
    const tenderService = inject(TenderService);

    // Get filter parameters from the route
    const search = route.queryParams['search'];
    const status = route.queryParams['status'] as TenderStatus | undefined;
    const type = route.queryParams['type'] as TenderType | undefined;
    const organization = route.queryParams['organization'];
    const country = route.queryParams['country'];
    const page = route.queryParams['page'] ? parseInt(route.queryParams['page']) : 1;
    const limit = route.queryParams['limit'] ? parseInt(route.queryParams['limit']) : 10;

    return tenderService.getTenders(search, status, type, organization, country, page, limit).pipe(
        catchError(error => {
            console.error('Error loading tenders:', error);
            // Return empty data in case of error
            return of({ data: [], total: 0 });
        })
    );
};

export const tenderDetailResolver: ResolveFn<Tender> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<Tender> => {
    const tenderService = inject(TenderService);
    const id = route.paramMap.get('id');

    if (!id) {
        throw new Error('Tender ID is required');
    }

    return tenderService.getTenderById(id).pipe(
        catchError(error => {
            console.error(`Error loading tender with ID ${id}:`, error);
            // Return minimally valid empty tender object
            return of({
                title: '',
                description: '',
                status: TenderStatus.DRAFT,
                country: '',
                organizationId: '',
                organizationUnit: '',
                type: TenderType.GEM,
                items: [],
                toc: 'CLEAR' as any,
                currentStage: 'CREATION' as any,
                dates: {
                    creation: new Date(),
                    sendForQuote: new Date(),
                    priceDiscussion: new Date(),
                    quoteApproval: new Date(),
                    submission: new Date(),
                    reference: new Date()
                },
                createdBy: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                isDeleted: false
            });
        })
    );
};

export const tenderStatsResolver: ResolveFn<TenderStats> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<TenderStats> => {
    const tenderService = inject(TenderService);

    return tenderService.getTenderStats().pipe(
        catchError(error => {
            console.error('Error loading tender stats:', error);
            // Return default stats in case of error
            return of({
                total: 0,
                active: 0,
                completed: 0,
                growth: 0,
                newOrganizations: 0
            });
        })
    );
};
