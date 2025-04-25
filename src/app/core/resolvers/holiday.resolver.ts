import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { Holiday } from '../types/models';
import { HolidayService } from '../services/holiday.service';
import { HolidayType } from '../types/enums';

export const holidayListResolver: ResolveFn<Holiday[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<Holiday[]> => {
    const holidayService = inject(HolidayService);

    return holidayService.getHolidays().pipe(
        catchError(error => {
            console.error('Error loading holidays:', error);
            // Return empty data in case of error
            return of([]);
        })
    );
};

export const holidayDetailResolver: ResolveFn<Holiday> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<Holiday> => {
    const holidayService = inject(HolidayService);
    const id = route.paramMap.get('id');

    if (!id) {
        throw new Error('Holiday ID is required');
    }

    return holidayService.getHolidayById(id).pipe(
        catchError(error => {
            console.error(`Error loading holiday with ID ${id}:`, error);
            // Return default empty holiday object in case of error
            return of({
                date: new Date(),
                name: '',
                type: HolidayType.NATIONAL,
                isActive: true
            });
        })
    );
};
