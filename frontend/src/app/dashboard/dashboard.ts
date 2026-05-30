import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeatScanService } from '../services/meat-scan'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  
  // 1. INICIALIZA VACÍO PARA QUE NO MIENTA
  resultado: string = ''; 
  confianza: number = 0;
  sugerencia: string = 'Suba una imagen termográfica para iniciar el análisis.';

  constructor(private meatService: MeatScanService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
      // Limpiamos al seleccionar nueva foto
      this.resultado = '';
      this.confianza = 0;
    }
  }

  analizar() {
    if (!this.selectedFile) return;

    this.sugerencia = 'Analizando patrones térmicos mediante Redes Neuronales...';

    this.meatService.predecir(this.selectedFile).subscribe({
      next: (res: any) => {
        // 2. AQUÍ RECIBIMOS LO DE PYTHON (Ej: "POS_0" o "15 min")
        this.resultado = res.tiempo; 
        
        // Limpiamos el símbolo % y convertimos a número para la barra de progreso
        this.confianza = parseFloat(res.confianza.replace('%', ''));
        
        this.sugerencia = 'Análisis completado con éxito mediante el modelo .h5';
      },
      error: (err) => {
        console.error(err);
        this.resultado = 'ERROR';
        this.sugerencia = 'Verifique que el servidor Flask (puerto 5000) esté corriendo.';
      }
    });
  }

  getStatusClass() {
    if (this.resultado === 'ERROR') return 'text-warning fw-bold display-4';
    if (this.resultado === '') return 'text-muted fw-bold display-4';
    return 'text-danger fw-bold display-4';
  }

  getBarClass() {
    return this.confianza > 80 ? 'bg-danger' : 'bg-success';
  }
}