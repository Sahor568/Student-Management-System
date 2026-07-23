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
import { DROPDOWN_OPTIONS } from '../../../../shared/constants/dropdownItem';
import { ApiConstants } from '../../../../shared/constants/api.constants';

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
  protected submitLoading = signal<boolean>(false);
  private teacherId = this.config?.data;

  teacherForm = new FormGroup({
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

  ngOnInit(){
    this.status = DROPDOWN_OPTIONS.status;
    this.gender = DROPDOWN_OPTIONS.gender;
    this.religion = DROPDOWN_OPTIONS.religion;
    this.bloodGroup = DROPDOWN_OPTIONS.bloodGroup;

    const teacherId = this.config?.data;
    if (teacherId) {
      this.isEditing = true;
      this.getTeacherById(teacherId);
    }
  }

  getTeacherById(teacherId: string){
    this.loading.set(true);
    this.http
      .get<ITeacher>(`${ApiConstants.TEACHER}/${this.teacherId}`)
      .subscribe({
        next: (teacher) => {
          this.teacher = teacher;
          this.teacherForm.patchValue({
            ...teacher,
            dob: teacher.dob ? new Date(teacher.dob) : null,
          });
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  onSubmit() {
    this.submitLoading.set(true);
    let payload = this.teacherForm.getRawValue() as ITeacher;
    let api;

    if (this.isEditing) {
      api = this.http.put<ITeacher>(`${ApiConstants.TEACHER}/${this.teacherId}`, payload);
    } else {
      payload = {
        ...payload,
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
        this.submitLoading.set(false);
        this.dialogRef.close();
      },
      error: (err) => {
        this.submitLoading.set(false);
      },
    });
  }
}
