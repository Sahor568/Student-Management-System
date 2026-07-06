import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Classes } from './features/classes/classes';
import { Teachers } from './features/teachers/teachers';
import { Students } from './features/students/students';
import { TeacherForm } from './features/teachers/components/teacher-form/teacher-form';
import { Users } from './features/users/users';
import { TeacherView } from './features/teachers/components/teacher-view/teacher-view';
import { StudentView } from './features/students/components/student-view/student-view';
import { StudentForm } from './features/students/components/student-form/student-form';
import { UsersForm } from './features/users/components/users-form/users-form';
import { UsersView } from './features/users/components/users-view/users-view';
import { Attendance } from './features/attendance/attendance';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },

  { path: 'teachers', component: Teachers },
  { path: 'teacher', component: TeacherForm }, // add Teacher
  { path: 'teacher/:id', component: TeacherForm }, // edit Teacher
  { path: 'teacher-view/:id', component: TeacherView }, // teacher detail

  { path: 'students', component: Students },
  { path: 'student', component: StudentForm }, // add student
  { path: 'student/:id', component: StudentForm }, // edit student
  { path: 'student-view/:id', component: StudentView }, // student detail

  { path: 'users', component: Users },
  { path: 'user', component: UsersForm }, // add user
  { path: 'user/:id', component: UsersForm }, // edit user
  { path: 'user-view/:id', component: UsersView }, //user detail

  { path: 'classes', component: Classes },

  { path: 'attendance', component: Attendance}
];
