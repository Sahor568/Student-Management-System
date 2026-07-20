import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { Select } from 'primeng/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import { DatePicker } from 'primeng/datepicker';
import { INameValue } from '../../../../shared/types/name-Value.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-teacher-form',
  imports: [ReactiveFormsModule, Button, InputText, Select, DatePicker],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.scss',
})
export class TeacherForm implements OnInit {
  teacher?: ITeacher;
  status!: INameValue[];
  gender!: INameValue[];
  religion!: INameValue[];
  bloodGroup!: INameValue[];
  router = inject(Router);
  private route = inject(ActivatedRoute);
  isEditing = false;
  http = inject(HttpClient);
  toastService = inject(ToastService);
  config = inject(DynamicDialogConfig);
  private dialogRef = inject(DynamicDialogRef);
  protected loading = signal<boolean>(false);
  private teacherId = this.config?.data;

  teacherForm = new FormGroup({
    userId: new FormControl(),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    monthlySalary: new FormControl('', Validators.required),
    address: new FormControl(),
    status: new FormControl('', Validators.required),
    nationalId: new FormControl(),
    education: new FormControl(),
    gender: new FormControl(),
    religion: new FormControl(),
    bloodGroup: new FormControl(),
    experience: new FormControl(),
    dob: new FormControl(),
  });

  ngOnInit(): void {
    this.status = [
      { name: 'Active', value: 'Active' },
      { name: 'InActive', value: 'InActive' },
    ];
    this.gender = [
      { name: 'Male', value: 'Male' },
      { name: 'Female', value: 'Female' },
      { name: 'Other', value: 'Other' },
    ];
    this.religion = [
      { name: 'Hindu', value: 'Hindu' },
      { name: 'Muslim', value: 'Muslim' },
      { name: 'Cristian', value: 'Cristian' },
      { name: 'other', value: 'Other' },
    ];
    this.bloodGroup = [
      { name: 'A+', value: 'A+' },
      { name: 'A-', value: 'A-' },
      { name: 'B+', value: 'B+' },
      { name: 'B-', value: 'B-' },
      { name: 'AB+', value: 'AB+' },
      { name: 'AB-', value: 'AB-' },
      { name: 'O+', value: 'O+' },
      { name: 'O-', value: 'O-' },
      { name: 'other', value: 'Other' },
    ];

    const teacherId = this.config?.data;
    if (teacherId) {
      this.isEditing = true;
      this.getTeacherById(teacherId);
    }
  }

  getTeacherById(teacherId: string): void {
    this.loading.set(true);
    this.http.get<ITeacher>('/teachers/' + teacherId).subscribe({
      next: (teacher) => {
        this.teacher = teacher;
        this.teacherForm.patchValue(teacher);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  async onSubmit(): Promise<void> {
    let payload: any = { ...this.teacherForm.getRawValue() };
    let api;

    const getNextId = async () => {
      const teachers = await firstValueFrom(
        this.http.get<ITeacher[]>('/teachers'),
      );
      return teachers.length > 0 ? Math.max(...teachers.map((t) => Number(t.userId))) + 1 : 1;
    };

    if (this.isEditing) {
      api = this.http.put<ITeacher>(`/teachers/${this.teacherId}`, payload);
    } else {
      payload = {
        ...payload,
        userId: await getNextId(),
        createdDate: new Date().toISOString(),
      };
      api = this.http.post<ITeacher>('/teachers', payload);
    }

    api.subscribe({
      next: () => {
        this.toastService.showToast(
          'success',
          'Success',
          `Teacher ${this.isEditing ? 'Updated' : 'Created'} successfully!`,
        );

        this.dialogRef.close();
      },
      error: (err) => {
        this.toastService.showToast('error', err.message, 'Something went wrong!');
      },
    });
  }
}

