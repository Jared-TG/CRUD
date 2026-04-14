import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environments';

export interface Maestro {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  numero_empleado: string;
  departamento: string;
}

export interface MaestroData {
  nombre: string;
  apellido: string;
  correo: string;
  numero_empleado: string;
  departamento: string;
}

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiurl}/maestros`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('seccion_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getMaestros(): Observable<Maestro[]> {
    return this.http.get<Maestro[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getMaestroById(id: number): Observable<Maestro> {
    return this.http.get<Maestro>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createMaestro(data: MaestroData): Observable<Maestro> {
    return this.http.post<Maestro>(this.baseUrl, data, { headers: this.getAuthHeaders() });
  }

  updateMaestro(id: number, data: MaestroData): Observable<Maestro> {
    return this.http.put<Maestro>(`${this.baseUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteMaestro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
