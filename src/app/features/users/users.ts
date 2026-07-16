import { Component, inject } from '@angular/core';
import {UserList} from "./components/user-list/user-list";

@Component({
  selector: 'app-users',
  imports: [UserList],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {}
