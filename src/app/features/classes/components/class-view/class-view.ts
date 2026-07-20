import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Button } from 'primeng/button';
import { IClass } from '../../../../shared/types/class.interface';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { ClassForm } from '../class-form/class-form';
import { ApiConstants } from '../../../../shared/constants/api.constants';
import { TeacherService } from '../../../../shared/services/teacher.service';

@Component({
  selector: 'app-class-view',
  imports: [ConfirmDialog, Button],
  templateUrl: './class-view.html',
  styleUrl: './class-view.scss',
})
export class ClassView implements OnInit {
  class = signal<IClass | null>(null);
  teacherName = signal<string | null>(null);
  selectedClassId?: number;
  protected loading = signal<boolean>(false);
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private dialogRef = inject(DynamicDialogRef);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  teacherService = inject(TeacherService);

  ngOnInit(): void {
    const classId = this.config?.data;
    this.selectedClassId = classId;
    if (classId) {
      this.getClassById(classId);
    }
  }

  async getClassById(classId: string): Promise<void> {
    this.loading.set(true);

    this.http.get<IClass>(`/classes/${classId}`).subscribe({
      next: async (classItem) => {
        this.class.set(classItem);

        const teachers = await this.teacherService.fetchAllTeachers();

        const teacher = teachers.find((t) => Number(t.userId) === Number(classItem.teacherId));

        this.teacherName.set(teacher?.fullName ?? null);

        this.loading.set(false);
      }
    });
  }

  onEdit(classItem: IClass): void {
    this.dialogRef.close();

    this.dialogService.open(ClassForm, {
      data: classItem.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      draggable: false,
      header: 'Edit Class Details',
    });
  }
  deleteClass(classItem: IClass) {
    this.selectedClassId = classItem.id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedClassId !== null) {
      this.http.delete(`${ApiConstants.CLASS}/${this.selectedClassId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Class deleted successfully');
          this.dialogRef.close();
        },
      });
    }
  }
}
