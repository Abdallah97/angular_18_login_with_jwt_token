import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {
  map,
  startWith,
  catchError,
  switchMap,
  shareReplay,
} from 'rxjs/operators';
import { API_BASE_URL } from '../constants';

export interface User {
  userId: number;
  emailId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  mobileNumber: string;
}

export interface UsersResponse {
  data: User[];
  result: boolean;
  message?: string;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  usersState$: Observable<UsersState> = this.refreshTrigger$.pipe(
    switchMap(() =>
      this.getAllUsersFromApi().pipe(
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
    ),
    shareReplay(1), // Cache the latest state for multiple subscribers
  );

  private getAllUsersFromApi(): Observable<User[]> {
    return this.http
      .get<UsersResponse>(`${API_BASE_URL}/GetAllUsers`)
      .pipe(map((response) => response.data || []));
  }

  getAllUsers(): Observable<User[]> {
    return this.getAllUsersFromApi();
  }

  getUserById(id: number): Observable<User | null> {
    return this.http
      .get<{ data: User }>(`${API_BASE_URL}/GetUser/${id}`)
      .pipe(map((response) => response.data || null));
  }

  refreshUsers(): void {
    this.refreshTrigger$.next();
  }
}
