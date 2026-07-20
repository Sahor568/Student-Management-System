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

  teacherForm = new FormGroup({
    userId: new FormControl(),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
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
        this.teacherForm.patchValue({
          userId: teacher.userId,
          fullName: teacher.fullName,
          email: teacher.email,
          phone: teacher.phone,
          address: teacher.address,
          status: teacher.status,
          monthlySalary: teacher.monthlySalary,
          nationalId: teacher.nationalId!,
          education: teacher.education!,
          religion: teacher.religion!,
          gender: teacher.gender!,
          bloodGroup: teacher.bloodGroup!,
          experience: teacher.experience!,
          dob: teacher.dob ? new Date(teacher.dob) : null,
        });
      },
      complete: () => {
        this.loading.set(false);
      }
    });

  }

  onSubmit() {
    if (this.isEditing) {
      this.editTeacher();
    } else {
      this.createTeacher();
    }
  }

  createTeacher(): void {
    this.http.get<ITeacher[]>('/teachers').subscribe((teachers) => {
      const nextId =
        teachers.length > 0 ? Math.max(...teachers.map((t) => Number(t.userId))) + 1 : 1;

      const newTeacher: ITeacher = {
        id: 0,
        userId: nextId,
        fullName: this.teacherForm.value.fullName!,
        email: this.teacherForm.value.email!,
        phone: this.teacherForm.value.phone!,
        address: this.teacherForm.value.address!,
        status: this.teacherForm.value.status!,
        createdDate: new Date().toISOString(),
        monthlySalary: this.teacherForm.value.monthlySalary!,
        nationalId: this.teacherForm.value.nationalId!,
        education: this.teacherForm.value.education!,
        religion: this.teacherForm.value.religion!,
        gender: this.teacherForm.value.gender!,
        bloodGroup: this.teacherForm.value.bloodGroup!,
        experience: this.teacherForm.value.experience!,
        dob: this.teacherForm.value.dob!,
      };

      this.http.post<ITeacher>('/teachers', newTeacher).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Teacher Status', 'Teacher Created successfully!');
          this.dialogRef.close();
        },
      });
    });
  }

  editTeacher(): void {
    const teacherId = this.config?.data;
    this.http.put<ITeacher>(`/teachers/${teacherId}`, this.teacherForm.value).subscribe({
      next: (updated) => {
        this.toastService.showToast('success', 'Status', 'Teacher Updated successfully!');
        this.dialogRef.close();
      },
    });
  }
}
