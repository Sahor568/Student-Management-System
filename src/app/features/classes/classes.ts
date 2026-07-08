import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { UsersList } from '../users/components/users-list/users-list';
import { ClassList } from './components/class-list/class-list';

@Component({
  selector: 'app-classes',
  imports: [Button, RouterLink, ClassList],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class Classes {}
