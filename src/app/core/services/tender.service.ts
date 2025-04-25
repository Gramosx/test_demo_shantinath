import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    Tender,
    TenderResponse,
    TenderStats,
    CreateTenderDto,
    UpdateTenderDto
} from '../types/models';
import { TenderStatus, TenderType } from '../types/enums';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TenderService {
    private apiUrl = `${environment.apiUrl}/tenders`;

    constructor(private http: HttpClient) { }

    getTenders(
        search?: string,
        status?: TenderStatus,
        type?: TenderType,
        organization?: string,
        country?: string,
        page: number = 1,
        limit: number = 10
    ): Observable<TenderResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) params = params.set('search', search);
        if (status) params = params.set('status', status);
        if (type) params = params.set('type', type);
        if (organization) params = params.set('organization', organization);
        if (country) params = params.set('country', country);

        return this.http.get<TenderResponse>(this.apiUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }

    getTenderById(id: string): Observable<Tender> {
        return this.http.get<Tender>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    createTender(data: CreateTenderDto): Observable<Tender> {
        return this.http.post<Tender>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    updateTender(id: string, data: UpdateTenderDto): Observable<Tender> {
        return this.http.put<Tender>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    deleteTender(id: string): Observable<Tender> {
        return this.http.delete<Tender>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    getTenderStats(): Observable<TenderStats> {
        return this.http.get<TenderStats>(`${this.apiUrl}/stats`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any) {
        console.error('API error:', error);
        return throwError(() => new Error(error.error?.message || 'An error occurred. Please try again.'));
    }
}
