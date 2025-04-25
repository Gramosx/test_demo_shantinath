import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Tender } from '../../../core/types/models';
import { TenderStatus, TenderType, TenderTOC, TenderStage } from '../../../core/types/enums';

@Component({
  selector: 'app-tender-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="tender-detail-container">
      <div class="header">
        <h1 class="page-title">{{ tender?.title }}</h1>
        <div class="actions">
          <button mat-raised-button color="accent" [routerLink]="['/tenders/edit', tender?._id]">
            <mat-icon>edit</mat-icon> Edit
          </button>
          <button mat-stroked-button routerLink="/tenders">
            <mat-icon>arrow_back</mat-icon> Back to List
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-indicator">
        Loading tender details...
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="!loading && tender" class="details">
        <mat-card class="status-card">
          <mat-card-content class="status-content">
            <div class="status-item">
              <span class="status-label">Status:</span>
              <span class="status-value status-chip" [ngClass]="tender.status.toLowerCase()">
                {{ tender.status }}
              </span>
            </div>

            <div class="status-item">
              <span class="status-label">Current Stage:</span>
              <span class="status-value stage-chip">
                {{ tender.currentStage }}
              </span>
            </div>

            <div class="status-item">
              <span class="status-label">Type:</span>
              <span class="status-value">{{ tender.type }}</span>
            </div>

            <div class="status-item">
              <span class="status-label">TOC:</span>
              <span class="status-value">{{ tender.toc }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="tab-buttons">
          <button mat-button
                 [class.active-tab]="activeTab === 'info'"
                 (click)="activeTab = 'info'">
            Basic Information
          </button>
          <button mat-button
                 [class.active-tab]="activeTab === 'schedule'"
                 (click)="activeTab = 'schedule'">
            Schedule
          </button>
          <button mat-button
                 [class.active-tab]="activeTab === 'metadata'"
                 (click)="activeTab = 'metadata'">
            Metadata
          </button>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'info'">
          <mat-card>
            <mat-card-content>
              <div class="detail-row">
                <span class="detail-label">ID:</span>
                <span class="detail-value">{{ tender.tenderId }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span class="detail-value">{{ tender.description }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Organization:</span>
                <span class="detail-value">{{ tender.organizationId }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Organization Unit:</span>
                <span class="detail-value">{{ tender.organizationUnit }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Country:</span>
                <span class="detail-value">{{ tender.country }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Items:</span>
                <div class="items-list">
                  <mat-chip-set>
                    <mat-chip *ngFor="let item of tender.items">{{ item }}</mat-chip>
                  </mat-chip-set>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'schedule'">
          <mat-card>
            <mat-card-content>
              <div class="detail-row">
                <span class="detail-label">Creation:</span>
                <span class="detail-value">{{ tender.dates.creation | date:'medium' }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Send for Quote:</span>
                <span class="detail-value">{{ tender.dates.sendForQuote | date:'medium' }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Price Discussion:</span>
                <span class="detail-value">{{ tender.dates.priceDiscussion | date:'medium' }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Quote Approval:</span>
                <span class="detail-value">{{ tender.dates.quoteApproval | date:'medium' }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Submission:</span>
                <span class="detail-value">{{ tender.dates.submission | date:'medium' }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Reference:</span>
                <span class="detail-value">{{ tender.dates.reference | date:'medium' }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'metadata'">
          <mat-card>
            <mat-card-content>
              <div class="detail-row">
                <span class="detail-label">Created By:</span>
                <span class="detail-value">{{ tender.createdBy }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Created:</span>
                <span class="detail-value">{{ tender.createdAt | date:'medium' }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Last Updated:</span>
                <span class="detail-value">{{ tender.updatedAt | date:'medium' }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tender-detail-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    .status-card {
      margin-bottom: 20px;
    }

    .status-content {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .status-item {
      display: flex;
      align-items: center;
    }

    .status-label {
      font-weight: 500;
      margin-right: 8px;
      color: rgba(0, 0, 0, 0.6);
    }

    .status-chip {
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
    }

    .stage-chip {
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      background-color: #e8eaf6;
      color: #3f51b5;
    }

    .in_progress {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .draft {
      background-color: #f5f5f5;
      color: #616161;
    }

    .completed {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .cancelled {
      background-color: #ffebee;
      color: #c62828;
    }

    .tab-buttons {
      display: flex;
      margin-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .active-tab {
      color: #3f51b5;
      border-bottom: 2px solid #3f51b5;
    }

    .tab-content {
      padding: 20px 0;
    }

    .detail-row {
      margin-bottom: 16px;
      display: flex;
    }

    .detail-label {
      font-weight: 500;
      width: 150px;
      color: rgba(0, 0, 0, 0.6);
    }

    .detail-value {
      flex: 1;
    }

    .items-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `]
})
export class TenderDetailComponent implements OnInit {
  tender: Tender | null = null;
  loading = true;
  error = '';
  activeTab = 'info'; // Default tab

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTender(id);
    } else {
      this.error = 'Tender ID is missing';
      this.loading = false;
    }
  }

  loadTender(id: string): void {
    // This would fetch tender data from a service
    console.log('Loading tender with ID:', id);

    // Mock data for demonstration
    this.tender = {
      _id: id,
      tenderId: 'TMS-2023-001',
      title: 'Sample Tender',
      description: 'This is a sample tender description for demonstration purposes.',
      status: TenderStatus.IN_PROGRESS,
      country: 'IN',
      organizationId: 'org123',
      organizationUnit: 'Unit 1',
      type: TenderType.GEM,
      items: ['Item 1', 'Item 2', 'Item 3'],
      toc: TenderTOC.CLEAR,
      currentStage: TenderStage.PRICE_DISCUSSION,
      dates: {
        creation: new Date(),
        sendForQuote: new Date(new Date().setDate(new Date().getDate() + 3)),
        priceDiscussion: new Date(new Date().setDate(new Date().getDate() + 5)),
        quoteApproval: new Date(new Date().setDate(new Date().getDate() + 10)),
        submission: new Date(new Date().setDate(new Date().getDate() + 15)),
        reference: new Date(new Date().setDate(new Date().getDate() + 17))
      },
      createdBy: 'user123',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };

    this.loading = false;
  }
}
