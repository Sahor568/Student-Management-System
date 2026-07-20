import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppTable } from '../../../../shared/components/table/table';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { IUser } from '../../../../shared/types/user.interface';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';

import { DialogService } from 'primeng/dynamicdialog';
import { UserView } from '../user-view/user-view';
import { UserForm } from '../user-form/user-form';
import { UserService } from '../../../../shared/services/user.service';
import {
  ETableActions,
  IDataTableConfig,
} from '../../../../shared/components/table/types/table.interface';
import { ApiConstants } from '../../../../shared/constants/api.constants';

@Component({
  selector: 'app-user-list',
  imports: [AppTable, ConfirmDialog],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  users = signal<IUser[]>([]);
  http = inject(HttpClient);
  router = inject(Router);
  toastService = inject(ToastService);
  confirmDialog = viewChild<ConfirmDialog>('confirmDialog');
  selectedUserId!: string;
  protected tableConfig: IDataTableConfig<IUser> = {
    columns: [
      { field: 'userId', header: 'Id' },
      { field: 'fullName', header: 'Full Name' },
      { field: 'email', header: 'Email' },
      { field: 'password', header: 'Password' },
      { field: 'role', header: 'Role' },
    ],
    actions: [ETableActions.view, ETableActions.edit, ETableActions.delete],
    searchFields: ['fullName', 'email'],
  };
  private dialogService = inject(DialogService);
  private userService = inject(UserService);
  protected loading = signal<boolean>(false);

  ngOnInit() {
    this.fetchUsers();
  }

  private async fetchUsers() {
    this.loading.set(true);
    this.users.set(await this.userService.fetchAllUsers());
    this.loading.set(false);
  }

  onView(user: IUser) {
    this.dialogService
      .open(UserView, {
        data: user.id,
        closable: true,
        header: 'User Details',
        draggable: false,
      })
      ?.onClose?.subscribe({
        next: () => {
          this.fetchUsers();
        },
      });
  }

  onClick(user?: IUser) {
    this.dialogService.open(UserForm, {
      data: user?.id,
      closable: true,
      draggable: false,
      header: user ? 'Edit User Details' : 'Add User Details',
    })
    ?.onClose?.subscribe({
      next: () => {
        this.fetchUsers();
      }
    })
  }

  confirmDelete(id: string) {
    this.selectedUserId = id;
    this.confirmDialog()?.confirm();
  }

  onDeleteAccept() {
    if (this.selectedUserId !== null) {
      this.http.delete(`${ApiConstants.USER}/${this.selectedUserId}`).subscribe({
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
