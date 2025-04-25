import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IconsModule } from '../../icons/icons.module';

export interface TableColumn {
  name: string;    // Column name in the data source
  label: string;   // Display label for the column
  cell?: (element: any) => string; // Optional function to transform cell data
  sortable?: boolean;
  type?: 'text' | 'date' | 'status' | 'actions';
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    IconsModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() set data(value: any[]) {
    this.dataSource = new MatTableDataSource<any>(value);
    if (this.matSort) {
      this.dataSource.sort = this.matSort;
    }
  }

  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showPagination: boolean = true;
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No data available';

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string, row: any }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  currentPage = 0;

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.name);
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.matSort;
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageChange.emit(event);
  }

  onSortChange(event: Sort): void {
    this.sortChange.emit(event);
  }

  onRowClicked(row: any): void {
    this.rowClick.emit(row);
  }

  onActionClick(action: string, row: any): void {
    this.actionClick.emit({ action, row });
  }

  getColumnValue(element: any, column: TableColumn): any {
    if (column.cell) {
      return column.cell(element);
    }

    // Handle nested properties like 'user.name'
    if (column.name.includes('.')) {
      return column.name.split('.').reduce((o, i) => o ? o[i] : null, element);
    }

    return element[column.name];
  }
}
