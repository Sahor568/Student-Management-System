import { Component, input, linkedSignal, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { EntityMap, ETableActions, IDataTableConfig } from './types/ColumnDef.interface';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, Button, InputText, FormsModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class AppTable<K extends keyof EntityMap> {
  public key = input.required<K>();
  public data = input.required<EntityMap[K][]>();
  public config = input.required<IDataTableConfig>();
  public onView = output<EntityMap[K]>();
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

    this.localData.set(
      this.data().filter((item) =>
        String(item.fullName).toLowerCase().includes(search)),
    );
  }
}
