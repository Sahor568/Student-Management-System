import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeacherList } from './components/teacher-list/teacher-list';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-teachers',
  imports: [RouterLink, TeacherList, Button],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
})
export class Teachers {}
