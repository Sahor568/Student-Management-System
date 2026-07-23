import { Component, inject, OnInit, signal } from '@angular/core';
import { Select } from 'primeng/select';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IStudent } from '../../../../shared/types/student.interface';
import { IClass } from '../../../../shared/types/class.interface';
import { ClassService } from '../../../../shared/services/class.service';
import { AttendanceService } from '../../../../shared/services/attendance.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DROPDOWN_OPTIONS } from '../../../../shared/constants/dropdownItem';
import { INameValue } from '../../../../shared/types/name-Value.interface';
import { ETableActions } from '../../../../shared/components/table/types/table.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { IAttendance } from '../../../../shared/types/attendance.interface';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../../../../shared/constants/api.constants';

interface StudentAttendance {
  student: IStudent;
  status: string;
  existingAttendanceId?: string;
}

@Component({
  selector: 'app-mark-attendance',
  imports: [ReactiveFormsModule, Button, Select, DatePicker, Skeleton, TableModule, FormsModule],
  templateUrl: './mark-attendance.html',
  styleUrl: './mark-attendance.scss',
})
export class MarkAttendance implements OnInit {
  attendance!: IAttendance;
  isEditing = false;
  dateDisabled = false;
  authService = inject(AuthService);
  userRole = this.authService.getCurrentUser().role;
  classes: IClass[] = [];
  students = signal<IStudent[] | []>([]);
  studentAttendances: StudentAttendance[] = [];
  attendanceService = inject(AttendanceService);
  status!: INameValue[];
  protected tableConfig = {
    columns: [
      { field: 'fullName', header: 'Full Name' },
      { field: 'email', header: 'Email' },
      {
        field: 'attendance',
        header: 'Attendance',
        type: 'dropdown',
        options: DROPDOWN_OPTIONS.attendanceStatus,
      },
    ],
  };
  protected loading = signal<boolean>(false);
  protected loadingStudents = signal<boolean>(false);
  protected submitLoading = signal<boolean>(false);
  protected loadingClass = signal<boolean>(false);
  protected readonly ETableActions = ETableActions;
  private classService = inject(ClassService);
  private dialogRef = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  // attendanceId = this.config?.data;
  http = inject(HttpClient);


  attendanceForm = new FormGroup({
    classId: new FormControl(),
    studentId: new FormControl('', Validators.required),
    date: new FormControl(),
    status: new FormControl('', Validators.required),
  });


  ngOnInit() {
    this.loadClasses();
    this.status = DROPDOWN_OPTIONS.attendanceStatus;

    if (this.userRole === 'Teacher') {
      this.dateDisabled = true;
    }

    const attendanceId = this.config?.data;
    if(attendanceId) {
      this.isEditing = true;
      this.getAttendanceById(attendanceId);
    }
  }

  private async loadClasses() {
    this.loadingClass.set(true);
    this.classes = await this.classService.fetchAllClasses();
    this.loadingClass.set(false);
  }

  protected getAttendanceById(attendanceId: string) {
    this.loading.set(true);
    this.http.get<IAttendance>(`${ApiConstants.ATTENDANCE}/${attendanceId}`).subscribe({
      next: (attendance) => {
        this.attendance = attendance;
        this.attendanceForm.patchValue({
          // ...attendance,
          // date: attendance.date ? new Date(attendance.date) : null,
        });
      },
      complete:() => {
        this.loadingClass.set(false);
      }
    });
  }

  onSubmit() {
    this.submitLoading.set(true);

    this.submitLoading.set(false);
  }

  async onClassChange(classId: number) {
    this.students.set([]);
    if (!classId) {
      this.studentAttendances = [];
      return;
    }
    this.loadingStudents.set(true);
    this.students.set(await this.attendanceService.getStudentByClass(classId));
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
