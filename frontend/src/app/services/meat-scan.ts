import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeatScanService {
  // URL configurada desde environments (dinámica para Vercel/Render)
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  predecir(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl, formData);
  }
}
