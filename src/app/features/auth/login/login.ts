import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { InputText } from 'primeng/inputtext';
import { ToastService } from '../../../shared/services/toast.service';
import { Button } from 'primeng/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ToastModule, InputText, Button],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private router = inject(Router);
  private toastService = inject(ToastService);
  http = inject(HttpClient);

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
    this.http.get<any>('http://localhost:3000/users').subscribe({
      next: (res) => {
        const user = res.find((a: any) => {
          // Correctly check both email AND password
          return (
            a.email === this.loginForm.value.email && a.password === this.loginForm.value.password
          );
        });

        if (user) {
          // Login successful
          this.toastService.showToast('success', 'Login Status', 'Login successfully!'); // Show success toast message
          localStorage.setItem('currentUserId', JSON.stringify(user.id)); // Store the current user's ID in local storage
          localStorage.setItem('currentUserRole', JSON.stringify(user.role)); // Store the current user's ID in local storage
          this.router.navigate(['/dashboard']);
        } else {
          // Invalid email or password
          this.toastService.showToast('error', 'Login Status', 'Invalid email or password!');
        }
      }
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
