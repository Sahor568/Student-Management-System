import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { Select } from 'primeng/select';
import { StatusInterface } from '../../types/status.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherInterface } from '../../../../shared/types/teacher.interface';
import { GenderInterface } from '../../../../shared/types/gender.interface';
import { ReligionInterface } from '../../../../shared/types/religion.interface';
import { BloodGroupInterface } from '../../../../shared/types/blood-group.interface';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-teacher-form',
  imports: [ReactiveFormsModule, Button, InputText, Select, DatePicker],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.scss',
})
export class TeacherForm implements OnInit {
  teacher!: TeacherInterface;
  status!: StatusInterface[];
  gender!: GenderInterface[];
  religion!: ReligionInterface[];
  bloodGroup!: BloodGroupInterface[];
  router = inject(Router);
  private route = inject(ActivatedRoute);
  isEditing = false;
  http = inject(HttpClient);
  toastService = inject(ToastService);

  teacherForm = new FormGroup({
    userId: new FormControl(),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),
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
      { name: 'UnActive', value: 'UnActive' },
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
      { name: 'O+', value: 'O+' },
      { name: 'A+', value: 'A+' },
      { name: 'AB+', value: 'AB+' },
      { name: 'other', value: 'Other' },
    ];

    const teacherId = this.route.snapshot.paramMap.get('id');
    if (teacherId) {
      this.isEditing = true;
      this.getTeacherById(teacherId);
    }
  }

  getTeacherById(teacherId: string): void {
    this.http.get<TeacherInterface>('http://localhost:3000/teachers/' + teacherId).subscribe({
      next: (teacher) => {
        this.teacher = teacher;
        this.teacherForm.patchValue({
          userId: teacher.userId,
          fullName: teacher.fullName,
          email: teacher.email,
          phone: teacher.phone,
          address: teacher.address,
          status: teacher.status,
        });
      },
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
    this.http.get<TeacherInterface[]>('http://localhost:3000/teachers').subscribe((teachers) => {
      const nextId =
        teachers.length > 0 ? Math.max(...teachers.map((t) => Number(t.userId))) + 1 : 1;

      const newTeacher: TeacherInterface = {
        id: 0,
        userId: nextId,
        fullName: this.teacherForm.value.fullName!,
        email: this.teacherForm.value.email!,
        phone: this.teacherForm.value.phone!,
        address: this.teacherForm.value.address!,
        status: this.teacherForm.value.status!,
        createdDate: new Date().toISOString(),
      };

      this.http.post<TeacherInterface>('http://localhost:3000/teachers', newTeacher).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Teacher Status', 'Teacher Created successfully!');
          this.router.navigate(['/teachers']);
        },
      });
    });
  }

  editTeacher(): void {
    const teacherId = this.route.snapshot.paramMap.get('id');
    this.http
      .put<TeacherInterface>(`http://localhost:3000/teachers/${teacherId}`, this.teacherForm.value)
      .subscribe({
        next: (updated) => {
          this.toastService.showToast('success', 'Status', 'Teacher Updated successfully!');
          this.router.navigate(['/teachers']);
        },
      });
  }
}
