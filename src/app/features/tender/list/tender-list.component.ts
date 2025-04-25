import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { Tender, TenderStats } from '../../../core/types/models';

@Component({
    selector: 'app-tender-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        RouterLink
    ],
    template: `
    <div class="tender-list-container">
      <h1 class="page-title">Tenders</h1>

      <div class="actions">
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon> Create Tender
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="tenders" class="tender-table">
            <ng-container matColumnDef="tenderId">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let tender">{{ tender.tenderId }}</td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let tender">{{ tender.title }}</td>
            </ng-container>

            <ng-container matColumnDef="organization">
              <th mat-header-cell *matHeaderCellDef>Organization</th>
              <td mat-cell *matCellDef="let tender">{{ tender.organizationId }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let tender">
                <span class="status-chip" [ngClass]="tender.status.toLowerCase()">
                  {{ tender.status }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="stage">
              <th mat-header-cell *matHeaderCellDef>Stage</th>
              <td mat-cell *matCellDef="let tender">{{ tender.currentStage }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let tender">
                <button mat-icon-button color="primary" [routerLink]="[tender._id]">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" [routerLink]="['edit', tender._id]">
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .tender-list-container {
      padding: 20px;
    }

    .actions {
      margin-bottom: 20px;
    }

    .tender-table {
      width: 100%;
    }

    .status-chip {
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
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
  `]
})
export class TenderListComponent implements OnInit {
    tenders: Tender[] = [];
    displayedColumns: string[] = ['tenderId', 'title', 'organization', 'status', 'stage', 'actions'];

    constructor() { }

    ngOnInit(): void {
        // This would be populated with actual tender data from a service
        this.tenders = [];
    }
}
