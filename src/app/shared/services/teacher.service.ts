import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ITeacher } from '../types/teacher.interface';
import { ApiConstants } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private http = inject(HttpClient);

  fetchAllTeachers = async() => {
    return await firstValueFrom(this.http.get<ITeacher[]>(`${ApiConstants.TEACHER}`));
  }
}
