import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { IStudent } from '../../../../shared/types/student.interface';
import { HttpClient } from '@angular/common/http';
import { AppTable } from '../../../../shared/components/table/table';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { StudentView } from '../student-view/student-view';
import { StudentForm } from '../student-form/student-form';
import {
  ETableActions,
  IDataTableConfig,
} from '../../../../shared/components/table/types/table.interface';
import { ApiConstants } from '../../../../shared/constants/api.constants';
import { StudentService } from '../../../../shared/services/student.service';

@Component({
  selector: 'app-student-list',
  imports: [ConfirmDialog, AppTable],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss',
})
export class StudentList implements OnInit {
  students = signal<IStudent[]>([]);
  http = inject(HttpClient);
  router = inject(Router);
  toastService = inject(ToastService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedStudentId?: string;
  private dialogService = inject(DialogService);
  protected loading = signal<boolean>(false);
  private studentService = inject(StudentService);

  protected tableConfig: IDataTableConfig<IStudent> = {
    columns: [
      { field: 'userId', header: 'Id' },
      { field: 'fullName', header: 'Full Name' },
      { field: 'registrationNumber', header: 'Registration Number' },
      { field: 'gender', header: 'Gender' },
      { field: 'email', header: 'Email' },
    ],
    actions: [ETableActions.view, ETableActions.edit, ETableActions.delete],
    searchFields: ['fullName', 'email', 'registrationNumber'],
  };

  ngOnInit(): void {
    this.fetchStudents();
  }

  private async fetchStudents() {
    this.loading.set(true);
    this.students.set(await this.studentService.fetchAllStudents());
    this.loading.set(false);
  }

  protected onView(student: IStudent) {
    this.dialogService
      .open(StudentView, {
        data: student.id,
        closable: true,
        header: 'Student Details',
        draggable: false,
      })
      ?.onClose?.subscribe({
        next: () => {
          this.fetchStudents();
        },
      });
  }

  protected onClick(student?: IStudent) {
    this.dialogService
      .open(StudentForm, {
        data: student?.id,
        closable: true,
        dismissableMask: true,
        closeOnEscape: true,
        header: student ? 'Edit Student Details' : 'Add Student Details',
      })
      ?.onClose?.subscribe({
        next: () => {
          this.fetchStudents();
        },
      });
  }

  protected confirmDelete(id: string) {
    this.selectedStudentId = id;
    this.confirmDialog()?.confirm();
  }

  protected onDeleteAccept() {
    if (this.selectedStudentId !== null) {
      this.http.delete(`${ApiConstants.STUDENT}/${this.selectedStudentId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Student deleted successfully');
        },
        error: (err) => {
          this.toastService.showToast('error', 'Failed', err);
        },
        complete: () => {
          this.fetchStudents();
        },
      });
    }
  }
}
