import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class LoginComponent {
    loginRequest: LoginRequest = {
        email: '',
        password: ''
    };
    loading = false;
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        if (!this.loginRequest.email || !this.loginRequest.password) {
            this.error = 'Please enter both email and password';
            return;
        }

        this.loading = true;
        this.error = '';

        this.authService.login(this.loginRequest).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.error = err.message || 'Login failed';
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
}
