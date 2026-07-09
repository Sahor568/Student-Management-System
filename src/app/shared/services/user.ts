import { inject, Injectable } from '@angular/core';
import { IUser } from '../types/user.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  fetchAllUsers = async () => {
    return await firstValueFrom(this.http.get<IUser[]>('/users'));
  };
}
