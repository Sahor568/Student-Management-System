import { IStudent } from '../../../types/student.interface';
import { ITeacher } from '../../../types/teacher.interface';
import { IUser } from '../../../types/user.interface';
import { IAttendance } from '../../../types/attendance.interface';
import { IClass } from '../../../types/class.interface';

interface ITableColumns<T> {
  field: keyof T;
  header: string;
}

export interface IDataTableConfig<T> {
  columns: ITableColumns<T>[];
  actions?: ETableActions[];
  searchFields?: (keyof T)[];
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
  class: IClass;
  attendance: IAttendance;
};
