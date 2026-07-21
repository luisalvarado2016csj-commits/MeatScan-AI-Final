import { Component, ChangeDetectorRef, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Asegúrate de tenerlo por si usas ngModel
import { MeatScanService } from '../services/meat-scan'; 

interface RegistroHistorial {
  id: string;
  fecha: string;
  imagen: string | ArrayBuffer | null;
  resultado: string;
  estado: string;
  observacion: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Mantenemos soporte de formularios
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  
  // VARIABLES DE CONTROL DE AUDITORÍA CRUZADA
  tiempoEsperado: string = '0 MIN'; // Guarda la opción seleccionada por el usuario
  listaTiempos: string[] = ['0 MIN', '15 MIN', '30 MIN', '45 MIN', '60 MIN', '75 MIN', '90 MIN', '105 MIN', '120 MIN', '135 MIN', '150 MIN', '165 MIN'];

  resultado: string = ''; 
  confianza: number = 0;
  sugerencia: string = 'Seleccione el tiempo teórico de congelación y suba una imagen para iniciar.';
  loading: boolean = false;

  totalEscaneos: number = 130; 
  alertasRecientes: number = 6;
  estadoModel: string = 'ACTIVO'; 
  activeTab: string = 'panel'; 

  historial: RegistroHistorial[] = [
    {
      id: 'MS-2026-001',
      fecha: '21/06/2026 15:30',
      imagen: 'assets/thermal_sample1.png', 
      resultado: '15 MINUTOS',
      estado: 'ESTABLE',
      observacion: 'Análisis de consistencia aprobado. Coincidencia con el tiempo de planta.'
    },
    {
      id: 'MS-2026-002',
      fecha: '21/06/2026 16:15',
      imagen: 'assets/thermal_sample2.png',
      resultado: '0 MINUTOS',
      estado: 'CRÍTICO',
      observacion: '¡Desviación detectada! Esperado: 60 MIN. IA detectó: 0 MIN.'
    }
  ];

  constructor(
    private meatService: MeatScanService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.verificarEstadoBackend();
  }

  verificarEstadoBackend() {}

  changeTab(tabName: string) {
    this.activeTab = tabName;
    this.cdr.detectChanges();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);
      this.sugerencia = 'Imagen cargada. Lista para contrastar con el tiempo teórico.';
    }
  }

  analizar() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.sugerencia = 'Analizando matriz térmica y cruzando datos de tiempo...';

    this.meatService.predecir(this.selectedFile).subscribe({
      next: (res: any) => {
        if (res) {
          setTimeout(() => {
            // Estandarizamos la respuesta de la IA (Ej: "30 MINUTOS" -> "30 MIN")
            let rawRes = (res.tiempo || '0 MIN').toUpperCase();
            this.resultado = rawRes.includes('MINUTOS') ? rawRes.replace('MINUTOS', 'MIN').trim() : rawRes;
            
            this.totalEscaneos++;
            let observacionAux = '';
            let esFalla = false;

            // LÓGICA DE AUDITORÍA CRUZADA: Comparar selección vs predicción de la IA
            if (this.tiempoEsperado !== this.resultado) {
              esFalla = true;
              this.alertasRecientes++;
              this.sugerencia = `🚨 DESVIACIÓN DETECTADA: El lote debería tener ${this.tiempoEsperado}, pero la IA detectó ${this.resultado}. Posible falla de compresores o fuga térmica.`;
              observacionAux = `Desviación Crítica. Esperado: ${this.tiempoEsperado} | IA Detectó: ${this.resultado}`;
            } else {
              this.sugerencia = `✅ AUDITORÍA VALIDADA: Consistencia térmica confirmada. La IA ratifica los ${this.resultado} de congelación profunda.`;
              observacionAux = `Validación exitosa. Sincronía en ${this.resultado}.`;
            }
            
            const nuevoRegistro: RegistroHistorial = {
              id: `MS-2026-${this.totalEscaneos}`,
              fecha: new Date().toLocaleString('es-PE'),
              imagen: this.imagePreview, 
              resultado: this.resultado,
              estado: esFalla ? 'CRÍTICO' : 'ESTABLE',
              observacion: observacionAux
            };

            this.historial.unshift(nuevoRegistro); 
            
            this.loading = false;
            this.cdr.detectChanges();
          }, 50);
        }
      },
      error: (err) => {
        console.error('Error en la petición:', err);
        setTimeout(() => {
          this.resultado = 'ERROR';
          this.sugerencia = 'Verifique que el servidor Flask (puerto 5000) esté corriendo.';
          this.loading = false;
          this.cdr.detectChanges();
        }, 50);
      }
    });
  }

  getStatusClass() {
    if (this.resultado === 'ERROR') return 'text-warning fw-bold display-4';
    if (this.resultado === '') return 'text-muted fw-bold display-4';
    // Si hay desviación (alerta reciente subió), lo pinta en rojo, si no en verde
    return (this.tiempoEsperado !== this.resultado) ? 'text-danger fw-bold display-4' : 'text-success fw-bold display-4';
  }

  generarReportePDF() {
    alert(`Generando Informe de Auditoría Cruzada — MeatScan AI\n\n` +
          `Tiempo Teórico de Planta: ${this.tiempoEsperado}\n` +
          `Tiempo Detectado por IA: ${this.resultado || 'SIN ANÁLISIS'}\n` +
          `Resultado: ${this.tiempoEsperado === this.resultado ? 'APROBADO' : 'DESVIACIÓN CRÍTICA'}\n\n` +
          `Descargando documento para DIGESA...`);
  }
}