import { Component, input, linkedSignal, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';
import { EntityMap, ETableActions, IDataTableConfig } from './types/table.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, Button, InputText, FormsModule, Skeleton],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class AppTable<K extends keyof EntityMap> {
  public key = input.required<K>();
  public data = input.required<EntityMap[K][]>();
  public config = input.required<IDataTableConfig<EntityMap[K]>>();
  public loading = input<boolean>(false);
  public onView = output<EntityMap[K]>();
  public onAdd = output();
  public onEdit = output<EntityMap[K]>();
  public onDelete = output<string>();
  protected localData = linkedSignal(() => this.data());
  protected readonly ETableActions = ETableActions;
  protected searchTerm: string = '';

  protected eSearch(): void {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      this.localData.set(this.data());
      return;
    }

    const fields =
      this.config().searchFields ?? this.config().columns.map((column) => column.field);

    this.localData.set(
      this.data().filter((item) =>
        fields.some((field) => {
          const value = item[field];
          return String(value).toLowerCase().includes(search);
        }),
      ),
    );
  }
}
