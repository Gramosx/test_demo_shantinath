import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        limit: number = 10,
        upcoming?: boolean
    ): Observable<TenderResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (search) params = params.set('search', search);
        if (status) params = params.set('status', status);
        if (type) params = params.set('type', type);
        if (organization) params = params.set('organization', organization);
        if (country) params = params.set('country', country);
        if (upcoming) params = params.set('upcoming', upcoming.toString());

        return this.http.get<TenderResponse>(this.apiUrl, { params });
    }

    getTenderById(id: string): Observable<Tender> {
        return this.http.get<Tender>(`${this.apiUrl}/${id}`);
    }

    createTender(data: CreateTenderDto): Observable<Tender> {
        return this.http.post<Tender>(this.apiUrl, data);
    }

    updateTender(id: string, data: UpdateTenderDto): Observable<Tender> {
        return this.http.put<Tender>(`${this.apiUrl}/${id}`, data);
    }

    deleteTender(id: string): Observable<Tender> {
        return this.http.delete<Tender>(`${this.apiUrl}/${id}`);
    }

    getTenderStats(): Observable<TenderStats> {
        return this.http.get<TenderStats>(`${this.apiUrl}/stats`);
    }
}
