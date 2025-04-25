import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../types/enums';

export function roleGuard(allowedRoles: UserRole[]): Observable<boolean | UrlTree> {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        take(1),
        map(user => {
            // First check if the user is authenticated
            if (!user) {
                return router.createUrlTree(['/auth/login']);
            }

            // Then check if user has the required role
            if (allowedRoles.includes(user.role)) {
                return true;
            }

            // If not, redirect to dashboard or unauthorized page
            return router.createUrlTree(['/dashboard']);
        })
    );
}
