import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization, OrganizationResponse, CreateOrganizationDto, UpdateOrganizationDto } from '../types/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    private apiUrl = `${environment.apiUrl}/organizations`;

    constructor(private http: HttpClient) { }

    getOrganizations(
        country?: string,
        search?: string,
        page: number = 1,
        limit: number = 10
    ): Observable<OrganizationResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (country) {
            params = params.set('country', country);
        }

        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<OrganizationResponse>(this.apiUrl, { params });
    }

    getOrganizationById(id: string): Observable<Organization> {
        return this.http.get<Organization>(`${this.apiUrl}/${id}`);
    }

    createOrganization(data: CreateOrganizationDto): Observable<Organization> {
        return this.http.post<Organization>(this.apiUrl, data);
    }

    updateOrganization(id: string, data: UpdateOrganizationDto): Observable<Organization> {
        return this.http.put<Organization>(`${this.apiUrl}/${id}`, data);
    }

    deleteOrganization(id: string): Observable<Organization> {
        return this.http.delete<Organization>(`${this.apiUrl}/${id}`);
    }
}
