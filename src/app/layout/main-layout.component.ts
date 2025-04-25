import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/types/models';
import { Subject, takeUntil } from 'rxjs';
import { IconsModule } from '../shared/icons/icons.module';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        IconsModule
    ],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
    currentUser: User | null = null;
    isUserMenuOpen = false;
    private destroy$ = new Subject<void>();

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.currentUser$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(user => {
            this.currentUser = user;
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', this.closeDropdownOnClickOutside.bind(this));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        document.removeEventListener('click', this.closeDropdownOnClickOutside.bind(this));
    }

    toggleUserMenu(event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
        }
        this.isUserMenuOpen = !this.isUserMenuOpen;
    }

    closeDropdownOnClickOutside(event: MouseEvent): void {
        if (this.isUserMenuOpen) {
            const target = event.target as HTMLElement;
            const dropdown = document.querySelector('.user-dropdown');

            if (dropdown && !dropdown.contains(target) && !target.closest('button')) {
                this.isUserMenuOpen = false;
            }
        }
    }

    logout(): void {
        this.authService.logout();
    }
}
