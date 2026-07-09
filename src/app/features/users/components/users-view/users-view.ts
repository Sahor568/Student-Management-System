import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../../../shared/types/user.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-users-view',
  imports: [ConfirmDialog, Button, RouterLink],
  templateUrl: './users-view.html',
  styleUrl: './users-view.scss',
})
export class UsersView implements OnInit {
  user = signal<IUser | null>(null);
  selectedUserId?: number;
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  toastService = inject(ToastService);
  router = inject(Router);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');

  ngOnInit(): void {
    const userId = this.config?.data;
    this.selectedUserId = userId;
    if (userId) {
      this.getUserById(userId);
    }
  }
  private getUserById(userId: string) {
    this.http.get<IUser>('/users/' + userId).subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: (err) => {
        console.error('Failed to load user', err);
      },
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
}
