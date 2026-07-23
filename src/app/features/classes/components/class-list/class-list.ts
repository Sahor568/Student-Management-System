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
import { AuthService } from '../../../../core/services/auth.service';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import { ApiConstants } from '../../../../shared/constants/api.constants';

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
  private authService = inject(AuthService);
  private userRole = this.authService.isTeacher();

  protected tableConfig: IDataTableConfig<IClass> = {
    columns: [
      { field: 'className', header: 'Class Name' },
      { field: 'teacherName', header: 'Teacher Assigned' },
      { field: 'monthlyTuitionFees', header: 'Monthly Fees' },
    ],
    actions: this.userRole
      ? [ETableActions.view]
      : [ETableActions.view, ETableActions.edit, ETableActions.delete],
    searchFields: ['className', 'teacherName'],
  };

  ngOnInit() {
    this.fetchClasses();
  }

  fetchClasses() {
    this.loading.set(true);
    this.http.get<IClass[]>(`${ApiConstants.CLASS}`).subscribe({
      next: (classes) => {
        this.http.get<ITeacher[]>(`${ApiConstants.TEACHER}`).subscribe({
          next: (teachers) => {
            const teacherMap = new Map(teachers.map((t) => [t.id, t.fullName]));
            const mapped = classes.map((c) => ({
              ...c,
              teacherName: teacherMap.get(c.teacherId) ?? 'Not Assigned...',
            }));
            this.classes.set(mapped);
            this.loading.set(false);
          },
          error: () => {
            this.classes.set(classes);
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.loading.set(false);
      },
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
