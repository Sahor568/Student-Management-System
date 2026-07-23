import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private authService = inject(AuthService);
  protected isAdmin = signal<boolean>(false);

  ngOnInit() {
    this.isAdmin.set(this.authService.isAdmin());
  }

  // Logout the current user and redirect to the login page
  protected onLogout() {
    this.authService.logout();
  }
}
