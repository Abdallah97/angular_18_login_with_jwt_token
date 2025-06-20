import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeCurrentUser();
  }

  private initializeCurrentUser(): void {
    const uName = localStorage.getItem('uName');
    if (uName) {
      const decryptedName = this.decryptData(uName);
      this.currentUserSubject.next(decryptedName);
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
            this.currentUserSubject.next(loginRequest.EmailId);
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('uName');
    localStorage.removeItem('angular18Token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('angular18Token');
  }

  getToken(): string | null {
    return localStorage.getItem('angular18Token');
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, Constant.EN_KEY).toString();
  }

  private decryptData(data: string): string {
    const decryptedVal = CryptoJS.AES.decrypt(data, Constant.EN_KEY);
    return decryptedVal.toString(CryptoJS.enc.Utf8);
  }
}
