import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-teacher-view',
  imports: [Button, RouterLink, ConfirmDialog],
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
          this.router.navigate(['/teachers']);
        },
      });
    }
  }
}
