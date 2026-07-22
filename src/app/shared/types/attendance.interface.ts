export interface IAttendance {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  status: string;
}

export interface IAttendanceDisplay {
  studentName?: string;
  className?: string;
}
