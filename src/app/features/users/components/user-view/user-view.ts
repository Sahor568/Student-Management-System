import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../../../shared/types/user.interface';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-user-view',
  imports: [ConfirmDialog, Button],
  templateUrl: './user-view.html',
  styleUrl: './user-view.scss',
})
export class UserView implements OnInit {
  user = signal<IUser | null>(null);
  protected loading = signal<boolean>(false);
  selectedUserId?: number;
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  toastService = inject(ToastService);
  router = inject(Router);
  private dialogService = inject(DialogService);
  private dialogRef = inject(DynamicDialogRef);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');

  ngOnInit(): void {
    const userId = this.config?.data;
    this.selectedUserId = userId;
    if (userId) {
      this.getUserById(userId);
    }
  }
  private getUserById(userId: string) {
    this.loading.set(true);

    this.http.get<IUser>('/users/' + userId).subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: (err) => {
        console.error('Failed to load user', err);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  protected deleteUser(user: IUser) {
    this.selectedUserId = user.id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedUserId !== null) {
      this.http.delete(`/users/${this.selectedUserId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'Teacher deleted successfully');
          this.router.navigate(['/teachers']);
        },
      });
    }
  }

  protected onEdit(user: IUser) {
    this.dialogRef.close();

    this.dialogService.open(UserForm, {
      data: user.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      draggable: false,
      header: 'Edit User Details',
    });
  }
}
