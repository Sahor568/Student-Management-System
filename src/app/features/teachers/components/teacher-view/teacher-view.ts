import { Component, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TeacherForm } from '../teacher-form/teacher-form';
import { ApiConstants } from '../../../../shared/constants/api.constants';

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
  protected loading = signal<boolean>(false);

  ngOnInit(): void {
    const teacherId = this.config?.data;
    this.selectedTeacherId = teacherId;
    if (teacherId) {
      this.getTeacherById(teacherId);
    }
  }

  getTeacherById(teacherId: string): void {
    this.loading.set(true);
    this.http.get<ITeacher>('/teachers/' + teacherId).subscribe({
      next: (teacher) => {
        this.teacher.set(teacher);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  onEdit(teacher: ITeacher) {
    this.dialogRef.close();

    this.dialogService.open(TeacherForm, {
      data: teacher.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      draggable: false,
      header: 'Edit Teacher Details',
    });
  }

  deleteTeacher(teacher: ITeacher): void {
    this.selectedTeacherId = teacher.id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedTeacherId !== null) {
      this.http.delete(`${ApiConstants.TEACHER}/${this.selectedTeacherId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Teacher deleted successfully');
        },
        complete: () => {
          this.dialogRef.close();
        }
      });
    }
  }
}
