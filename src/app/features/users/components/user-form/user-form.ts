import { Component, inject, OnInit, signal } from '@angular/core';
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
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../../../shared/types/user.interface';
import { ITeacher } from '../../../../shared/types/teacher.interface';
import { ToastService } from '../../../../shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule, ReactiveFormsModule, InputText, Select, Button],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  user?: IUser;
  isEditing = false;
  role?: INameValue[];
  config = inject(DynamicDialogConfig);
  http = inject(HttpClient);
  toastService = inject(ToastService);
  router = inject(Router);
  protected loading = signal<boolean>(false);
  private dialogRef = inject(DynamicDialogRef);

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
    this.loading.set(true);
    this.http.get<IUser>('/users/' + userId).subscribe({
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
      complete: () => {
        this.loading.set(false);
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
    this.http.get<IUser[]>('/users').subscribe((users) => {
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

      this.http.post<IUser>('/users', newUser).subscribe({
        next: () => {
          this.toastService.showToast('success', 'User Status', 'User Created successfully!');
          this.dialogRef.close();
        },
      });
    });
  }

  private editTeacher() {
    const userId = this.config?.data;
    this.http.put<ITeacher>(`/users/${userId}`, this.userForm.value).subscribe({
      next: (updated) => {
        this.toastService.showToast('success', 'Status', 'User Updated successfully!');
        this.dialogRef.close();
      },
    });
  }
}
