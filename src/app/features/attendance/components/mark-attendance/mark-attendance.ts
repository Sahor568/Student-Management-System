import { Component, inject, OnInit } from '@angular/core';
import { Select } from 'primeng/select';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IStudent } from '../../../../shared/types/student.interface';
import { ToastService } from '../../../../shared/services/toast.service';
import { IClass } from '../../../../shared/types/class.interface';

@Component({
  selector: 'app-mark-attendance',
  imports: [ReactiveFormsModule, Button, Select, DatePicker, RouterLink],
  templateUrl: './mark-attendance.html',
  styleUrl: './mark-attendance.scss',
})
export class MarkAttendance implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);

  allStudents: IStudent[] = [];
  filteredStudents: IStudent[] = [];
  classes: IClass[] = [];
  statusOptions = [
    { label: 'Present', value: 'Present' },
    { label: 'Absent', value: 'Absent' },
    { label: 'Late', value: 'Late' },
  ];

  attendanceForm = new FormGroup({
    classId: new FormControl<number | null>(null, Validators.required),
    studentId: new FormControl<string | null>(null, Validators.required),
    date: new FormControl<Date | null>(new Date(), Validators.required),
    status: new FormControl<string | null>(null, Validators.required),
  });

  ngOnInit() {}

  onSubmit() {}
}
