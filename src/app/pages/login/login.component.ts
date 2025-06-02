import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { Subject, switchMap, catchError, of, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  logiObj: LoginRequest = {
    EmailId: '',
    Password: '',
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  // Subject-based trigger for declarative login (similar to dashboard pattern)
  private loginTrigger$ = new Subject<LoginRequest>();

  // Validation error signal
  private validationError = signal<string>('');

  // Declarative login result using toSignal - no manual subscriptions in component
  loginResult = toSignal(
    this.loginTrigger$.pipe(
      switchMap((loginData) =>
        this.authService.login(loginData).pipe(
          map((response) => ({
            loading: false,
            success: response.result,
            error: response.result ? null : response.message || 'Login failed',
            response,
          })),
          startWith({
            loading: true,
            success: false,
            error: null,
            response: null,
          }),
          catchError((error) => {
            console.error('Login error:', error);
            return of({
              loading: false,
              success: false,
              error:
                'Login failed. Please check your credentials and try again.',
              response: null,
            });
          }),
        ),
      ),
    ),
    {
      initialValue: {
        loading: false,
        success: false,
        error: null,
        response: null,
      },
    },
  );

  // Computed-style getters for template access (using signals)
  get isLoading() {
    return this.loginResult().loading;
  }

  get errorMessage() {
    const validation = this.validationError();
    const loginError = this.loginResult().error;
    return validation || loginError || '';
  }

  constructor() {
    // Effect to handle successful login navigation
    effect(() => {
      const result = this.loginResult();
      if (result.success) {
        setTimeout(() => this.router.navigateByUrl('dashboard'), 0);
      }
    });
  }

  onLogin(): void {
    if (!this.logiObj.EmailId || !this.logiObj.Password) {
      this.validationError.set('Please fill in all fields');
      return;
    }

    // Clear validation error and trigger login
    this.validationError.set('');
    this.loginTrigger$.next({ ...this.logiObj });
  }

  clearError(): void {
    this.validationError.set('');
  }
}
