import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { AttendanceList } from './components/attendance-list/attendance-list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-attendance',
  imports: [Button, AttendanceList, RouterLink],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class Attendance {}
