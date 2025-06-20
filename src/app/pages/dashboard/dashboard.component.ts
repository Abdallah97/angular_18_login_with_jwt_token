import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  currentUser$ = this.authService.currentUser$;
  dashboardState$ = this.userService.usersState$;

  refreshUsers(): void {
    this.userService.refreshUsers();
  }

  trackByUserId(index: number, user: User): number {
    return user.userId;
  }
}
