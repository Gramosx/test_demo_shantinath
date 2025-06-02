import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tender, TenderResponse, TenderStats } from '../types/models';
import { TenderService } from '../services/tender.service';

export const tenderListResolver: ResolveFn<TenderResponse> = () => {
  const tenderService = inject(TenderService);
  return tenderService.getTenders().pipe(
    catchError(error => {
      console.error('Error loading tenders:', error);
      return of({ data: [], total: 0 });
    })
  );
};

export const tenderDetailResolver: ResolveFn<Tender | null> = (route) => {
  const tenderService = inject(TenderService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  return tenderService.getTender(id).pipe(
    catchError(error => {
      console.error('Error loading tender:', error);
      return of(null);
    })
  );
};

export const tenderStatsResolver: ResolveFn<TenderStats> = () => {
  const tenderService = inject(TenderService);
  return tenderService.getTenderStats().pipe(
    catchError(error => {
      console.error('Error loading tender stats:', error);
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
