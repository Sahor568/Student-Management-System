import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../shared/types/user.interface';
import { firstValueFrom } from 'rxjs';
import { ApiConstants } from '../../shared/constants/api.constants';
import { Router } from '@angular/router';

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

  public async fetchCurrentUser() {
    try {
      const userId = this.getCurrentUser().id;

      let user: IUser | undefined;
      user = await firstValueFrom(this.http.get<IUser>(`${ApiConstants.USER}/${userId}`));
      if (!user) {
        const teacher = await firstValueFrom(
          this.http.get<IUser>(`${ApiConstants.TEACHER}/${userId}`),
        );
        if (teacher) {
          user = { ...teacher, role: 'Teacher' };
        }
      }

      if (user) {
        this.setCurrentUser(user);
      } else {
        this.logout();
      }
    } catch (err) {
      this.logout();
    }
  }

  public logout() {
    localStorage.removeItem(this.CURRENT_USER);
    this.router.navigate(['/login']);
  }
}
