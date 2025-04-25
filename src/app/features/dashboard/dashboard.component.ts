import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TenderStats } from '../../core/types/models';
import { IconsModule } from '../../shared/icons/icons.module';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        IconsModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    stats: TenderStats | null = null;
    loading = false;
    error = '';

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.loading = true;
        // Get resolved stats data
        this.route.data.subscribe(data => {
            this.stats = data['stats'];
            this.loading = false;
        });
    }
}
