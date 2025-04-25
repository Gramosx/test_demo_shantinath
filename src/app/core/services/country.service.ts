import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../types/models';

@Injectable({
    providedIn: 'root'
})
export class CountryService {
    private countries: Country[] = [
        { code: 'IN', name: 'India' },
        { code: 'US', name: 'United States' },
        { code: 'UK', name: 'United Kingdom' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'JP', name: 'Japan' },
        { code: 'CN', name: 'China' },
        { code: 'BR', name: 'Brazil' },
        { code: 'ZA', name: 'South Africa' },
        { code: 'SG', name: 'Singapore' },
        { code: 'AE', name: 'United Arab Emirates' }
    ];

    constructor() { }

    getCountries(): Observable<Country[]> {
        return of(this.countries);
    }

    getCountryByCode(code: string): Observable<Country | undefined> {
        const country = this.countries.find(c => c.code === code);
        return of(country);
    }
}
