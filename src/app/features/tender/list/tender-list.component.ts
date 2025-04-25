import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Tender, TenderResponse } from '../../../core/types/models';
import { TenderService } from '../../../core/services/tender.service';
import { IconsModule } from '../../../shared/icons/icons.module';

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
    RouterLink,
    IconsModule
  ],
  template: `
    <div class="tender-list-container">
      <h1 class="page-title">{{ title }}</h1>

      <div class="actions">
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon svgIcon="feather:plus" class="icon"></mat-icon>
          Create Tender
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
                  <mat-icon svgIcon="feather:eye" class="table-icon"></mat-icon>
                </button>
                <button mat-icon-button color="accent" [routerLink]="['edit', tender._id]">
                  <mat-icon svgIcon="feather:edit" class="table-icon"></mat-icon>
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

    .icon {
      width: 18px !important;
      height: 18px !important;
      margin-right: 4px;
      vertical-align: middle;
      font-size: 18px;
      display: inline-flex;
    }

    button .icon {
      display: inline-flex;
      align-items: center;
    }

    .table-icon {
      width: 24px !important;
      height: 24px !important;
      font-size: 24px;
    }
  `]
})
export class TenderListComponent implements OnInit {
  tenders: Tender[] = [];
  displayedColumns: string[] = ['tenderId', 'title', 'organization', 'status', 'stage', 'actions'];
  title: string = 'Tenders';

  constructor(
    private route: ActivatedRoute,
    private tenderService: TenderService
  ) { }

  ngOnInit(): void {
    // Get resolved data from the route
    this.route.data.subscribe(data => {
      if (data['tenderData']) {
        this.tenders = data['tenderData'].data;
      }
    });

    // Update title based on the query params
    this.route.queryParams.subscribe(params => {
      if (params['status'] === 'IN_PROGRESS') {
        this.title = 'Open Tenders';
      } else if (params['upcoming'] === 'true') {
        this.title = 'Upcoming Dues';
      } else {
        this.title = 'All Tenders';
      }
    });
  }
}
