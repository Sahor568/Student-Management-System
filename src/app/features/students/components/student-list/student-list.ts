import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { IStudent } from '../../../../shared/types/student.interface';
import { HttpClient } from '@angular/common/http';
import { ColumnDefInterface } from '../../../../shared/components/table/types/ColumnDef.interface';
import { AppTable } from '../../../../shared/components/table/table';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import { Router } from '@angular/router';

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
  selectedStudentId: number | null = null;

  columns: ColumnDefInterface[] = [
    { field: 'userId', header: 'Id' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'gender', header: 'Gender' },
  ];

  ngOnInit(): void {
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
    this.router.navigate(['/student-view', student.id]);
  }

  onEdit(student: IStudent) {
    this.router.navigate(['/student', student.id]);
  }

  confirmDelete(id: number) {
    this.selectedStudentId = id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {}

  onDeleteReject() {
    this.toastService.showToast('error', 'Rejected', 'Student deletion cancelled.');
  }
}
