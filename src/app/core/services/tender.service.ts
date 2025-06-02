import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  Tender,
  TenderResponse,
  TenderStats,
  CreateTenderDto,
  UpdateTenderDto,
  TenderDates
} from '../types/models';
import { TenderStatus, TenderType, TenderStage, TenderTOC } from '../types/enums';
import { environment } from '../../../environments/environment';
import { DateCalculator } from '../utils/date-calculator';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  private apiUrl = `${environment.apiUrl}/tenders`;
  private readonly STORAGE_KEY = 'tenders';

  constructor(private http: HttpClient) { }

  private getTendersFromStorage(): Tender[] {
    const tenders = localStorage.getItem(this.STORAGE_KEY);
    return tenders ? JSON.parse(tenders) : [];
  }

  private saveTendersToStorage(tenders: Tender[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tenders));
  }

  getTenders(): Observable<TenderResponse> {
    const tenders = this.getTendersFromStorage();
    return of({
      data: tenders,
      total: tenders.length
    });
  }

  getTender(id: string): Observable<Tender | null> {
    const tenders = this.getTendersFromStorage();
    const tender = tenders.find(t => t._id === id);
    return of(tender || null);
  }

  createTender(tender: CreateTenderDto): Observable<Tender> {
    const tenders = this.getTendersFromStorage();
    const newTender: Tender = {
      ...tender,
      _id: `tender_${Date.now()}`,
      tenderId: `TMS-${new Date().getFullYear()}-${String(tenders.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      createdBy: 'user123'
    };

    tenders.push(newTender);
    this.saveTendersToStorage(tenders);
    return of(newTender);
  }

  updateTender(id: string, tender: UpdateTenderDto): Observable<Tender | null> {
    const tenders = this.getTendersFromStorage();
    const index = tenders.findIndex(t => t._id === id);

    if (index === -1) {
      return of(null);
    }

    const existingTender = tenders[index];
    const updatedDates = tender.dates ? {
      ...existingTender.dates,
      ...tender.dates
    } : existingTender.dates;

    const updatedTender: Tender = {
      ...existingTender,
      ...tender,
      dates: updatedDates,
      updatedAt: new Date()
    };

    tenders[index] = updatedTender;
    this.saveTendersToStorage(tenders);
    return of(updatedTender);
  }

  deleteTender(id: string): Observable<boolean> {
    const tenders = this.getTendersFromStorage();
    const index = tenders.findIndex(t => t._id === id);

    if (index === -1) {
      return of(false);
    }

    tenders[index] = {
      ...tenders[index],
      isDeleted: true,
      deletionDate: new Date()
    };

    this.saveTendersToStorage(tenders);
    return of(true);
  }

  // Helper method to initialize some demo data
  initializeDemoData(): void {
    const demoData: Tender[] = [
      {
        _id: 'tender_1',
        tenderId: 'TMS-2024-001',
        title: 'Office Supplies Tender',
        description: 'Annual procurement of office supplies',
        status: TenderStatus.IN_PROGRESS,
        country: 'IN',
        organizationId: 'org123',
        organizationUnit: 'HQ',
        type: TenderType.GEM,
        items: ['Paper', 'Pens', 'Notebooks'],
        toc: TenderTOC.CLEAR,
        currentStage: TenderStage.PRICE_DISCUSSION,
        dates: DateCalculator.calculateTenderDates(new Date()),
        createdBy: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false
      }
    ];

    this.saveTendersToStorage(demoData);
  }

  getTenderStats(): Observable<TenderStats> {
    const tenders = this.getTendersFromStorage();
    const activeTenders = tenders.filter(t => !t.isDeleted && t.status === TenderStatus.IN_PROGRESS);
    const completedTenders = tenders.filter(t => !t.isDeleted && t.status === TenderStatus.COMPLETED);

    // Calculate growth (mock data for demo)
    const growth = 15; // Mock growth percentage
    const newOrganizations = 3; // Mock new organizations count

    return of({
      total: tenders.length,
      active: activeTenders.length,
      completed: completedTenders.length,
      growth,
      newOrganizations
    });
  }
}
