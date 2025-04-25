import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Organization, OrganizationResponse } from '../../../core/types/models';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { IconsModule } from '../../../shared/icons/icons.module';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    RouterLink,
    ReactiveFormsModule,
    DataTableComponent,
    IconsModule
  ],
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent implements OnInit {
  organizations: Organization[] = [];
  tableColumns: TableColumn[] = [
    {
      name: 'name',
      label: 'Name',
      sortable: true
    },
    {
      name: 'alias',
      label: 'Alias',
      sortable: true
    },
    {
      name: 'country',
      label: 'Country',
      sortable: true
    },
    {
      name: 'isActive',
      label: 'Status',
      type: 'status',
      cell: (element: Organization) => element.isActive ? 'Active' : 'Inactive'
    },
    {
      name: 'actions',
      label: 'Actions',
      type: 'actions'
    }
  ];

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  loading = false;

  // Search
  searchControl = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get data from resolver
    this.route.data.subscribe((data: any) => {
      const organizationData: OrganizationResponse = data.organizationData;
      this.organizations = organizationData.data;
      this.totalItems = organizationData.total;
    });

    // Setup search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.onSearch(value || '');
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loading = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage + 1,
        limit: this.pageSize,
        search: this.searchControl.value || undefined
      },
      queryParamsHandling: 'merge'
    }).finally(() => {
      this.loading = false;
    });
  }

  onSearch(searchTerm: string): void {
    this.currentPage = 0; // Reset to first page on new search
    this.loading = true;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: 1,
        limit: this.pageSize,
        search: searchTerm || undefined
      },
      queryParamsHandling: 'merge'
    }).finally(() => {
      this.loading = false;
    });
  }

  onActionClick(event: { action: string, row: Organization }): void {
    const { action, row } = event;

    switch (action) {
      case 'view':
        this.router.navigate([row._id], { relativeTo: this.route });
        break;
      case 'edit':
        this.router.navigate(['edit', row._id], { relativeTo: this.route });
        break;
      case 'delete':
        // Implement delete functionality or confirmation dialog
        console.log('Delete organization:', row);
        break;
    }
  }
}
