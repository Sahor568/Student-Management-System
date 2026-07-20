import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ThemeService } from './core/services/theme.service';
import { Header } from './shared/components/header/header';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [ToastModule, RouterOutlet, Header, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  constructor() {
    this.themeService.loadTheme();
  }

  async ngOnInit() {
    if (this.isLoggedIn()) await this.authService.fetchCurrentUser();
  }

  protected isLoggedIn() {
    return !!this.authService.getCurrentUser();
  }
}
