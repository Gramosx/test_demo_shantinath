import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Organization } from '../../../core/types/models';

@Component({
    selector: 'app-organization-detail',
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
    <div class="organization-detail-container">
      <div class="header">
        <h1 class="page-title">{{ organization?.name }}</h1>
        <div class="actions">
          <button mat-raised-button color="accent" [routerLink]="['/organizations/edit', organization?._id]">
            <mat-icon>edit</mat-icon> Edit
          </button>
          <button mat-stroked-button routerLink="/organizations">
            <mat-icon>arrow_back</mat-icon> Back to List
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-indicator">
        Loading organization details...
      </div>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <div *ngIf="!loading && organization" class="details">
        <mat-card>
          <mat-card-content>
            <div class="detail-row">
              <span class="detail-label">Alias:</span>
              <span class="detail-value">{{ organization.alias }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">{{ organization.address }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Country:</span>
              <span class="detail-value">{{ organization.country }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value status-badge" [ngClass]="{'active': organization.isActive, 'inactive': !organization.isActive}">
                {{ organization.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Units:</span>
              <div class="units-list">
                <mat-chip-set>
                  <mat-chip *ngFor="let unit of organization.units">{{ unit }}</mat-chip>
                </mat-chip-set>
              </div>
            </div>

            <div class="detail-row">
              <span class="detail-label">Created:</span>
              <span class="detail-value">{{ organization.createdAt | date:'medium' }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Last Updated:</span>
              <span class="detail-value">{{ organization.updatedAt | date:'medium' }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .organization-detail-container {
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

    .detail-row {
      margin-bottom: 16px;
      display: flex;
    }

    .detail-label {
      font-weight: 500;
      width: 120px;
      color: rgba(0, 0, 0, 0.6);
    }

    .detail-value {
      flex: 1;
    }

    .units-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .active {
      background-color: #e6f7e6;
      color: #2e7d32;
    }

    .inactive {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class OrganizationDetailComponent implements OnInit {
    organization: Organization | null = null;
    loading = true;
    error = '';

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadOrganization(id);
        } else {
            this.error = 'Organization ID is missing';
            this.loading = false;
        }
    }

    loadOrganization(id: string): void {
        // This would fetch organization data from a service
        console.log('Loading organization with ID:', id);

        // Mock data for demonstration
        this.organization = {
            _id: id,
            name: 'Demo Organization',
            alias: 'DEMO',
            address: '123 Main St, City, Country',
            country: 'IN',
            units: ['Unit 1', 'Unit 2', 'Unit 3'],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
        };

        this.loading = false;
    }
}
