import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import {
  ETableActions,
  IDataTableConfig,
} from '../../../../shared/components/table/types/ColumnDef.interface';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TeacherView } from '../teacher-view/teacher-view';
import { AppTable } from '../../../../shared/components/table/table';
import { TeacherForm } from '../teacher-form/teacher-form';
import { ApiConstants } from '../../../../shared/constants/api.constants';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [AppTable, ConfirmDialog],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.scss',
})
export class TeacherList implements OnInit {
  protected confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  protected tableConfig: IDataTableConfig = {
    columns: [
      { field: 'userId', header: 'Id' },
      { field: 'fullName', header: 'Full Name' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      { field: 'address', header: 'Address' },
      { field: 'status', header: 'Status' },
    ],
    actions: [ETableActions.view, ETableActions.edit, ETableActions.delete],
  };
  protected teachers = signal<ITeacher[]>([]);
  protected loading = signal<boolean>(false);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private selectedTeacherId?: string;

  ngOnInit() {
    this.fetchTeachers();
  }

  onView(teacher: ITeacher) {
    this.dialogService.open(TeacherView, {
      data: teacher.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      // header: teacher.fullName,
      header: 'Teacher Details',
    });
  }

  onEdit(teacher: ITeacher) {
    this.dialogService
      .open(TeacherForm, {
        data: teacher.id,
        closable: true,
        showHeader: false,
      })
      ?.onClose?.subscribe({
        next: () => {
          this.fetchTeachers();
        },
      });
  }

  confirmDelete(id: string) {
    this.selectedTeacherId = id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedTeacherId !== null) {
      this.http.delete(`${ApiConstants.TEACHER}/${this.selectedTeacherId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Teacher deleted successfully');
        },
        error: (err) => {
          this.toastService.showToast('error', 'Failed', err);
        },
        complete: () => {
          this.fetchTeachers();
        },
      });
    }
  }

  private fetchTeachers() {
    this.loading.set(true);
    this.http.get<ITeacher[]>(ApiConstants.TEACHER).subscribe({
      next: (data) => {
        this.teachers.set(
          data.map((teacher) => ({
            ...teacher,
          })),
        );
      },
      complete: () => {
        console.log('ping');
        this.loading.set(false);
      },
    });
  }
}
