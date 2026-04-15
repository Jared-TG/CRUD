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
import { AlumnosService, Alumno } from '../../services/alumnos-service';

@Component({
  selector: 'app-alumnos',
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
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.scss',
})
export class Alumnos implements OnInit {
  private fb = inject(FormBuilder);
  private alumnosService = inject(AlumnosService);
  private snackBar = inject(MatSnackBar);

  alumnosList = signal<Alumno[]>([]);
  isLoading = signal<boolean>(false);
  editando = signal<boolean>(false);
  editandoId = signal<number | null>(null);

  displayedColumns: string[] = ['nombre', 'apellido', 'matricula', 'carrera', 'semestre', 'correo', 'editar', 'eliminar'];

  alumnoForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    matricula: ['', [Validators.required]],
    carrera: ['', [Validators.required]],
    semestre: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    correo: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.alumnosService.getAlumnos().subscribe({
      next: (alumnos) => {
        this.alumnosList.set(alumnos);
      },
      error: (err) => {
        console.error('Error al cargar alumnos:', err);
        this.snackBar.open('Error al cargar la lista de alumnos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  guardar() {
    if (this.alumnoForm.invalid) return;

    this.isLoading.set(true);
    const formValores = this.alumnoForm.getRawValue();

    if (this.editando()) {
      const id = this.editandoId()!;
      this.alumnosService.updateAlumno(id, formValores).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Alumno actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.cargarAlumnos();
          this.limpiar();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open('Error al actualizar alumno', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    } else {
      this.alumnosService.createAlumno(formValores).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Alumno registrado con éxito', 'Cerrar', { duration: 3000 });
          this.cargarAlumnos();
          this.limpiar();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open('Error al registrar alumno', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  editar(alumno: Alumno) {
    this.alumnoForm.patchValue({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      matricula: alumno.matricula,
      carrera: alumno.carrera,
      semestre: alumno.semestre,
      correo: alumno.correo,
    });
    this.editando.set(true);
    this.editandoId.set(alumno.id);
  }

  limpiar() {
    this.alumnoForm.reset({ semestre: 1 });
    this.editando.set(false);
    this.editandoId.set(null);
  }

  eliminar(alumno: Alumno) {
    if (!alumno.id) {
      this.snackBar.open('El alumno no tiene ID válido', 'Cerrar', { duration: 3000 });
      return;
    }

    if (confirm(`¿Estás seguro de eliminar a ${alumno.nombre} ${alumno.apellido}?`)) {
      this.alumnosService.deleteAlumno(alumno.id).subscribe({
        next: () => {
          this.snackBar.open('Alumno eliminado', 'Cerrar', { duration: 3000 });
          this.cargarAlumnos();
          if (this.editandoId() === alumno.id) {
            this.limpiar();
          }
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.snackBar.open('Error al eliminar alumno', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
