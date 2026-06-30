import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { TeacherInterface } from '../../../../shared/types/teacher.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialog } from '../../../../shared/components/reusables/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-teacher-view',
  imports: [Button, RouterLink, ConfirmDialog],
  templateUrl: './teacher-view.html',
  styleUrl: './teacher-view.scss',
})
export class TeacherView implements OnInit {
  teacher = signal<TeacherInterface | null>(null);

  http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  toastService = inject(ToastService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedTeacherId: number | null = null;

  ngOnInit(): void {
    const teacherId = this.route.snapshot.paramMap.get('id');
    if (teacherId) {
      this.getTeacherById(teacherId);
    }
  }

  getTeacherById(teacherId: string): void {
    this.http.get<TeacherInterface>('http://localhost:3000/teachers/' + teacherId).subscribe({
      next: (teacher) => {
        this.teacher.set(teacher);
      },
      error: (err) => {
        console.error('Failed to load teacher', err);
      },
    });
  }

  deleteTeacher(teacher: TeacherInterface): void {
    this.selectedTeacherId = teacher.id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedTeacherId !== null) {
      this.http.delete(`http://localhost:3000/teachers/${this.selectedTeacherId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Teacher deleted successfully');
          this.router.navigate(['/teachers']);
        },
      });
    }
  }

  onDeleteReject() {
    this.toastService.showToast('error', 'Rejected', 'Teacher deletion cancelled.');
  }
}
