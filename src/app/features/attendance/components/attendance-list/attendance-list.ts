import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { AppTable } from '../../../../shared/components/table/table';
import { IAttendance } from '../../../../shared/types/attendance.interface';
import {
  ETableActions,
  IDataTableConfig,
} from '../../../../shared/components/table/types/table.interface';
import { IStudent } from '../../../../shared/types/student.interface';
import { StudentView } from '../../../students/components/student-view/student-view';
import { DialogService } from 'primeng/dynamicdialog';
import { MarkAttendance } from '../mark-attendance/mark-attendance';
import { StudentForm } from '../../../students/components/student-form/student-form';
import { AttendanceService } from '../../../../shared/services/attendance.service';

@Component({
  selector: 'app-attendance-list',
  imports: [ConfirmDialog, AppTable],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.scss',
})
export class AttendanceList implements OnInit {
  attendance = signal<IAttendance[]>([]);
  loading = signal<boolean>(false);
  private dialogService = inject(DialogService);
  private attendanceService = inject(AttendanceService);

  protected tableConfig: IDataTableConfig<IAttendance> = {
    columns: [
      { field: 'attendanceId', header: 'Id' },
      { field: 'studentId', header: 'Student Name' },
      { field: 'classId', header: 'Class Name' },
      { field: 'date', header: 'Attendance Date' },
      { field: 'status', header: 'Status' },
    ],
    actions: [ETableActions.edit, ETableActions.delete],
    searchFields: ['attendanceId', 'date', 'status'],
  };

  ngOnInit() {
    this.fetchAttendance();
  }

  private async fetchAttendance() {
    this.loading = signal<boolean>(true);
    this.attendance.set(await this.attendanceService.fetchAllAttendance());
    this.loading = signal<boolean>(false);

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
