import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import {Button} from "primeng/button";
import { Router, RouterLink } from '@angular/router';
import { AppTable } from '../../../../shared/components/table/table';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { IUser } from '../../../../shared/types/user.interface';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { ColumnDefInterface } from '../../../../shared/components/table/types/ColumnDef.interface';

@Component({
  selector: 'app-users-list',
  imports: [AppTable, ConfirmDialog],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit {
  users = signal<IUser[]>([]);
  http = inject(HttpClient);
  router = inject(Router);
  toastService = inject(ToastService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedUserId: number | null = null;

  columns: ColumnDefInterface[] = [
    { field: 'userId', header: 'Id' },
    { field: 'fullName', header: 'Full Name' },
    { field: 'email', header: 'Email' },
    { field: 'password', header: 'Password' },
    { field: 'role', header: 'Role' },
  ];

  ngOnInit() {
    this.http.get<IUser[]>('http://localhost:3000/users').subscribe({
      next: (data) =>
        this.users.set(
          data.map((user) => ({
            ...user,
          })),
        ),
    });
  }

  onView(user: IUser) {
    this.router.navigate(['/user-view', user.id]);
  }

  onEdit(user: IUser) {
    this.router.navigate(['/user', user.id]);
  }

  confirmDelete(id: number) {
    this.selectedUserId = id;
    this.confirmDialog()?.confirm();
  }
  onDeleteAccept() {
    if (this.selectedUserId !== null) {
      this.http.delete(`http://localhost:3000/users/${this.selectedUserId}`).subscribe({
        next: () => {
          this.users.update((list) => list.filter((t) => t.id !== this.selectedUserId));
          this.toastService.showToast('success', 'Deleted', 'User deleted successfully');
        },
      });
    }
  }

  onDeleteReject() {
    this.toastService.showToast('error', 'Rejected', 'User deletion cancelled.');
  }
}
