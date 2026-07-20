import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Button } from 'primeng/button';
import { IStudent } from '../../../../shared/types/student.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { TeacherForm } from '../../../teachers/components/teacher-form/teacher-form';

@Component({
  selector: 'app-student-view',
  imports: [ConfirmDialog, Button],
  templateUrl: './student-view.html',
  styleUrl: './student-view.scss',
})
export class StudentView implements OnInit {
  student = signal<IStudent | null>(null);
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  router = inject(Router);
  toastService = inject(ToastService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedStudentId?: number;
  protected loading = signal<boolean>(false);
  private dialogRef = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);

  ngOnInit(): void {
    const studentId = this.config?.data;
    this.selectedStudentId = studentId;
    if (studentId) {
      this.getStudentById(studentId);
    }
  }

  protected getStudentById(studentId: string) {
    this.loading.set(true);
    this.http.get<IStudent>('/students/' + studentId).subscribe({
      next: (student) => {
        this.student.set(student);
      },
      error: (err) => {
        console.error('Failed to load student', err);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  protected deleteStudent(student: IStudent) {
    this.selectedStudentId = student.id;
    this.confirmDialog()?.confirm();
  }

  protected onDeleteAccept() {
    if (this.selectedStudentId !== null) {
      this.http.delete(`/students/${this.selectedStudentId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Teacher deleted successfully');
          this.router.navigate(['/students']);
        },
      });
    }
  }

  protected onEdit(student: IStudent) {
    this.dialogRef.close();

    this.dialogService.open(TeacherForm, {
      data: student.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      draggable: false,
      header: 'Edit Teacher Details',
    });
  }
}
