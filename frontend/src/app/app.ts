import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // <--- IMPORTANTE

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // <--- DEBE ESTAR AQUÍ
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'proyecto-carne';
}
