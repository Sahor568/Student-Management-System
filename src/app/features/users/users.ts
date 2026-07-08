import { Component, inject } from '@angular/core';
import {Button} from "primeng/button";
import {UsersList} from "./components/users-list/users-list";
import { UsersForm } from './components/users-form/users-form';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-users',
  imports: [Button, UsersList],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private dialogService = inject(DialogService);

  protected addUser() {
    this.dialogService.open(UsersForm, {
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
    });
  }
}
