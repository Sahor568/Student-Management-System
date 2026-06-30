import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { ColumnDefInterface } from './types/ColumnDef.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, Button],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class AppTable<T extends { id: number }> {
  @Input() data: T[] = [];
  @Input() columns: ColumnDefInterface[] = [];
  @Input() emptyMessage: string = 'No records found.';

  @Output() deleteItem = new EventEmitter<number>();
  @Output() editItem = new EventEmitter<T>();
  @Output() viewItem = new EventEmitter<T>();
}
