import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { INameValue } from '../../../../shared/types/name-Value.interface';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../../../shared/types/user.interface';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import { ToastService } from '../../../../shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-form',
  imports: [FormsModule, ReactiveFormsModule, InputText, Select, Button],
  templateUrl: './users-form.html',
  styleUrl: './users-form.scss',
})
export class UsersForm implements OnInit {
  user?: IUser;
  isEditing = false;
  role?: INameValue[];
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  toastService = inject(ToastService);
  router = inject(Router);

  userForm = new FormGroup({
    userId: new FormControl(),
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.role = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Teacher', value: 'Teacher' },
      { name: 'Student', value: 'Student' },
    ];

    const userId = this.config?.data;
    if (userId) {
      this.isEditing = true;
      this.getUserById(userId);
    }
  }

  private getUserById(userId: string) {
    this.http.get<IUser>('http://localhost:3000/users/' + userId).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue({
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          password: user.password,
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

  private createTeacher() {
    this.http.get<IUser[]>('http://localhost:3000/users').subscribe((users) => {
      const nextId = users.length > 0 ? Math.max(...users.map((t) => Number(t.userId))) + 1 : 1;

      const newUser: IUser = {
        id: 0,
        userId: nextId,
        fullName: this.userForm.value.fullName!,
        email: this.userForm.value.email!,
        password: this.userForm.value.password!,
        role: this.userForm.value.role!,
      };

      console.log(newUser.userId);

      this.http.post<IUser>('http://localhost:3000/users', newUser).subscribe({
        next: () => {
          this.toastService.showToast('success', 'User Status', 'User Created successfully!');
          this.router.navigate(['/users']);
        },
      });
    });
  }

  private editTeacher() {
    const userId = this.config?.data;
    this.http
      .put<ITeacher>(`http://localhost:3000/users/${userId}`, this.userForm.value)
      .subscribe({
        next: (updated) => {
          this.toastService.showToast('success', 'Status', 'User Updated successfully!');
          this.router.navigate(['/users']);
        },
      });
  }
}
