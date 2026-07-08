import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import {Button} from "primeng/button";
import { Router, RouterLink } from '@angular/router';
import { AppTable } from '../../../../shared/components/table/table';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { IUser } from '../../../../shared/types/user.interface';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { ETableActions, IDataTableConfig } from '../../../../shared/components/table/types/ColumnDef.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { UsersView } from '../users-view/users-view';
import { TeacherForm } from '../../../teachers/components/teacher-form/teacher-form';
import { UsersForm } from '../users-form/users-form';

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
  private dialogService = inject(DialogService);
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

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
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
      this.http.delete(`http://localhost:3000/users/${this.selectedUserId}`).subscribe({
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
