import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { IStudent } from '../../../../shared/types/student.interface';
import { INameValue } from '../../../../shared/types/name-Value.interface';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from 'primeng/select';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule, InputText, DatePicker, ButtonModule, Select],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss',
})
export class StudentForm implements OnInit {
  student!: IStudent;
  gender!: INameValue[];
  religion!: INameValue[];
  bloodGroup!: INameValue[];
  orphanStudent!: INameValue[];
  guardian!: INameValue[];
  router = inject(Router);
  private route = inject(ActivatedRoute);
  isEditing = false;
  http = inject(HttpClient);
  toastService = inject(ToastService);

  studentForm = new FormGroup({
    userId: new FormControl(),
    fullName: new FormControl(),
    registrationNumber: new FormControl(),
    dateOfAdmission: new FormControl(),

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

    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.isEditing = true;
      this.getStudentById(studentId);
    }
  }

  getStudentById(studentId: string): void {
    this.http.get<IStudent>('http://localhost:3000/students/' + studentId).subscribe({
      next: (student) => {
        this.student = student;
        this.studentForm.patchValue({
          userId: student.userId,
          fullName: student.fullName,
          registrationNumber: student.registrationNumber,
          dateOfAdmission: student.dateOfAdmission ? new Date (student.dateOfAdmission) : null,

          email: student.email,
          dob: student.dob ? new Date(student.dob) : null,
          gender: student.gender,
          phone: student.phone,
          address: student.address,
          bloodGroup: student.bloodGroup,
          orphanStudent: student.orphanStudent,
          religion: student.religion,
          createAt: student.createdAt,
          updatedAt: student.updatedAt,

          guardian: student.guardian,
          guardianName: student.guardianName,
          guardianNationalId: student.guardianNationalId,
          guardianPhone: student.guardianPhone,
          guardianEmail: student.guardianEmail,
          guardianAddress: student.guardianAddress,
          guardianProfession: student.guardianProfession,
          guardianIncome: student.guardianIncome,
        });
      },
    });
  }

  onSubmit() {
    if (this.isEditing) {
      this.editStudent();
    } else {
      this.createStudent();
    }
  }

  createStudent(): void {
    this.http.get<IStudent[]>('http://localhost:3000/students').subscribe((students) => {
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

      this.http.post<IStudent>('http://localhost:3000/students', newStudent).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Student Status', 'Student Created successfully!');
          this.router.navigate(['/students']);
        },
      });
    });
  }

  editStudent(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    this.http
      .put<IStudent>(`http://localhost:3000/students/${studentId}`, this.studentForm.value)
      .subscribe({
        next: (updated) => {
          this.toastService.showToast('success', 'Status', 'Student Updated successfully!');
          this.router.navigate(['/students']);
        },
      });
  }
}
