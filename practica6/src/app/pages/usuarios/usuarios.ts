import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AutService, seccionUser } from '../../services/aut-service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AutService);
  private snackBar = inject(MatSnackBar);

  // Señales
  usuariosList = signal<seccionUser[]>([]);
  isLoading = signal<boolean>(false);

  displayedColumns: string[] = ['nombre', 'email', 'editar', 'eliminar'];

  userForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.authService.getUsers().subscribe({
      next: (users) => {
        // Guardamos directamente los usuarios parseados. 
        // El HTML usará element.nombre || element.name
        this.usuariosList.set(users);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.snackBar.open('Error al cargar la lista de usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  guardar() {
    if (this.userForm.valid) {
      this.isLoading.set(true);
      const formValores = this.userForm.getRawValue();
      
      // Mapeamos los valores del formulario a lo que espera Prisma en el backend
      const nuevoUsuario = {
        NAME: formValores.nombre,
        email: formValores.email,
        PASSWORD: formValores.password
      };
      
      this.authService.register(nuevoUsuario).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Usuario registrado con éxito', 'Cerrar', { duration: 3000 });
          this.cargarUsuarios(); // Recargar la lista desde la BD
          this.userForm.reset();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open('Error al registrar usuario', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  eliminar(usuario: seccionUser) {
    if (!usuario.id) {
      this.snackBar.open('El usuario no tiene ID válido', 'Cerrar', { duration: 3000 });
      return;
    }

    // Leemos el nombre usando las propiedades que podrían venir
    const nombreUsuario = usuario.NAME || usuario.nombre || usuario.name || 'este usuario';

    if (confirm(`¿Estás seguro de eliminar a ${nombreUsuario}?`)) {
      this.authService.deleteUser(usuario.id).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
          this.cargarUsuarios(); // Recargamos la lista
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
