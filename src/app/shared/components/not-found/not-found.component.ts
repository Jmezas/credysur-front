import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  constructor(private router: Router, private authService: AuthService) {}

  handleGoBack() {
    if (this.authService.isLogged()) {
      this.router.navigate(['/dashboard/default']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  handleLogout() {
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }
}
