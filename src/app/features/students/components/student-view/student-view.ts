import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Button } from 'primeng/button';
import { IStudent } from '../../../../shared/types/student.interface';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-student-view',
  imports: [ConfirmDialog, Button, RouterLink],
  templateUrl: './student-view.html',
  styleUrl: './student-view.scss',
})
export class StudentView implements OnInit {
  student = signal<IStudent | null>(null);
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  router=inject(Router);
  toastService = inject(ToastService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedStudentId?: number;

  ngOnInit(): void {
    const studentId = this.config?.data;
    this.selectedStudentId = studentId;
    if (studentId) {
      this.getStudentById(studentId);
    }
  }

  protected getStudentById(studentId: string) {
    this.http.get<IStudent>('/students/' + studentId).subscribe({
      next: (student) => {
        this.student.set(student);
      },
      error: (err) => {
        console.error('Failed to load student', err);
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
}
