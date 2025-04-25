import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    Organization,
    OrganizationResponse,
    CreateOrganizationDto,
    UpdateOrganizationDto
} from '../types/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    private apiUrl = `${environment.apiUrl}/organizations`;

    constructor(private http: HttpClient) { }

    getOrganizations(
        search?: string,
        page: number = 1,
        limit: number = 10
    ): Observable<OrganizationResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<OrganizationResponse>(this.apiUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }

    getOrganizationsByCountry(
        country: string,
        search?: string,
        page: number = 1,
        limit: number = 10
    ): Observable<OrganizationResponse> {
        let params = new HttpParams()
            .set('country', country)
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<OrganizationResponse>(this.apiUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }

    getOrganizationById(id: string): Observable<Organization> {
        return this.http.get<Organization>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    createOrganization(data: CreateOrganizationDto): Observable<Organization> {
        return this.http.post<Organization>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    updateOrganization(id: string, data: UpdateOrganizationDto): Observable<Organization> {
        return this.http.put<Organization>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    deleteOrganization(id: string): Observable<Organization> {
        return this.http.delete<Organization>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any) {
        console.error('API error:', error);
        return throwError(() => new Error(error.error?.message || 'An error occurred. Please try again.'));
    }
}
