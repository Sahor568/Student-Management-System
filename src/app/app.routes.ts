import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Classes } from './features/classes/classes';
import { Teachers } from './features/teachers/teachers';
import { Students } from './features/students/students';
import { Users } from './features/users/users';
import { Attendance } from './features/attendance/attendance';
import { authGuard } from './shared/guards/auth.guard';
import { loginGuard } from './shared/guards/login.guard';
import { roleGuard } from './shared/guards/role-guard';
import { NotFound } from './shared/components/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'error', component: NotFound },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'teachers',
    component: Teachers,
    canActivate: [authGuard, roleGuard],
    data: { allowed: ['Admin'] },
  },
  {
    path: 'students',
    component: Students,
    canActivate: [authGuard, roleGuard],
    data: { allowed: ['Admin'] },
  },
  {
    path: 'users',
    component: Users,
    canActivate: [authGuard, roleGuard],
    data: { allowed: ['Admin'] },
  },
  {
    path: 'classes',
    component: Classes,
    canActivate: [authGuard, roleGuard],
    data: { allowed: ['Admin', 'Teacher'] },
  },
  {
    path: 'attendance',
    component: Attendance,
    canActivate: [authGuard, roleGuard],
    data: { allowed: ['Admin', 'Teacher'] },
  },
];
