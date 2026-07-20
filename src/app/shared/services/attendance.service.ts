import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IStudent } from '../types/student.interface';
import { ApiConstants } from '../constants/api.constants';
import { IAttendance } from '../types/attendance.interface';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private http = inject(HttpClient);

  fetchAllAttendance = async () => {
    return await firstValueFrom(this.http.get<IAttendance[]>(`${ApiConstants.ATTENDANCE}`));
  };

  getStudentByClass = async (classId: number) => {
    return await firstValueFrom(
      this.http.get<IStudent[]>(`${ApiConstants.STUDENT}?classId=${classId}`),
    );
  };
}
