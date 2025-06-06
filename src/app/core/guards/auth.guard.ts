import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated$.pipe(
        take(1),
        map(isAuthenticated => {
            if (isAuthenticated) {
                return true;
            }
            return router.createUrlTree(['/auth/login']);
        })
    );
};
