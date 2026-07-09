import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '../../types/user.interface';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  // private themeService = inject(ThemeService);
  // isDark = this.themeService.isDarkMode();
  http = inject(HttpClient);
  router = inject(Router);
  user?: IUser;
  userName?: string;
  userRole?: string;

  // toggleTheme(): void {
  //   this.themeService.toggleTheme();
  //   this.isDark = this.themeService.isDarkMode();
  // }
  ngOnInit() {
    this.getUserName();
  }

  getUserName(): void {
    const userId = JSON.parse(localStorage.getItem('currentUserId')!);
    const userRole = JSON.parse(localStorage.getItem('currentUserRole')!);

    this.http.get<IUser>(`/users/${userId}`).subscribe({
      next: (user) => {
        this.user = user;
        this.userName = user.fullName;
        this.userRole = userRole;
      },
    });
  }
}
