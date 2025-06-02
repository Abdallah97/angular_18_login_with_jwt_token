import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, startWith, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';

interface DashboardState {
  users: User[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  // Refresh trigger for manual data refresh
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // Declarative approach using observables
  currentUser$ = this.authService.currentUser$;
  
  // Combined state management for loading and error handling
  dashboardState$: Observable<DashboardState> = this.refreshTrigger$.pipe(
    switchMap(() => 
      this.userService.getAllUsers().pipe(
        map(users => ({ users, loading: false, error: null })),
        startWith({ users: [], loading: true, error: null }),
        catchError(error => {
          console.error('Error loading users:', error);
          return of({ users: [], loading: false, error: 'Failed to load users. Please try again.' });
        })
      )
    )
  );

  refreshUsers(): void {
    this.refreshTrigger$.next();
  }

  trackByUserId(index: number, user: User): number {
    return user.userId;
  }
}
