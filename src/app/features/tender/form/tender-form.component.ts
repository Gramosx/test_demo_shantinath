import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TenderType, TenderTOC, TenderStatus, TenderStage } from '../../../core/types/enums';
import { Country, Organization, TenderDates } from '../../../core/types/models';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TenderService } from '../../../core/services/tender.service';
import { DateCalculator } from '../../../core/utils/date-calculator';

@Component({
  selector: 'app-tender-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
    MatStepperModule,
    RouterLink
  ],
  template: `
    <div class="tender-form-container">
      <h1 class="page-title">{{ isEditMode ? 'Edit' : 'Create' }} Tender</h1>

      <mat-stepper linear #stepper>
        <mat-step [stepControl]="basicInfoForm">
          <ng-template matStepLabel>Basic Information</ng-template>
          <form [formGroup]="basicInfoForm">
            <div class="step-content">
              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Title</mat-label>
                <input matInput formControlName="title" required>
                <mat-error *ngIf="basicInfoForm.get('title')?.hasError('required')">
                  Title is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" required rows="3"></textarea>
                <mat-error *ngIf="basicInfoForm.get('description')?.hasError('required')">
                  Description is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Country</mat-label>
                <mat-select formControlName="country" required>
                  <mat-option *ngFor="let country of countries" [value]="country.code">
                    {{ country.name }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="basicInfoForm.get('country')?.hasError('required')">
                  Country is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Organization</mat-label>
                <mat-select formControlName="organizationId" required>
                  <mat-option *ngFor="let org of organizations" [value]="org._id">
                    {{ org.name }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="basicInfoForm.get('organizationId')?.hasError('required')">
                  Organization is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Organization Unit</mat-label>
                <mat-select formControlName="organizationUnit" required>
                  <mat-option *ngFor="let unit of organizationUnits" [value]="unit">
                    {{ unit }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="basicInfoForm.get('organizationUnit')?.hasError('required')">
                  Organization unit is required
                </mat-error>
              </mat-form-field>

              <div class="button-row">
                <button mat-raised-button color="primary" matStepperNext>Next</button>
                <button mat-stroked-button type="button" routerLink="/tenders">Cancel</button>
              </div>
            </div>
          </form>
        </mat-step>

        <mat-step [stepControl]="detailsForm">
          <ng-template matStepLabel>Tender Details</ng-template>
          <form [formGroup]="detailsForm">
            <div class="step-content">
              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Tender Type</mat-label>
                <mat-select formControlName="type" required>
                  <mat-option *ngFor="let type of tenderTypes" [value]="type">
                    {{ type }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="detailsForm.get('type')?.hasError('required')">
                  Tender type is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>TOC</mat-label>
                <mat-select formControlName="toc" required>
                  <mat-option *ngFor="let toc of tenderTOCs" [value]="toc">
                    {{ toc }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="detailsForm.get('toc')?.hasError('required')">
                  TOC is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status" required>
                  <mat-option *ngFor="let status of tenderStatuses" [value]="status">
                    {{ status }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="detailsForm.get('status')?.hasError('required')">
                  Status is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field">
                <mat-label>Current Stage</mat-label>
                <mat-select formControlName="currentStage" required>
                  <mat-option *ngFor="let stage of tenderStages" [value]="stage">
                    {{ stage }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="detailsForm.get('currentStage')?.hasError('required')">
                  Stage is required
                </mat-error>
              </mat-form-field>

              <div class="form-field">
                <label class="items-label">Items</label>
                <mat-form-field appearance="fill" class="full-width">
                  <mat-label>Add Item</mat-label>
                  <mat-chip-grid #chipGrid>
                    <mat-chip-row *ngFor="let item of items.controls; let i = index"
                                 [value]="item.value"
                                 (removed)="removeItem(i)">
                      {{item.value}}
                      <button matChipRemove [attr.aria-label]="'remove ' + item.value">
                        <mat-icon>cancel</mat-icon>
                      </button>
                    </mat-chip-row>
                  </mat-chip-grid>
                  <input placeholder="New item..."
                         [matChipInputFor]="chipGrid"
                         [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                         (matChipInputTokenEnd)="addItem($event)">
                </mat-form-field>
              </div>

              <div class="button-row">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-raised-button color="primary" matStepperNext>Next</button>
              </div>
            </div>
          </form>
        </mat-step>

        <mat-step [stepControl]="datesForm">
          <ng-template matStepLabel>Schedule</ng-template>
          <form [formGroup]="datesForm">
            <div class="step-content">
              <div formGroupName="dates">
                <mat-form-field appearance="fill" class="form-field">
                  <mat-label>Creation Date</mat-label>
                  <input matInput [matDatepicker]="creationPicker" formControlName="creation"
                         (dateChange)="onCreationDateChange($event)" required>
                  <mat-datepicker-toggle matIconSuffix [for]="creationPicker"></mat-datepicker-toggle>
                  <mat-datepicker #creationPicker></mat-datepicker>
                  <mat-error *ngIf="datesForm.get('dates.creation')?.hasError('required')">
                    Creation date is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="fill" class="form-field">
                  <mat-label>Send for Quote Date</mat-label>
                  <input matInput [matDatepicker]="sendForQuotePicker" formControlName="sendForQuote" required>
                  <mat-datepicker-toggle matIconSuffix [for]="sendForQuotePicker"></mat-datepicker-toggle>
                  <mat-datepicker #sendForQuotePicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="fill" class="form-field">
                  <mat-label>Price Discussion Date</mat-label>
                  <input matInput [matDatepicker]="priceDiscussionPicker" formControlName="priceDiscussion" required>
                  <mat-datepicker-toggle matIconSuffix [for]="priceDiscussionPicker"></mat-datepicker-toggle>
                  <mat-datepicker #priceDiscussionPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="fill" class="form-field">
                  <mat-label>Quote Approval Date</mat-label>
                  <input matInput [matDatepicker]="quoteApprovalPicker" formControlName="quoteApproval" required>
                  <mat-datepicker-toggle matIconSuffix [for]="quoteApprovalPicker"></mat-datepicker-toggle>
                  <mat-datepicker #quoteApprovalPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="fill" class="form-field">
                  <mat-label>Submission Date</mat-label>
                  <input matInput [matDatepicker]="submissionPicker" formControlName="submission" required>
                  <mat-datepicker-toggle matIconSuffix [for]="submissionPicker"></mat-datepicker-toggle>
                  <mat-datepicker #submissionPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="fill" class="form-field">
                  <mat-label>Reference Date</mat-label>
                  <input matInput [matDatepicker]="referencePicker" formControlName="reference" required>
                  <mat-datepicker-toggle matIconSuffix [for]="referencePicker"></mat-datepicker-toggle>
                  <mat-datepicker #referencePicker></mat-datepicker>
                </mat-form-field>
              </div>

              <div class="button-row">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-raised-button color="primary" (click)="onSubmit()">
                  {{ isEditMode ? 'Update' : 'Create' }}
                </button>
                <button mat-stroked-button type="button" routerLink="/tenders">Cancel</button>
              </div>
            </div>
          </form>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .tender-form-container {
      padding: 20px;
    }

    .step-content {
      padding: 20px 0;
    }

    .form-field, .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    .items-label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
      display: block;
    }

    .button-row {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class TenderFormComponent implements OnInit {
  basicInfoForm: FormGroup;
  detailsForm: FormGroup;
  datesForm: FormGroup;
  isEditMode = false;
  loading = false;
  error = '';

  // Dropdown options
  countries: Country[] = [];
  organizations: Organization[] = [];
  organizationUnits: string[] = [];
  tenderTypes = Object.values(TenderType);
  tenderTOCs = Object.values(TenderTOC);
  tenderStatuses = Object.values(TenderStatus);
  tenderStages = Object.values(TenderStage);

  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tenderService: TenderService
  ) {
    this.basicInfoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      country: ['', Validators.required],
      organizationId: ['', Validators.required],
      organizationUnit: ['', Validators.required]
    });

    this.detailsForm = this.fb.group({
      type: [TenderType.GEM, Validators.required],
      toc: [TenderTOC.CLEAR, Validators.required],
      status: [TenderStatus.DRAFT, Validators.required],
      currentStage: [TenderStage.CREATION, Validators.required],
      items: this.fb.array([])
    });

    this.datesForm = this.fb.group({
      dates: this.fb.group({
        creation: [new Date(), Validators.required],
        sendForQuote: [null, Validators.required],
        priceDiscussion: [null, Validators.required],
        quoteApproval: [null, Validators.required],
        submission: [null, Validators.required],
        reference: [null, Validators.required]
      })
    });
  }

  get items() {
    return this.detailsForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    // Populate countries (would come from a service)
    this.countries = [
      { code: 'IN', name: 'India' },
      { code: 'US', name: 'United States' },
      { code: 'UK', name: 'United Kingdom' }
    ];

    // Populate organizations (would come from a service)
    this.organizations = [
      {
        _id: 'org123',
        name: 'Demo Organization',
        address: '123 Demo St',
        country: 'IN',
        alias: 'DEMO',
        units: ['HQ', 'Branch 1', 'Branch 2'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      }
    ];

    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;

    if (this.isEditMode && id) {
      this.loading = true;
      this.tenderService.getTender(id).subscribe({
        next: (tender) => {
          if (tender) {
            this.populateForm(tender);
          } else {
            this.error = 'Tender not found';
            this.router.navigate(['/tenders']);
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load tender';
          this.loading = false;
          console.error('Error loading tender:', error);
        }
      });
    }

    // Set default dates
    this.calculateDates(new Date());
  }

  onCreationDateChange(event: any): void {
    const date = event.value;
    if (date) {
      this.calculateDates(date);
    }
  }

  calculateDates(creationDate: Date): void {
    const dates = DateCalculator.calculateTenderDates(creationDate);
    const datesGroup = this.datesForm.get('dates') as FormGroup;
    datesGroup.patchValue(dates);
  }

  addItem(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.items.push(this.fb.control(value));
    }
    event.chipInput!.clear();
  }

  removeItem(index: number): void {
    if (index >= 0) {
      this.items.removeAt(index);
    }
  }

  private populateForm(tender: any): void {
    this.basicInfoForm.patchValue({
      title: tender.title,
      description: tender.description,
      country: tender.country,
      organizationId: tender.organizationId,
      organizationUnit: tender.organizationUnit
    });

    this.detailsForm.patchValue({
      type: tender.type,
      toc: tender.toc,
      status: tender.status,
      currentStage: tender.currentStage
    });

    // Clear existing items and add new ones
    while (this.items.length) {
      this.items.removeAt(0);
    }
    tender.items.forEach((item: string) => {
      this.items.push(this.fb.control(item));
    });

    this.datesForm.patchValue({
      dates: tender.dates
    });
  }

  onSubmit(): void {
    if (this.basicInfoForm.invalid || this.detailsForm.invalid || this.datesForm.invalid) {
      return;
    }

    this.loading = true;

    // Combine all form values
    const tenderData = {
      ...this.basicInfoForm.value,
      ...this.detailsForm.value,
      ...this.datesForm.value
    };

    const id = this.route.snapshot.paramMap.get('id');

    if (this.isEditMode && id) {
      this.tenderService.updateTender(id, tenderData).subscribe({
        next: (tender) => {
          if (tender) {
            this.router.navigate(['/tenders']);
          } else {
            this.error = 'Failed to update tender';
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to update tender';
          this.loading = false;
          console.error('Error updating tender:', error);
        }
      });
    } else {
      this.tenderService.createTender(tenderData).subscribe({
        next: (tender) => {
          this.router.navigate(['/tenders']);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to create tender';
          this.loading = false;
          console.error('Error creating tender:', error);
        }
      });
    }
  }
}
