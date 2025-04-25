import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TenderService } from '../../core/services/tender.service';
import { TenderStats } from '../../core/types/models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterLink
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    stats: TenderStats | null = null;
    loading = true;
    error = '';

    constructor(private tenderService: TenderService) { }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.loading = true;
        this.tenderService.getTenderStats().subscribe({
            next: (stats) => {
                this.stats = stats;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Failed to load dashboard statistics';
                this.loading = false;
                console.error('Error loading stats:', error);
            }
        });
    }
}
