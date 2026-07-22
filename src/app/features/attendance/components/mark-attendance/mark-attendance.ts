import { Component, inject, OnInit, signal } from '@angular/core';
import { Select } from 'primeng/select';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IStudent } from '../../../../shared/types/student.interface';
import { IClass } from '../../../../shared/types/class.interface';
import { ClassService } from '../../../../shared/services/class.service';
import { AttendanceService } from '../../../../shared/services/attendance.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DROPDOWN_OPTIONS } from '../../../../shared/constants/dropdownItem';
import { INameValue } from '../../../../shared/types/name-Value.interface';
import { AppTable } from '../../../../shared/components/table/table';
import { IDataTableConfig } from '../../../../shared/components/table/types/table.interface';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface StudentAttendance {
  student: IStudent;
  status: string;
  existingAttendanceId?: string;
}


@Component({
  selector: 'app-mark-attendance',
  imports: [ReactiveFormsModule, Button, Select, DatePicker, RouterLink, AppTable],
  templateUrl: './mark-attendance.html',
  styleUrl: './mark-attendance.scss',
})
export class MarkAttendance implements OnInit {
  protected tableConfig: IDataTableConfig<IStudent> = {
    columns: [
      { field: 'fullName', header: 'Full Name' },
      { field: 'email', header: 'Email' },
    ],
  };

  isEditing = false;
  protected loading = signal<boolean>(false);
  protected loadingStudents = signal<boolean>(false);
  protected submitLoading = signal<boolean>(false);
  protected loadingClass = signal<boolean>(false);
  private classService = inject(ClassService);
  dateDisabled = false;
  authService = inject(AuthService);
  userRole = this.authService.getCurrentUser().role;
  private dialogRef = inject(DynamicDialogRef);

  classes: IClass[] = [];
  students: IStudent[] = [];
  studentAttendances: StudentAttendance[] = [];
  attendanceService = inject(AttendanceService);
  status!: INameValue[];

  attendanceForm = new FormGroup({
    classId: new FormControl(),
    studentId: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.loadClasses();
    this.status = DROPDOWN_OPTIONS.attendanceStatus;

    if (this.userRole === 'Teacher') {
      this.dateDisabled = true;
    }
  }

  private async loadClasses() {
    this.loadingClass.set(true);
    this.classes = await this.classService.fetchAllClasses();
    this.loadingClass.set(false);
  }

  onSubmit() {
    this.submitLoading.set(true);

    this.submitLoading.set(false);
  }

  async onClassChange(classId: number) {
    if (!classId) {
      this.studentAttendances = [];
      return;
    }

    this.loadingStudents.set(true);
    this.students = await this.attendanceService.getStudentByClass(classId);
    // this.studentAttendances = this.students.map((student) => ({
    //   student,
    //   status: 'Present',
    // }));
    this.loadingStudents.set(false);

    await this.loadExistingAttendance();
  }

  protected async loadExistingAttendance() {
    this.loadingStudents.set(true);

    this.loadingStudents.set(false);
  }

  protected cancel() {
    this.dialogRef.close();
  }
}
