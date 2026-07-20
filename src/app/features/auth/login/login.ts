import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { InputText } from 'primeng/inputtext';
import { ToastService } from '../../../shared/services/toast.service';
import { Button } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '../../../shared/constants/api.constants';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ToastModule, InputText, Button],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);
  http = inject(HttpClient);
  private authService = inject(AuthService);

  ngOnInit() {
    if (this.authService.getCurrentUserId() != null) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Form group for login form
  protected loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), // Regex pattern for email validation
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  // Method to handle form submission
  protected onSubmit() {
    this.http.get<any[]>(ApiConstants.USER).subscribe({
      next: (users) => {
        const adminUser = users.find(
          (a) =>
            a.email === this.loginForm.value.email && a.password === this.loginForm.value.password,
        );

        if (adminUser) {
          this.toastService.showToast('success', 'Login Status', 'Login successfully!');
          localStorage.setItem('currentUserId', JSON.stringify(adminUser.id));
          localStorage.setItem('currentUserRole', JSON.stringify(adminUser.role));
          this.router.navigate(['/dashboard']);
          return;
        }

        this.http.get<any[]>(ApiConstants.TEACHER).subscribe({
          next: (teachers) => {
            const teacher = teachers.find(
              (t) =>
                t.email === this.loginForm.value.email &&
                t.password === this.loginForm.value.password,
            );

            if (teacher) {
              this.toastService.showToast('success', 'Login Status', 'Login successfully!');
              localStorage.setItem('currentUserId', JSON.stringify(teacher.id));
              localStorage.setItem('currentUserRole', JSON.stringify('Teacher'));
              this.router.navigate(['/dashboard']);
            } else {
              this.toastService.showToast('error', 'Login Status', 'Invalid email or password!');
            }
          },
        });
      },
    });
  }

  // for form validation
  protected get email() {
    return this.loginForm.get('email');
  }

  // for form validation
  protected get password() {
    return this.loginForm.get('password');
  }
}
