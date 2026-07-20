import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiConstants } from '../constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { IStudent } from '../types/student.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);

  fetchAllStudents = async() => {
    return await firstValueFrom(this.http.get<IStudent[]>(`${ApiConstants.STUDENT}`));
  }
}
