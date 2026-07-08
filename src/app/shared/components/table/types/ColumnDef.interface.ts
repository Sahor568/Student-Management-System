import { IStudent } from '../../../types/student.interface';
import { ITeacher } from '../../../types/teacher.interface';
import { IUser } from '../../../types/user.interface';
import { IClass } from '../../../types/class.interface';
import { IAttendance } from '../../../types/attendance.interface';



interface ITableColumns {
  field: string;
  header: string;
}

export interface IDataTableConfig {
  columns: ITableColumns[];
  actions?: ETableActions[];
}

export enum ETableActions {
  view = 'view',
  edit = 'edit',
  delete = 'delete',
}

export type EntityMap = {
  student: IStudent;
  teacher: ITeacher;
  user: IUser;
  // class: IClass;
  // attendance: IAttendance;
};
