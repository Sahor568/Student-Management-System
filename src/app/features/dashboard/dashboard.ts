import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IStudent } from '../../shared/types/student.interface';
import { StudentService } from '../../shared/services/student.service';
import { ITeacher } from '../../shared/types/teacher.interface';
import { IClass } from '../../shared/types/class.interface';
import { ClassService } from '../../shared/services/class.service';
import { TeacherService } from '../../shared/services/teacher.service';
import { IAttendance } from '../../shared/types/attendance.interface';
import { AttendanceService } from '../../shared/services/attendance.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  totalStudents = signal<IStudent[]>([]);
  totalTeachers = signal<ITeacher[]>([]);
  totalClasses = signal<IClass[]>([]);
  totalAttendance = signal<IAttendance[]>([]);
  studentService = inject(StudentService);
  teacherService = inject(TeacherService);
  classService = inject(ClassService);
  attendanceService = inject(AttendanceService);

  async ngOnInit() {
    this.totalStudents.set(await this.studentService.fetchAllStudents());
    this.totalTeachers.set(await this.teacherService.fetchAllTeachers());
    this.totalClasses.set(await this.classService.fetchAllClasses());

    this.getTodayAttendanceCount();
  }

  async getTodayAttendanceCount() {
    const allAttendance = await this.attendanceService.fetchAllAttendance();
    const todayDate = new Date().toISOString().split('T')[0];
    const todayAttendance = allAttendance.filter((record) => record.date === todayDate);
    this.totalAttendance.set(todayAttendance);
  }
}
