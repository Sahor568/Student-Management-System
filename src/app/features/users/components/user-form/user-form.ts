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
import { ToastService } from '../../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { DROPDOWN_OPTIONS } from '../../../../shared/constants/dropdownItem';
import { ApiConstants } from '../../../../shared/constants/api.constants';

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
  protected submitLoading = signal<boolean>(false);
  private dialogRef = inject(DynamicDialogRef);
  userId = this.config?.data;

  userForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.role = DROPDOWN_OPTIONS.role;
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
        this.userForm.patchValue(user);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  protected onSubmit() {
    let payload = this.userForm.getRawValue() as IUser;
    let api;

    if (this.isEditing) {
      api = this.http.put<IUser>(`${ApiConstants.USER}/${this.userId}`, payload);
        } else {
      payload = {
        ...payload
      }
      api = this.http.post<IUser>(`${ApiConstants.USER}`, payload)
    }

    api.subscribe ({
      next: () => {
        this.toastService.showToast(
          'success',
          'Success',
          `User ${this.isEditing ? 'Updated' : 'Created'} successfully!`,

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
