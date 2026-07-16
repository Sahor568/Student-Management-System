import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { IClass } from '../../../../shared/types/class.interface';
import { AppTable } from '../../../../shared/components/table/table';
import {
  ETableActions,
  IDataTableConfig,
} from '../../../../shared/components/table/types/table.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { ClassForm } from '../class-form/class-form';
import { ClassView } from '../class-view/class-view';

@Component({
  selector: 'app-class-list',
  imports: [ConfirmDialog, AppTable],
  templateUrl: './class-list.html',
  styleUrl: './class-list.scss',
})
export class ClassList implements OnInit {
  protected classes = signal<IClass[]>([]);
  protected loading = signal<boolean>(false);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private selectedClassId?: string;
  private dialogService = inject(DialogService);
  protected confirmDialog = viewChild<ConfirmDialog>('confirmDialog');

  protected tableConfig: IDataTableConfig<IClass> = {
    columns: [
      { field: 'classId', header: 'Id' },
      { field: 'className', header: 'Class Name' },
      { field: 'section', header: 'Section' },
      { field: 'monthlyTuitionFees', header: 'Monthly Fees' },
    ],
    actions: [ETableActions.view, ETableActions.edit, ETableActions.delete],
    searchFields: ['className', 'section'],
  };

  ngOnInit() {
    this.fetchClasses();
  }

  fetchClasses() {
    this.loading.set(true);
    this.http.get<IClass[]>('/classes').subscribe({
      next: (data) => {
        this.classes.set(data);
      },
      error: (err) => {
        this.toastService.showToast('error', 'Failed', err.message);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  onView(classItem?: IClass) {
    this.dialogService
      .open(ClassView, {
        data: classItem?.id,
        closable: true,
        header: 'Class Details',
        draggable: false,
      })
      ?.onClose?.subscribe({
        next: () => {
          this.fetchClasses();
        },
      });
  }

  protected onClick(classItem?: IClass) {
    this.dialogService
      .open(ClassForm, {
        data: classItem?.id,
        closable: true,
        draggable: false,
        header: classItem ? 'Edit Class Details' : 'Add Class Details',
      })
      ?.onClose?.subscribe({
        next: () => {
          this.fetchClasses();
        },
      });
  }

  confirmDelete(id: string) {
    this.selectedClassId = id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedClassId !== null) {
      this.http.delete(`/classes/${this.selectedClassId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Classes deleted successfully');
        },
        error: (err) => {
          this.toastService.showToast('error', 'Failed', err);
        },
        complete: () => {
          this.fetchClasses();
        },
      });
    }
  }
}
