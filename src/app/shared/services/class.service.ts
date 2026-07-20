import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiConstants } from '../constants/api.constants';
import { IClass } from '../types/class.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private http = inject(HttpClient);

  fetchAllClasses = async () => {
    return await firstValueFrom(this.http.get<IClass[]>(`${ApiConstants.CLASS}`));
  };
}
