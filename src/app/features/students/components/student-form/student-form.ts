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
  private classService = inject(ClassService);

  studentForm = new FormGroup({
    userId: new FormControl(),
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
      { name: 'O+', value: 'O+' },
      { name: 'A+', value: 'A+' },
      { name: 'AB+', value: 'AB+' },
      { name: 'A-', value: 'A-' },
      { name: 'other', value: 'Other' },
    ];
    this.orphanStudent = [
      { name: 'Yes', value: 'Yes' },
      { name: 'No', value: 'No' },
    ];
    this.guardian = [
      { name: 'Father', value: 'Father' },
      { name: 'Mother', value: 'Mother' },
      { name: 'Grand Father', value: 'Grand Father' },
      { name: 'Grand Mother', value: 'Grand Mother' },
    ];

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

  onSubmit() {
    if (this.isEditing) {
      this.editStudent();
    } else {
      this.createStudent();
    }
  }

  createStudent(): void {
    this.http.get<IStudent[]>('/students').subscribe((students) => {
      const nextId =
        students.length > 0 ? Math.max(...students.map((s) => Number(s.userId))) + 1 : 1;

      const newStudent: IStudent = {
        id: 0,
        userId: nextId,
        fullName: this.studentForm.value.fullName!,
        registrationNumber: this.studentForm.value.registrationNumber,
        dateOfAdmission: this.studentForm.value.dateOfAdmission,

        email: this.studentForm.value.email!,
        dob: this.studentForm.value.dob,
        phone: this.studentForm.value.phone!,
        gender: this.studentForm.value.gender,
        address: this.studentForm.value.address!,
        bloodGroup: this.studentForm.value.bloodGroup,
        orphanStudent: this.studentForm.value.orphanStudent,
        religion: this.studentForm.value.religion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        guardian: this.studentForm.value.guardian,
        guardianName: this.studentForm.value.guardianName,
        guardianNationalId: this.studentForm.value.guardianNationalId,
        guardianPhone: this.studentForm.value.guardianPhone,
        guardianEmail: this.studentForm.value.guardianEmail,
        guardianAddress: this.studentForm.value.guardianAddress,
        guardianProfession: this.studentForm.value.guardianProfession,
        guardianIncome: this.studentForm.value.guardianIncome!,
      };

      this.http.post<IStudent>('/students', newStudent).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Student Status', 'Student Created successfully!');
          this.dialogRef.close();
        },
      });
    });
  }

  editStudent(): void {
    const studentId = this.config?.data;
    this.http.put<IStudent>(`/students/${studentId}`, this.studentForm.value).subscribe({
      next: (updated) => {
        this.toastService.showToast('success', 'Status', 'Student Updated successfully!');
        this.dialogRef.close();
      },
    });
  }
}
