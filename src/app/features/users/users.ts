import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {UsersList} from "./components/users-list/users-list";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [Button, UsersList, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {}
