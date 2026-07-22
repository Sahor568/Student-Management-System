import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Button } from 'primeng/button';
import { IStudent } from '../../../../shared/types/student.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { TeacherForm } from '../../../teachers/components/teacher-form/teacher-form';
import { ClassService } from '../../../../shared/services/class.service';

@Component({
  selector: 'app-student-view',
  imports: [ConfirmDialog, Button],
  templateUrl: './student-view.html',
  styleUrl: './student-view.scss',
})
export class StudentView implements OnInit {
  student = signal<IStudent | null>(null);
  className = signal<string | null>(null);
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  router = inject(Router);
  toastService = inject(ToastService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedStudentId?: number;
  protected loading = signal<boolean>(false);
  private dialogRef = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);
  private classService = inject(ClassService);

  ngOnInit(): void {
    const studentId = this.config?.data;
    this.selectedStudentId = studentId;
    if (studentId) {
      this.getStudentById(studentId);
    }
  }

  protected async getStudentById(studentId: string) {
    this.loading.set(true);
    this.http.get<IStudent>('/students/' + studentId).subscribe({
      next: async (student) => {
        this.student.set(student);

        const classes = await this.classService.fetchAllClasses();

        let cls = classes.find((c) => c.id === student.classId);

        this.className.set(cls?.className ?? null);

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
      header: 'Edit Teacher Details',
      draggable: false,
    });
  }
}
