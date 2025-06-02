import { NgFor, NgIf } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';
import { switchMap, catchError, of, startWith, defer } from 'rxjs';
import { map } from 'rxjs/operators';

interface DashboardState {
  users: User[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private refreshCounter = signal(0);
  currentUser = this.authService.currentUser;
  state = toSignal(
    computed(() => {
      this.refreshCounter();
      return this.userService.getAllUsers();
    })().pipe(
      map((users) => ({ users, loading: false, error: null })),
      startWith({ users: [], loading: true, error: null }),
      catchError((error) => {
        console.error('Error loading users:', error);
        return of({
          users: [],
          loading: false,
          error: 'Failed to load users. Please try again.',
        });
      }),
    ),
    { initialValue: { users: [], loading: true, error: null } },
  );

  refreshUsers(): void {
    this.refreshCounter.update((count) => count + 1);
  }

  trackByUserId(index: number, user: User): number {
    return user.userId;
  }
}
