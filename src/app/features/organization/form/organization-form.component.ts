import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Country } from '../../../core/types/models';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { OrganizationService } from '../../../core/services/organization.service';
import { CountryService } from '../../../core/services/country.service';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    RouterLink
  ],
  template: `
    <div class="organization-form-container">
      <h1 class="page-title">{{ isEditMode ? 'Edit' : 'Add' }} Organization</h1>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="organizationForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Organization Name</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="organizationForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Alias</mat-label>
              <input matInput formControlName="alias" required>
              <mat-error *ngIf="organizationForm.get('alias')?.hasError('required')">
                Alias is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Address</mat-label>
              <textarea matInput formControlName="address" required rows="3"></textarea>
              <mat-error *ngIf="organizationForm.get('address')?.hasError('required')">
                Address is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Country</mat-label>
              <mat-select formControlName="country" required>
                <mat-option *ngFor="let country of countries" [value]="country.code">
                  {{ country.name }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="organizationForm.get('country')?.hasError('required')">
                Country is required
              </mat-error>
            </mat-form-field>

            <div class="form-field">
              <label class="units-label">Units</label>
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Add Unit</mat-label>
                <mat-chip-grid #chipGrid>
                  <mat-chip-row *ngFor="let unit of units.controls; let i = index"
                               [value]="unit.value"
                               (removed)="removeUnit(i)">
                    {{unit.value}}
                    <button matChipRemove [attr.aria-label]="'remove ' + unit.value">
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                </mat-chip-grid>
                <input placeholder="New unit..."
                       [matChipInputFor]="chipGrid"
                       [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                       (matChipInputTokenEnd)="addUnit($event)">
              </mat-form-field>
            </div>

            <div *ngIf="isEditMode" class="form-field">
              <mat-slide-toggle formControlName="isActive">
                {{ organizationForm.get('isActive')?.value ? 'Active' : 'Inactive' }}
              </mat-slide-toggle>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/organizations">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="organizationForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .organization-form-container {
      padding: 20px;
    }

    .form-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .full-width {
      width: 100%;
    }

    .units-label {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
      display: block;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class OrganizationFormComponent implements OnInit {
  organizationForm: FormGroup;
  isEditMode = false;
  countries: Country[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  get units() {
    return this.organizationForm.get('units') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private countryService: CountryService
  ) {
    this.organizationForm = this.fb.group({
      name: ['', Validators.required],
      alias: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      units: this.fb.array([]),
      isActive: [true]
    });
  }

  ngOnInit(): void {
    // Load countries
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;

    if (this.isEditMode && id) {
      this.organizationService.getOrganizationById(id).subscribe({
        next: (organization) => {
          if (organization) {
            this.organizationForm.patchValue({
              name: organization.name,
              alias: organization.alias,
              address: organization.address,
              country: organization.country,
              isActive: organization.isActive
            });

            // Clear existing units and add the ones from the organization
            while (this.units.length) {
              this.units.removeAt(0);
            }
            organization.units.forEach(unit => {
              this.units.push(this.fb.control(unit));
            });
          } else {
            this.router.navigate(['/organizations']);
          }
        },
        error: (error) => {
          console.error('Error loading organization:', error);
          this.router.navigate(['/organizations']);
        }
      });
    }
  }

  addUnit(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.units.push(this.fb.control(value));
    }

    event.chipInput!.clear();
  }

  removeUnit(index: number): void {
    if (index >= 0) {
      this.units.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.organizationForm.invalid) {
      return;
    }

    const formValue = this.organizationForm.value;
    const organizationData = {
      name: formValue.name,
      alias: formValue.alias,
      address: formValue.address,
      country: formValue.country,
      units: formValue.units,
      isActive: formValue.isActive
    };

    const id = this.route.snapshot.paramMap.get('id');

    if (this.isEditMode && id) {
      this.organizationService.updateOrganization(id, organizationData).subscribe({
        next: (organization) => {
          if (organization) {
            this.router.navigate(['/organizations']);
          }
        },
        error: (error) => {
          console.error('Error updating organization:', error);
        }
      });
    } else {
      this.organizationService.createOrganization(organizationData).subscribe({
        next: (organization) => {
          this.router.navigate(['/organizations']);
        },
        error: (error) => {
          console.error('Error creating organization:', error);
        }
      });
    }
  }
}
