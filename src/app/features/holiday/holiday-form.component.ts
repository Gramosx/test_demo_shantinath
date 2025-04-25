import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HolidayType } from '../../core/types/enums';

@Component({
    selector: 'app-holiday-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatNativeDateModule,
        RouterLink
    ],
    template: `
    <div class="holiday-form-container">
      <h1 class="page-title">{{ isEditMode ? 'Edit' : 'Add' }} Holiday</h1>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="holidayForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Holiday Name</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="holidayForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" required>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="holidayForm.get('date')?.hasError('required')">
                Date is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Type</mat-label>
              <mat-select formControlName="type" required>
                <mat-option *ngFor="let type of holidayTypes" [value]="type">
                  {{ type }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="holidayForm.get('type')?.hasError('required')">
                Type is required
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/holidays">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="holidayForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .holiday-form-container {
      padding: 20px;
    }

    .form-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class HolidayFormComponent implements OnInit {
    holidayForm: FormGroup;
    isEditMode = false;
    holidayTypes = Object.values(HolidayType);

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.holidayForm = this.fb.group({
            name: ['', Validators.required],
            date: [null, Validators.required],
            type: [HolidayType.NATIONAL, Validators.required]
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!id;

        if (this.isEditMode) {
            // This would fetch holiday data from a service
            // For now, we'll just log the ID
            console.log('Editing holiday with ID:', id);
        }
    }

    onSubmit(): void {
        if (this.holidayForm.invalid) {
            return;
        }

        const holidayData = this.holidayForm.value;

        if (this.isEditMode) {
            // This would call a service to update the holiday
            console.log('Update holiday:', holidayData);
        } else {
            // This would call a service to create the holiday
            console.log('Create holiday:', holidayData);
        }

        this.router.navigate(['/holidays']);
    }
}
