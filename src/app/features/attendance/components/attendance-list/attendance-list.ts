import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { AppTable } from '../../../../shared/components/table/table';
import { IAttendance } from '../../../../shared/types/attendance.interface';
import {
  ETableActions,
  IDataTableConfig,
} from '../../../../shared/components/table/types/table.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { MarkAttendance } from '../mark-attendance/mark-attendance';
import { AttendanceService } from '../../../../shared/services/attendance.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiConstants } from '../../../../shared/constants/api.constants';
import { IClass } from '../../../../shared/types/class.interface';
import { HttpClient } from '@angular/common/http';
import { ITeacher } from '../../../../shared/types/teacher.interface';

@Component({
  selector: 'app-attendance-list',
  imports: [ConfirmDialog, AppTable],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.scss',
})
export class AttendanceList implements OnInit {
  attendances = signal<IAttendance[]>([]);
  loading = signal<boolean>(false);
  private http = inject(HttpClient);
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);
  private userRole = this.authService.isTeacher();

  protected tableConfig: IDataTableConfig<IAttendance> = {
    columns: [
      { field: 'className', header: 'Class Name' },
      { field: 'date', header: 'Attendance Date' },
      { field: 'teacherName', header: 'Teacher Assigned' },
      { field: 'status', header: 'Status' },
    ],
    actions: this.userRole ? [ETableActions.edit] : [ETableActions.edit, ETableActions.delete],
    searchFields: ['className', 'teacherName'],
  };

  ngOnInit() {
    this.fetchAttendance();
  }

  private fetchAttendance() {
    this.loading.set(true);
    this.http.get<IAttendance[]>(`${ApiConstants.ATTENDANCE}`).subscribe({
      next: (attendances) => {
        this.http.get<IClass[]>(`${ApiConstants.CLASS}`).subscribe({
          next: (classes) => {
            const classMap = new Map(classes.map((c) => [c.id, c.className]));
            const mapped = attendances.map((attendance) => ({
              ...attendance,
              className: classMap.get(attendance.classId) ?? '',
            }));
            this.attendances.set(mapped);
            this.loading.set(false);
          },
          error: () => {
            this.attendances.set(attendances);
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  protected onClick(attendance?: IAttendance) {
    this.dialogService.open(MarkAttendance, {
      data: attendance?.id,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      header: attendance ? 'Edit Attendance Details' : 'Add Attendance Details',
    });
  }

  protected confirmDelete(id: string) {}
  protected onDeleteAccept() {}
}
