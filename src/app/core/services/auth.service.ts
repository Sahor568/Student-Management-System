import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../shared/types/user.interface';
import { firstValueFrom } from 'rxjs';
import { ApiConstants } from '../../shared/constants/api.constants';
import { Router } from '@angular/router';
import { ITeacher } from '../../shared/types/teacher.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private CURRENT_USER = 'currentUser';

  public setCurrentUser(userData: IUser) {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(userData));
  }

  public getCurrentUser(): IUser {
    return JSON.parse(localStorage.getItem(this.CURRENT_USER)!);
  }

  isAdmin(): boolean {
    return this.getCurrentUser().role === 'Admin';
  }

  isTeacher(): boolean {
    return this.getCurrentUser().role === 'Teacher';
  }

  public async fetchCurrentUser() {
    const userId = this.getCurrentUser().id;
    const userRole = await this.getCurrentUser().role;
    let user: IUser | undefined;

    switch (userRole.toLowerCase()) {
      case 'admin':
        user = await firstValueFrom(this.http.get<IUser>(`${ApiConstants.USER}/${userId}`));
        break;
      case 'teacher':
        const teacher = await firstValueFrom(
          this.http.get<ITeacher>(`${ApiConstants.TEACHER}/${userId}`),
        );
        if (teacher) {
          user = { ...teacher, role: 'Teacher' };
        }
        break;
      default:
        user = await firstValueFrom(this.http.get<any>(`${userRole.toLowerCase()}/${userId}`));
    }

    if (user) {
      this.setCurrentUser(user);
    } else {
      this.logout();
    }
  }

  public logout() {
    localStorage.removeItem(this.CURRENT_USER);
    this.router.navigate(['/login']);
  }
}
