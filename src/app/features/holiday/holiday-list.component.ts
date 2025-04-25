import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Holiday } from '../../core/types/models';

@Component({
    selector: 'app-holiday-list',
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
    <div class="holiday-list-container">
      <h1 class="page-title">Holidays</h1>

      <div class="actions">
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon> Add Holiday
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="holidays" class="holiday-table">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let holiday">{{ holiday.date | date }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let holiday">{{ holiday.name }}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let holiday">{{ holiday.type }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let holiday">
                <button mat-icon-button color="primary" [routerLink]="['edit', holiday._id]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteHoliday(holiday._id)">
                  <mat-icon>delete</mat-icon>
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
    .holiday-list-container {
      padding: 20px;
    }

    .actions {
      margin-bottom: 20px;
    }

    .holiday-table {
      width: 100%;
    }
  `]
})
export class HolidayListComponent implements OnInit {
    holidays: Holiday[] = [];
    displayedColumns: string[] = ['date', 'name', 'type', 'actions'];

    constructor() { }

    ngOnInit(): void {
        // This would be populated with actual holiday data from a service
        this.holidays = [];
    }

    deleteHoliday(id: string): void {
        // This would call a service to delete the holiday
        console.log('Delete holiday', id);
    }
}
