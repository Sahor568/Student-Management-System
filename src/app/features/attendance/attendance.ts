import { Component } from '@angular/core';
import { AttendanceList } from './components/attendance-list/attendance-list';


@Component({
  selector: 'app-attendance',
  imports: [AttendanceList],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})

export class Attendance {}
