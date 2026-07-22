import { Component, inject, OnInit } from '@angular/core';
import { IUser } from '../../types/user.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  protected user!: IUser;
  private authService = inject(AuthService);

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
}
