import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router= inject(Router);
  private toastService = inject(ToastService);

  // Logout the current user and redirect to the login page
  protected onLogout() {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserRole');
    this.toastService.showToast('error', 'Logout Status', 'Logout Successfully!');
    this.router.navigate(['/login']);
  }
}
