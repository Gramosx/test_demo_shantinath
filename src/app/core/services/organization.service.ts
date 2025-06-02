import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Organization, OrganizationResponse, CreateOrganizationDto, UpdateOrganizationDto } from '../types/models';

const STORAGE_KEY = 'tms_organizations';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    constructor() {
        this.initializeDemoOrganizations();
    }

    getOrganizations(
        country?: string,
        search?: string,
        page: number = 1,
        limit: number = 10
    ): Observable<OrganizationResponse> {
        let organizations = this.getOrganizationsFromStorage();

        // Apply filters
        if (country) {
            organizations = organizations.filter(org => org.country === country);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            organizations = organizations.filter(org =>
                org.name.toLowerCase().includes(searchLower) ||
                org.alias.toLowerCase().includes(searchLower)
            );
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const paginatedOrgs = organizations.slice(startIndex, startIndex + limit);

        return of({
            data: paginatedOrgs,
            total: organizations.length
        });
    }

    getOrganizationById(id: string): Observable<Organization | null> {
        const organizations = this.getOrganizationsFromStorage();
        const organization = organizations.find(org => org._id === id);
        return of(organization || null);
    }

    createOrganization(data: CreateOrganizationDto): Observable<Organization> {
        const organizations = this.getOrganizationsFromStorage();
        const now = new Date();
        const newOrganization: Organization = {
            _id: this.generateId(),
            ...data,
            createdAt: now,
            updatedAt: now,
            isActive: true
        };
        organizations.push(newOrganization);
        this.saveOrganizationsToStorage(organizations);
        return of(newOrganization);
    }

    updateOrganization(id: string, data: UpdateOrganizationDto): Observable<Organization | null> {
        const organizations = this.getOrganizationsFromStorage();
        const index = organizations.findIndex(org => org._id === id);
        if (index === -1) {
            return of(null);
        }
        const updatedOrganization = {
            ...organizations[index],
            ...data,
            updatedAt: new Date()
        };
        organizations[index] = updatedOrganization;
        this.saveOrganizationsToStorage(organizations);
        return of(updatedOrganization);
    }

    deleteOrganization(id: string): Observable<boolean> {
        const organizations = this.getOrganizationsFromStorage();
        const index = organizations.findIndex(org => org._id === id);
        if (index === -1) {
            return of(false);
        }
        organizations.splice(index, 1);
        this.saveOrganizationsToStorage(organizations);
        return of(true);
    }

    private getOrganizationsFromStorage(): Organization[] {
        const orgsJson = localStorage.getItem(STORAGE_KEY);
        return orgsJson ? JSON.parse(orgsJson) : [];
    }

    private saveOrganizationsToStorage(organizations: Organization[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(organizations));
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private initializeDemoOrganizations(): void {
        const organizations = this.getOrganizationsFromStorage();
        if (organizations.length === 0) {
            const now = new Date();
            const demoOrgs: Organization[] = [
                {
                    _id: '1',
                    name: 'Headquarters',
                    alias: 'HQ',
                    address: '123 Main Street, New Delhi, India',
                    country: 'IN',
                    units: ['Finance', 'HR', 'IT', 'Operations', 'Sales'],
                    createdAt: now,
                    updatedAt: now,
                    isActive: true
                },
                {
                    _id: '2',
                    name: 'Regional Office',
                    alias: 'RO',
                    address: '456 Business Park, Mumbai, India',
                    country: 'IN',
                    units: ['Regional Sales', 'Customer Support', 'Logistics'],
                    createdAt: now,
                    updatedAt: now,
                    isActive: true
                }
            ];
            this.saveOrganizationsToStorage(demoOrgs);
        }
    }
}
