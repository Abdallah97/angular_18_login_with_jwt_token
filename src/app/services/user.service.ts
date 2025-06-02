import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from '../conststnt';

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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getAllUsers(): Observable<User[]> {
    return this.http.get<UsersResponse>(`${API_BASE_URL}/GetAllUsers`)
      .pipe(
        map(response => response.data || [])
      );
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<{ data: User }>(`${API_BASE_URL}/GetUser/${id}`)
      .pipe(
        map(response => response.data || null)
      );
  }
}
