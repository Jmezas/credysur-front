import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goBack(): void {
    this.router.navigate(['dashboard/default']); // Reemplaza 'previous-page-path' con la ruta de la página anterior
  }

  logout(): void {
    this.authService.logOut(); // Asegúrate de que el método logout está correctamente implementado en AuthService
    this.router.navigate(['/auth/login']);
  }
}
