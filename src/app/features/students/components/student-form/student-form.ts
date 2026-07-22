import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { IStudent } from '../../../../shared/types/student.interface';
import { INameValue } from '../../../../shared/types/name-Value.interface';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Select } from 'primeng/select';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IClass } from '../../../../shared/types/class.interface';
import { ClassService } from '../../../../shared/services/class.service';
import { DROPDOWN_OPTIONS } from '../../../../shared/constants/dropdownItem';
import { ApiConstants } from '../../../../shared/constants/api.constants';

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule, InputText, DatePicker, ButtonModule, Select],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss',
})
export class StudentForm implements OnInit {
  student!: IStudent;
  classes: IClass[] = [];
  gender!: INameValue[];
  religion!: INameValue[];
  bloodGroup!: INameValue[];
  orphanStudent!: INameValue[];
  guardian!: INameValue[];
  router = inject(Router);
  isEditing = false;
  http = inject(HttpClient);
  toastService = inject(ToastService);
  config = inject(DynamicDialogConfig);
  protected loading = signal<boolean>(false);
  private dialogRef = inject(DynamicDialogRef);
  protected loadingClass = signal<boolean>(false);
  protected submitLoading = signal<boolean>(false);
  private classService = inject(ClassService);
  studentId = this.config?.data;

  studentForm = new FormGroup({
    fullName: new FormControl(),
    registrationNumber: new FormControl(),
    dateOfAdmission: new FormControl(),
    classId: new FormControl(),

    email: new FormControl(),
    dob: new FormControl(),
    gender: new FormControl(),
    phone: new FormControl(),
    address: new FormControl(),
    bloodGroup: new FormControl(),
    orphanStudent: new FormControl(),
    religion: new FormControl(),
    createAt: new FormControl(),
    updatedAt: new FormControl(),

    guardian: new FormControl(),
    guardianName: new FormControl(),
    guardianNationalId: new FormControl(),
    guardianPhone: new FormControl(),
    guardianEmail: new FormControl(),
    guardianAddress: new FormControl(),
    guardianProfession: new FormControl(),
    guardianIncome: new FormControl(),
  });

  ngOnInit() {
    this.getAllClass();

    this.gender = DROPDOWN_OPTIONS.gender;
    this.religion = DROPDOWN_OPTIONS.religion;
    this.bloodGroup = DROPDOWN_OPTIONS.bloodGroup;
    this.orphanStudent = DROPDOWN_OPTIONS.orphanStudent;
    this.guardian = DROPDOWN_OPTIONS.guardian;

    const studentId = this.config?.data;
    if (studentId) {
      this.isEditing = true;
      this.getStudentById(studentId);
    }
  }

  getStudentById(studentId: string): void {
    this.loading.set(true);
    this.http.get<IStudent>('/students/' + studentId).subscribe({
      next: (student) => {
        this.student = student;
        this.studentForm.patchValue({
          ...student,
          dateOfAdmission: student.dateOfAdmission ? new Date(student.dateOfAdmission) : null,
          dob: student.dob ? new Date(student.dob) : null,
        });
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  async getAllClass() {
    this.loadingClass.set(true);
    this.classes = await this.classService.fetchAllClasses();
    this.loadingClass.set(false);
  }

  protected onSubmit() {
    let payload: any = this.studentForm.getRawValue();
    let api;

    if (this.isEditing) {
      api = this.http.put<IStudent>(`${ApiConstants.STUDENT}/${this.studentId}`, payload);
    } else {
      payload = {
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      api = this.http.post<IStudent>(`${ApiConstants.STUDENT}`, payload);
    }

    api.subscribe({
      next: () => {
        this.toastService.showToast(
          'success',
          'Success',
          `Student ${this.isEditing ? 'Updated' : 'Created'} successfully!`,
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
