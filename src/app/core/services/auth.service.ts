import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, AuthResponse, LoginDto, RegisterDto } from '../types/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private tokenKey = 'auth_token';
    private userKey = 'auth_user';

    private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient) { }

    login(credentials: LoginDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => this.handleAuthentication(response)),
            catchError(error => {
                console.error('Login error:', error);
                return throwError(() => new Error(error.error?.message || 'Login failed. Please try again.'));
            })
        );
    }

    register(userData: RegisterDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => this.handleAuthentication(response)),
            catchError(error => {
                console.error('Registration error:', error);
                return throwError(() => new Error(error.error?.message || 'Registration failed. Please try again.'));
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    }

    getProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
            tap(user => {
                this.currentUserSubject.next(user);
            }),
            catchError(error => {
                console.error('Profile fetch error:', error);
                if (error.status === 401) {
                    this.logout();
                }
                return throwError(() => new Error('Failed to load user profile.'));
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Helper methods
    private handleAuthentication(response: AuthResponse): void {
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }

    private getUserFromStorage(): User | null {
        const userJson = localStorage.getItem(this.userKey);
        if (userJson) {
            try {
                return JSON.parse(userJson) as User;
            } catch (e) {
                console.error('Error parsing stored user:', e);
                return null;
            }
        }
        return null;
    }
}
