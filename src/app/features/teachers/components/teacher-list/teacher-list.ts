import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TeacherInterface } from '../../../../shared/types/teacher.interface';
import { ColumnDefInterface } from '../../../../shared/components/reusables/table/types/ColumnDef.interface';
import { AppTable } from '../../../../shared/components/reusables/table/table';
import { ConfirmDialog } from '../../../../shared/components/reusables/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [AppTable, ConfirmDialog],
  templateUrl: './teacher-list.html',
})
export class TeacherList implements OnInit {
  teachers = signal<TeacherInterface[]>([]);
  http = inject(HttpClient);
  router = inject(Router);
  toastService = inject(ToastService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedTeacherId: number | null = null;

  columns: ColumnDefInterface[] = [
    { field: 'userId', header: 'Id' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'address', header: 'Address' },
    { field: 'status', header: 'Status' },
  ];

  ngOnInit() {
    this.http.get<TeacherInterface[]>('http://localhost:3000/teachers').subscribe({
      next: (data) =>
        this.teachers.set(
          data.map((teacher) => ({
            ...teacher
          })),
        ),
    });
  }

  onView(teacher: TeacherInterface) {
    this.router.navigate(['/teacher-view', teacher.id]);
  }

  onEdit(teacher: TeacherInterface) {
    this.router.navigate(['/teacher', teacher.id]);
  }

  confirmDelete(id: number) {
    this.selectedTeacherId = id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedTeacherId !== null) {
      this.http.delete(`http://localhost:3000/teachers/${this.selectedTeacherId}`)
        .subscribe({
          next: () => {
            this.teachers.update((list) => list.filter((t) => t.id !== this.selectedTeacherId));
            this.toastService.showToast('success', 'Deleted', 'Teacher deleted successfully',
            );
          },
        });
    }
  }

  onDeleteReject() {
    this.toastService.showToast('error', 'Rejected', 'Teacher deletion cancelled.');
  }
}
