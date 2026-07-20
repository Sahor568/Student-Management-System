export interface IAttendance {
  id?: number;
  attendanceId?: number;
  studentId: number;
  classId: number;
  date: string;
  status: string;
}
