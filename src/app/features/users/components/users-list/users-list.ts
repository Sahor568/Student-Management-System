import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppTable } from '../../../../shared/components/table/table';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { IUser } from '../../../../shared/types/user.interface';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import {
  ETableActions,
  IDataTableConfig,
} from '../../../../shared/components/table/types/ColumnDef.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { UsersView } from '../users-view/users-view';
import { UsersForm } from '../users-form/users-form';
import { UserService } from '../../../../shared/services/user';

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
  selectedUserId!: string;
  protected tableConfig: IDataTableConfig = {
    columns: [
      { field: 'userId', header: 'Id' },
      { field: 'fullName', header: 'Full Name' },
      { field: 'email', header: 'Email' },
      { field: 'password', header: 'Password' },
      { field: 'role', header: 'Role' },
    ],
    actions: [ETableActions.view, ETableActions.edit, ETableActions.delete],
  };
  private dialogService = inject(DialogService);
  private userService = inject(UserService);

  ngOnInit() {
    this.fetchUsers();
  }

  async fetchUsers() {
    this.users.set(await this.userService.fetchAllUsers());
  }

  onView(user: IUser) {
    this.dialogService.open(UsersView, {
      data: user.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
    });
  }

  onEdit(user: IUser) {
    this.dialogService.open(UsersForm, {
      data: user.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
    });
  }

  confirmDelete(id: string) {
    this.selectedUserId = id;
    this.confirmDialog()?.confirm();
  }
  onDeleteAccept() {
    if (this.selectedUserId !== null) {
      this.http.delete(`/users/${this.selectedUserId}`).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Deleted', 'User deleted successfully');
        },
        error: (err) => {
          this.toastService.showToast('error', 'Failed', err);
        },
        complete: () => {
          this.fetchUsers();
        },
      });
    }
  }
}
