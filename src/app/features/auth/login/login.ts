import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { InputText } from 'primeng/inputtext';
import { ToastService } from '../../../shared/services/toast.service';
import { Button } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../../../shared/constants/api.constants';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../../shared/types/user.interface';
import { ITeacher } from '../../../shared/types/teacher.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ToastModule, InputText, Button],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  // Form group for login form
  protected loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), // Regex pattern for email validation
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  protected isLoading = signal(false);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  // for form validation
  protected get email() {
    return this.loginForm.get('email');
  }

  // for form validation
  protected get password() {
    return this.loginForm.get('password');
  }

  // Method to handle form submission
  protected async onSubmit() {
    this.isLoading.set(true);
    let user: IUser | undefined;

    try {
      const { email, password } = this.loginForm.getRawValue();
      const users = await firstValueFrom(this.http.get<IUser[]>(`${ApiConstants.USER}`));
      user = users.find((user) => user.email === email && user.password === password);

      if (!user) {
        const teachers = await firstValueFrom(this.http.get<ITeacher[]>(ApiConstants.TEACHER));
        const teacher = teachers.find(
          (teacher) => teacher.email === email && teacher.password === password,
        );

        if (teacher) {
          user = { ...teacher, role: 'Teacher' };
        }
      }

      if (user) {
        this.toastService.showToast('success', 'Login Status', 'Login successfully!');
        this.authService.setCurrentUser(user);
        this.router.navigate(['/dashboard']);
      } else {
        this.toastService.showToast('error', 'Login Failed', 'Invalid email or password!');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
