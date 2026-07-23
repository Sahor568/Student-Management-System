export interface IAttendance {
  id: number;
  studentId: number;
  classId: number;
  className?: string;
  teacherId?: number;
  teacherName?: string;
  date: string;
  status: string;
}
