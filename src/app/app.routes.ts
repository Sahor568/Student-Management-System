import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Classes } from './features/classes/classes';
import { Teachers } from './features/teachers/teachers';
import { Students } from './features/students/students';
import { TeacherForm } from './features/teachers/components/teacher-form/teacher-form';
import { Users } from './features/users/users';
import { TeacherView } from './features/teachers/components/teacher-view/teacher-view';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'teachers', component: Teachers },
  { path: 'teacher', component: TeacherForm }, // add Teacher
  { path: 'teacher/:id', component: TeacherForm }, // edit Teacher
  { path: 'teacher-view/:id', component: TeacherView },
  { path: 'classes', component: Classes },
  { path: 'students', component: Students },
  { path: 'users', component: Users },
];
