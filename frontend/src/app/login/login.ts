import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // <-- Esto soluciona los errores de ngModel, ngForm y *ngIf
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';

    // Credenciales solicitadas: admin y 1234
    if (this.username.trim() === 'admin' && this.password === '1234') {
      console.log('Acceso corporativo concedido con éxito.');
      localStorage.setItem('userToken', 'active_session_meatscan');
      this.router.navigate(['/dashboard']); 
    } else {
      this.errorMessage = 'Credenciales incorrectas. Verifique el usuario o la contraseña de seguridad.';
    }
  }
}