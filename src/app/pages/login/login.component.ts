import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  
})
export class LoginComponent {
  logiObj: LoginRequest = {
    EmailId: "",
    Password: ""
  };

  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  onLogin(): void {
    if (!this.logiObj.EmailId || !this.logiObj.Password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.logiObj).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.result) {
          this.router.navigateByUrl('dashboard');
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    });
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
