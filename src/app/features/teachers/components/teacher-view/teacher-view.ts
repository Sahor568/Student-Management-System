import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TeacherForm } from '../teacher-form/teacher-form';

@Component({
  selector: 'app-teacher-view',
  imports: [Button, ConfirmDialog],
  templateUrl: './teacher-view.html',
  styleUrl: './teacher-view.scss',
})
export class TeacherView implements OnInit {
  teacher = signal<ITeacher | null>(null);
  http = inject(HttpClient);
  private router = inject(Router);
  toastService = inject(ToastService);
  config = inject(DynamicDialogConfig);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedTeacherId?: number;
  private dialogService = inject(DialogService);
  private dialogRef = inject(DynamicDialogRef);

  ngOnInit(): void {
    const teacherId = this.config?.data;
    this.selectedTeacherId = teacherId;
    if (teacherId) {
      this.getTeacherById(teacherId);
    }
  }

  getTeacherById(teacherId: string): void {
    this.http.get<ITeacher>('/teachers/' + teacherId).subscribe({
      next: (teacher) => {
        this.teacher.set(teacher);
      },
      error: (err) => {
        console.error('Failed to load teacher', err);
      },
    });
  }

  deleteTeacher(teacher: ITeacher): void {
    this.selectedTeacherId = teacher.id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedTeacherId !== null) {
      this.http.delete(`/teachers/${this.selectedTeacherId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Teacher deleted successfully');
          this.dialogRef.close();
        },
      });
    }
  }

  onEdit(teacher: ITeacher) {
    this.dialogRef.close();

    this.dialogService.open(TeacherForm, {
      data: teacher.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      header: 'Edit Teacher Details',
    });
  }
}
