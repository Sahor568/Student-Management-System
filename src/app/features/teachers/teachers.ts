import { Component } from '@angular/core';
import { TeacherList } from './components/teacher-list/teacher-list';

@Component({
  selector: 'app-teachers',
  imports: [TeacherList],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
})
export class Teachers {}
