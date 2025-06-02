import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
