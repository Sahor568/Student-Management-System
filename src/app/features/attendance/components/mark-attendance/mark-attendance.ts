import { Component, inject, OnInit, signal } from '@angular/core';
import { Select } from 'primeng/select';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IStudent } from '../../../../shared/types/student.interface';
import { IClass } from '../../../../shared/types/class.interface';
import { ClassService } from '../../../../shared/services/class.service';

@Component({
  selector: 'app-mark-attendance',
  imports: [ReactiveFormsModule, Button, Select, DatePicker, RouterLink],
  templateUrl: './mark-attendance.html',
  styleUrl: './mark-attendance.scss',
})
export class MarkAttendance implements OnInit {
  isEditing = false;
  protected loading = signal<boolean>(false);
  protected loadingList = signal<boolean>(false);
  private classService = inject(ClassService);

  classes: IClass[] = [];
  students: IStudent[] = [];
  statusOptions = [
    { label: 'Present', value: 'Present' },
    { label: 'Absent', value: 'Absent' },
    { label: 'Late', value: 'Late' },
  ];

  attendanceForm = new FormGroup({
    classId: new FormControl(),
    studentId: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.loadClasses();
  }

  private async loadClasses(){
    this.loadingList.set(true);
    this.classes = await this.classService.fetchAllClasses();
    this.loadingList.set(false);
  }

  onSubmit() {}

  onClassChange(classId: number) {

  }
}
