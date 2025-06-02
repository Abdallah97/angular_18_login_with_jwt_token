import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { Constant, API_BASE_URL } from '../constants';

export interface LoginRequest {
  EmailId: string;
  Password: string;
}

export interface LoginResponse {
  result: boolean;
  data: {
    token: string;
  };
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Signal for current user state
  private currentUserSignal = signal<string | null>(null);

  // Computed signal for reactive access to current user
  public currentUser = this.currentUserSignal.asReadonly();
  // Computed signal for authentication status
  public isAuthenticated = computed(
    () => !!this.getToken() && !!this.currentUser(),
  );

  // Method for guards and immediate checks
  public isAuthenticatedSync(): boolean {
    return !!this.getToken();
  }

  constructor() {
    // Initialize current user from localStorage on service creation
    this.initializeCurrentUser();
  }
  private initializeCurrentUser(): void {
    const uName = localStorage.getItem('uName');
    if (uName) {
      const decryptedName = this.decryptData(uName);
      this.currentUserSignal.set(decryptedName);
    }
  }
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/Login`, loginRequest)
      .pipe(
        tap((response) => {
          if (response.result) {
            const encryptedUserName = this.encryptData(loginRequest.EmailId);
            localStorage.setItem('uName', encryptedUserName);
            localStorage.setItem('angular18Token', response.data.token);
            this.currentUserSignal.set(loginRequest.EmailId);
          }
        }),
      );
  }
  logout(): void {
    localStorage.removeItem('uName');
    localStorage.removeItem('angular18Token');
    this.currentUserSignal.set(null);
  }
  getToken(): string | null {
    return localStorage.getItem('angular18Token');
  }

  getCurrentUser(): string | null {
    return this.currentUser();
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, Constant.EN_KEY).toString();
  }

  private decryptData(data: string): string {
    const decryptedVal = CryptoJS.AES.decrypt(data, Constant.EN_KEY);
    return decryptedVal.toString(CryptoJS.enc.Utf8);
  }
}
