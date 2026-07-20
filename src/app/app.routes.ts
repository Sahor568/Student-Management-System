import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Classes } from './features/classes/classes';
import { Teachers } from './features/teachers/teachers';
import { Students } from './features/students/students';
import { Users } from './features/users/users';
import { Attendance } from './features/attendance/attendance';
import { ClassForm } from './features/classes/components/class-form/class-form';
import { ClassView } from './features/classes/components/class-view/class-view';
import { MarkAttendance } from './features/attendance/components/mark-attendance/mark-attendance';
import { authGuard } from './shared/guards/auth.guard';
import { loginGuard } from './shared/guards/login.guard';
import { roleGuard } from './shared/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { allowed: ['Admin'] },
  },
  { path: 'teachers', component: Teachers },
  { path: 'students', component: Students },
  { path: 'users', component: Users },
  { path: 'classes', component: Classes },
  { path: 'class', component: ClassForm },
  { path: 'class/:id', component: ClassForm },
  { path: 'student-view/:id', component: ClassView },
  { path: 'attendance', component: Attendance },
  { path: 'mark-attendance', component: MarkAttendance },
];
