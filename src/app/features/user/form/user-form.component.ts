import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/types/models';
import { UserRole } from '../../../core/types/enums';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterLink
  ],
  template: `
    <div class="user-form-container">
      <h1 class="page-title">{{ isEditMode ? 'Edit' : 'Create' }} User</h1>

      <mat-card>
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" required>
              <mat-error *ngIf="userForm.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" required>
              <mat-error *ngIf="userForm.get('fullName')?.hasError('required')">
                Full name is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" required type="email">
              <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" required>
                <mat-option *ngFor="let role of userRoles" [value]="role">
                  {{ role }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="userForm.get('role')?.hasError('required')">
                Role is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" [required]="!isEditMode">
              <mat-error *ngIf="userForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <mat-label>Confirm Password</mat-label>
              <input matInput formControlName="confirmPassword" type="password" [required]="!isEditMode">
              <mat-error *ngIf="userForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="userForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>
          </div>

          <div class="button-row">
            <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
            <button mat-stroked-button type="button" routerLink="/users">Cancel</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-form-container {
      padding: 20px;
    }

    .page-title {
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-field {
      flex: 1;
    }

    .button-row {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userRoles = Object.values(UserRole);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [UserRole.USER, Validators.required],
      password: ['', this.isEditMode ? [] : [Validators.required]],
      confirmPassword: ['', this.isEditMode ? [] : [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;

    if (this.isEditMode && id) {
      this.userService.getUser(id).subscribe({
        next: (user) => {
          if (user) {
            this.userForm.patchValue({
              username: user.username,
              fullName: user.fullName,
              email: user.email,
              role: user.role
            });
          } else {
            this.router.navigate(['/users']);
          }
        },
        error: (error) => {
          console.error('Error loading user:', error);
          this.router.navigate(['/users']);
        }
      });
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const userData = {
      username: this.userForm.value.username,
      fullName: this.userForm.value.fullName,
      email: this.userForm.value.email,
      role: this.userForm.value.role
    };

    const id = this.route.snapshot.paramMap.get('id');

    if (this.isEditMode && id) {
      this.userService.updateUser(id, userData).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/users']);
          }
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: (user) => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }
}
