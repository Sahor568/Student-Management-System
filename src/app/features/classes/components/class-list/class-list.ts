import { Component, inject, signal } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { IClass } from '../../../../shared/types/class.interface';
// import { AppTable } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-class-list',
  imports: [ConfirmDialog,],
  templateUrl: './class-list.html',
  styleUrl: './class-list.scss',
})
export class ClassList {
  protected classes = signal<IClass[]>([]);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private selectedClassId?: string;

  fetchClasses() {
    this.http.get<IClass[]>('/classes').subscribe({
      next: (data) => {
        this.classes.set(data);
      },
      error: (err) => {
        this.toastService.showToast('error', 'Failed', err.message);
      },
    });
  }

  onDeleteAccept() {
    if (this.selectedClassId !== null) {
      this.http.delete(`/classes/${this.selectedClassId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Classes deleted successfully');
        },
        error: (err) => {
          this.toastService.showToast('error', 'Failed', err);
        },
        complete: () => {
          this.fetchClasses();
        },
      });
    }
  }
}
