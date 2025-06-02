import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, AuthResponse, LoginDto, RegisterDto } from '../types/models';
import { environment } from '../../../environments/environment';
import { UserRole } from '../types/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  // Add isAuthenticated$ observable
  public isAuthenticated$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(private http: HttpClient) {
    // Initialize from localStorage on service creation
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // Mock successful login for demo
    const mockUser: User = {
      id: '1',
      username: 'demo',
      email: email,
      fullName: 'Demo User',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in localStorage
    localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token');
    localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));

    // Update BehaviorSubject
    this.currentUserSubject.next(mockUser);

    return of(mockUser);
  }

  register(userData: RegisterDto): Observable<AuthResponse> {
    // Mock successful registration for demo
    const mockUser: User = {
      id: '2',
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: UserRole.USER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockResponse: AuthResponse = {
      user: mockUser,
      access_token: 'mock-jwt-token'
    };

    // Store in localStorage
    localStorage.setItem(this.TOKEN_KEY, mockResponse.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));

    // Update BehaviorSubject
    this.currentUserSubject.next(mockUser);

    return of(mockResponse);
  }

  logout(): void {
    // Clear localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Clear BehaviorSubject
    this.currentUserSubject.next(null);
  }

  getProfile(): Observable<User> {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      return of(user);
    }
    return throwError(() => new Error('No user found'));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
