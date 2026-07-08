import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { IStudent } from '../../../../shared/types/student.interface';
import { HttpClient } from '@angular/common/http';
import {
  ETableActions,
  IDataTableConfig,
} from '../../../../shared/components/table/types/ColumnDef.interface';
import { AppTable } from '../../../../shared/components/table/table';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { StudentView } from '../student-view/student-view';
import { StudentForm } from '../student-form/student-form';

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
  private dialogService = inject(DialogService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedStudentId?: string;

  protected tableConfig: IDataTableConfig = {
    columns: [
      { field: 'userId', header: 'Id' },
      { field: 'fullName', header: 'Full Name' },
      { field: 'registrationNumber', header: 'Registration Number' },
      { field: 'gender', header: 'Gender' },
      { field: 'email', header: 'email' },
    ],
    actions: [ETableActions.view, ETableActions.edit, ETableActions.delete],
  };

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents() {
    this.http.get<IStudent[]>('http://localhost:3000/students').subscribe({
      next: (data) =>
        this.students.set(
          data.map((teacher) => ({
            ...teacher,
          })),
        ),
    });
  }

  onView(student: IStudent) {
    this.dialogService.open(StudentView, {
      data: student.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      header: "Student Details",
    });
  }

  onEdit(student: IStudent) {
    this.dialogService.open(StudentForm, {
      data: student.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      // header: 'Edit Teacher Details',
    });
  }

  confirmDelete(id: string) {
    this.selectedStudentId = id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedStudentId !== null) {
      this.http.delete(`http://localhost:3000/students/${this.selectedStudentId}`).subscribe({
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
