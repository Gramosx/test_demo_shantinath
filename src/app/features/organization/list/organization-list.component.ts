import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Organization } from '../../../core/types/models';

@Component({
    selector: 'app-organization-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        RouterLink
    ],
    template: `
    <div class="organization-list-container">
      <h1 class="page-title">Organizations</h1>

      <div class="actions">
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon> Add Organization
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="organizations" class="organization-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let org">{{ org.name }}</td>
            </ng-container>

            <ng-container matColumnDef="alias">
              <th mat-header-cell *matHeaderCellDef>Alias</th>
              <td mat-cell *matCellDef="let org">{{ org.alias }}</td>
            </ng-container>

            <ng-container matColumnDef="country">
              <th mat-header-cell *matHeaderCellDef>Country</th>
              <td mat-cell *matCellDef="let org">{{ org.country }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let org">
                <span class="status-badge" [ngClass]="{'active': org.isActive, 'inactive': !org.isActive}">
                  {{ org.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let org">
                <button mat-icon-button color="primary" [routerLink]="[org._id]">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" [routerLink]="['edit', org._id]">
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
    .organization-list-container {
      padding: 20px;
    }

    .actions {
      margin-bottom: 20px;
    }

    .organization-table {
      width: 100%;
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
export class OrganizationListComponent implements OnInit {
    organizations: Organization[] = [];
    displayedColumns: string[] = ['name', 'alias', 'country', 'status', 'actions'];

    constructor() { }

    ngOnInit(): void {
        // This would be populated with actual organization data from a service
        this.organizations = [];
    }
}
