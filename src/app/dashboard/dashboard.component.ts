import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TenderService } from '../core/services/tender.service';
import { User, Tender, TenderStats } from '../core/types/models';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { TenderStatus } from '../core/types/enums';

interface ProjectData {
    name: string;
    role?: string;
    organization: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    dueDate: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
    currentUser: User | null = null;
    private destroy$ = new Subject<void>();
    isLoading = true;
    error = '';

    // Dashboard stats
    openTenders = 0;
    pendingActions = 0;
    closedTenders = 0;

    // Trend percentages
    openTrendPercent = 0;
    pendingTrendPercent = 0;
    closedTrendPercent = 0;

    // Project data
    upcomingProjects: ProjectData[] = [];
    recentTenders: Tender[] = [];

    constructor(
        private authService: AuthService,
        private tenderService: TenderService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(user => {
            this.currentUser = user;
            if (!user) {
                this.router.navigate(['/auth/login']);
            } else {
                this.loadDashboardData();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadDashboardData(): void {
        this.isLoading = true;

        // Get stats and upcoming tenders
        forkJoin({
            stats: this.tenderService.getTenderStats(),
            openTenders: this.tenderService.getTenders(undefined, TenderStatus.DRAFT, undefined, undefined, undefined, 1, 5),
            pendingTenders: this.tenderService.getTenders(undefined, TenderStatus.IN_PROGRESS, undefined, undefined, undefined, 1, 5)
        }).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (response) => {
                // Update stats
                const stats = response.stats;
                this.openTenders = stats.active;
                this.closedTenders = stats.completed;
                this.pendingActions = Math.floor(stats.active * 0.1); // Assume 10% of active tenders need attention

                // Update trends
                this.openTrendPercent = Math.round(stats.growth);
                this.closedTrendPercent = Math.round(stats.growth / 3);
                this.pendingTrendPercent = -Math.round(stats.growth / 4.5);

                // Transform tenders to project data for the table
                this.upcomingProjects = this.transformTendersToProjects(
                    [...response.openTenders.data.slice(0, 2), ...response.pendingTenders.data.slice(0, 2)]
                );

                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading dashboard data:', err);
                this.error = 'Failed to load dashboard data. Please try again.';
                this.isLoading = false;

                // Fallback to sample data
                this.loadSampleData();
            }
        });
    }

    // Fallback method to load sample data if API fails
    loadSampleData(): void {
        this.openTenders = 20;
        this.pendingActions = 2;
        this.closedTenders = 48;

        this.openTrendPercent = 9;
        this.pendingTrendPercent = -2;
        this.closedTrendPercent = 3;

        this.upcomingProjects = [
            { name: 'Sunil Joshi', organization: 'ISRO', priority: 'Low', dueDate: '-' },
            { name: 'Andrew McDownland', role: 'Project Manager', organization: 'ISRO', priority: 'Medium', dueDate: '-' },
            { name: 'Christopher Jamil', role: 'Project Manager', organization: 'ISRO', priority: 'High', dueDate: '-' },
            { name: 'Nirav Joshi', role: 'Engineer', organization: 'ISRO', priority: 'Critical', dueDate: '-' }
        ];
    }

    // Transform tenders data to project data format
    transformTendersToProjects(tenders: Tender[]): ProjectData[] {
        return tenders.map(tender => {
            // Determine priority based on tender status and dates
            let priority: 'Low' | 'Medium' | 'High' | 'Critical';
            const now = new Date();
            const submission = tender.dates?.submission ? new Date(tender.dates.submission) : null;

            if (tender.status === TenderStatus.DRAFT) {
                priority = 'Low';
            } else if (tender.status === TenderStatus.IN_PROGRESS) {
                if (submission && submission.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
                    priority = 'Critical';
                } else if (submission && submission.getTime() - now.getTime() < 14 * 24 * 60 * 60 * 1000) {
                    priority = 'High';
                } else {
                    priority = 'Medium';
                }
            } else {
                priority = 'Low';
            }

            return {
                name: tender.createdBy || 'Assigned User',
                role: 'Tender Manager',
                organization: tender.organizationId,
                priority,
                dueDate: submission ? submission.toLocaleDateString() : '-'
            };
        });
    }

    getPriorityClass(priority: string): string {
        switch (priority) {
            case 'Low':
                return 'priority-low';
            case 'Medium':
                return 'priority-medium';
            case 'High':
                return 'priority-high';
            case 'Critical':
                return 'priority-critical';
            default:
                return 'priority-low';
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
