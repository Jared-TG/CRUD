import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environments';

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  carrera: string;
  semestre: number;
  correo: string;
}

export interface AlumnoData {
  nombre: string;
  apellido: string;
  matricula: string;
  carrera: string;
  semestre: number;
  correo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiurl}/alumnos`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('seccion_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getAlumnoById(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createAlumno(data: AlumnoData): Observable<Alumno> {
    return this.http.post<Alumno>(this.baseUrl, data, { headers: this.getAuthHeaders() });
  }

  updateAlumno(id: number, data: AlumnoData): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.baseUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
