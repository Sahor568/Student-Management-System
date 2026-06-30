import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  // Get the currentUserId from local storage
  public getCurrentUserId() {
    return JSON.parse(localStorage.getItem('currentUserId')!);
  }

  getCurrentUserRole() {
    return JSON.parse(localStorage.getItem('currentUserRole')!);
  }
}
