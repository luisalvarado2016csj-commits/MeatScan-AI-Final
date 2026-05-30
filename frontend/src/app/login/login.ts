import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <--- IMPORTANTE

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- AGREGAR AQUÍ
  templateUrl: './login.html'
})
export class LoginComponent {} 