import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Holiday, CreateHolidayDto, UpdateHolidayDto } from '../types/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HolidayService {
    private apiUrl = `${environment.apiUrl}/holidays`;

    constructor(private http: HttpClient) { }

    getHolidays(): Observable<Holiday[]> {
        return this.http.get<Holiday[]>(this.apiUrl);
    }

    getHolidayById(id: string): Observable<Holiday> {
        return this.http.get<Holiday>(`${this.apiUrl}/${id}`);
    }

    createHoliday(data: CreateHolidayDto): Observable<Holiday> {
        return this.http.post<Holiday>(this.apiUrl, data);
    }

    updateHoliday(id: string, data: UpdateHolidayDto): Observable<Holiday> {
        return this.http.put<Holiday>(`${this.apiUrl}/${id}`, data);
    }

    deleteHoliday(id: string): Observable<Holiday> {
        return this.http.delete<Holiday>(`${this.apiUrl}/${id}`);
    }
}
