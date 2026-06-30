import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const isDark = document.body.classList.contains('dark');

    if (isDark) {
      document.body.classList.remove('dark');
      localStorage.setItem(this.THEME_KEY, 'light');
    } else {
      document.body.classList.add('dark');
      localStorage.setItem(this.THEME_KEY, 'dark');
    }
  }

  loadTheme(): void {
    const theme = localStorage.getItem(this.THEME_KEY);

    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  isDarkMode(): boolean {
    return localStorage.getItem(this.THEME_KEY) === 'dark';
  }
}
