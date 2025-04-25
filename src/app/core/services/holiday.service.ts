import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Holiday, CreateHolidayDto, UpdateHolidayDto } from '../types/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HolidayService {
    private apiUrl = `${environment.apiUrl}/holidays`;

    constructor(private http: HttpClient) { }

    getHolidays(): Observable<Holiday[]> {
        return this.http.get<Holiday[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    createHoliday(data: CreateHolidayDto): Observable<Holiday> {
        return this.http.post<Holiday>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    updateHoliday(id: string, data: UpdateHolidayDto): Observable<Holiday> {
        return this.http.put<Holiday>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    deleteHoliday(id: string): Observable<Holiday> {
        return this.http.delete<Holiday>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any) {
        console.error('API error:', error);
        return throwError(() => new Error(error.error?.message || 'An error occurred. Please try again.'));
    }
}
