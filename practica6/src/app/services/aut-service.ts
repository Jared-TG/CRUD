import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environment/environments';

export interface seccionUser{
    id : number;
    name? : string; // Hacemos opcional name por si viene como NAME desde la base de datos
    NAME? : string; // Campo tal como viene de Prisma (mysql en mayúscula)
    nombre? : string; 
    email : string;
}

export interface RegisterData {
    NAME: string; // Enviamos NAME en lugar de nombre para que coincida con la base de datos
    email: string;
    PASSWORD?: string; // Enviamos PASSWORD en lugar de password
}

interface LoginResponse {
  token : string;
  message : string;
  user : seccionUser;
}

@Injectable({
  providedIn: 'root',
})
export class AutService {
  private http = inject(HttpClient);

  private readonly storageKey = 'Seccion_User';
  private readonly  storageKeyToken = 'seccion_token';
  private readonly  LoginUrl = `${environment.apiurl}/auth/login`;


  private readonly _currentUser = signal <seccionUser | null>(this.readFromStorage());

  readonly isAuthenticated = computed(() => this._currentUser() !== null )

  readonly curretUser = computed(() => this._currentUser());

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.storageKeyToken);
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getUsers(): Observable<seccionUser[]> {
    return this.http.get<seccionUser[]>(`${environment.apiurl}/auth/users`, { headers: this.getAuthHeaders() });
  }

  register(userData: RegisterData): Observable<seccionUser> {
    return this.http.post<seccionUser>(`${environment.apiurl}/auth/register`, userData, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiurl}/auth/users/${id}`, { headers: this.getAuthHeaders() });
  }

  Login(email: string, password: string) : Observable<seccionUser>  {
    return this.http.post<LoginResponse>(this.LoginUrl,{email, password}).pipe(
      tap((response) => {
        localStorage.setItem(this.storageKey,JSON.stringify(response.token));
        localStorage.setItem(this.storageKeyToken,response.token);
        this._currentUser.set(response.user);
      }),
      map((response) => response.user)
    );
  }

  readFromStorage() : seccionUser | null {
    const user = localStorage.getItem(this.storageKey);
    if (!user) return null;
    try {
    return JSON.parse(user) as seccionUser;

    }catch{
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
  
  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(this.storageKey);
  }
}
