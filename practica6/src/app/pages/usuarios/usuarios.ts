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
  editando = signal<boolean>(false);
  editandoId = signal<number | null>(null);

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
        this.usuariosList.set(users);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.snackBar.open('Error al cargar la lista de usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  guardar() {
    if (this.userForm.invalid) return;

    this.isLoading.set(true);
    const formValores = this.userForm.getRawValue();

    if (this.editando()) {
      // Modo edición: actualizamos el usuario existente
      const id = this.editandoId()!;
      const datosActualizar = {
        name: formValores.nombre,
        email: formValores.email,
        password: formValores.password
      };

      this.authService.updateUser(id, datosActualizar).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.cargarUsuarios();
          this.limpiar();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    } else {
      // Modo creación: registramos un nuevo usuario
      const nuevoUsuario = {
        name: formValores.nombre,
        email: formValores.email,
        password: formValores.password
      };

      this.authService.register(nuevoUsuario).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Usuario registrado con éxito', 'Cerrar', { duration: 3000 });
          this.cargarUsuarios();
          this.limpiar();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open('Error al registrar usuario', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  editar(usuario: seccionUser) {
    const nombre = usuario.NAME || usuario.nombre || usuario.name || '';
    this.userForm.patchValue({
      nombre: nombre,
      email: usuario.email,
      password: '' // El usuario debe ingresar la nueva contraseña
    });
    // En modo edición, la contraseña no es obligatoria (opcional cambiarla)
    this.userForm.controls.password.clearValidators();
    this.userForm.controls.password.updateValueAndValidity();

    this.editando.set(true);
    this.editandoId.set(usuario.id);
  }

  limpiar() {
    this.userForm.reset();
    this.editando.set(false);
    this.editandoId.set(null);
    // Restaurar validadores del password al limpiar (volver a modo creación)
    this.userForm.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.controls.password.updateValueAndValidity();
  }

  eliminar(usuario: seccionUser) {
    if (!usuario.id) {
      this.snackBar.open('El usuario no tiene ID válido', 'Cerrar', { duration: 3000 });
      return;
    }

    const nombreUsuario = usuario.NAME || usuario.nombre || usuario.name || 'este usuario';

    if (confirm(`¿Estás seguro de eliminar a ${nombreUsuario}?`)) {
      this.authService.deleteUser(usuario.id).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
          this.cargarUsuarios();
          // Si estábamos editando el usuario eliminado, limpiar el formulario
          if (this.editandoId() === usuario.id) {
            this.limpiar();
          }
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
