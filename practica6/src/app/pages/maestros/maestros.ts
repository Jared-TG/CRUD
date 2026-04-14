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
import { MaestrosService, Maestro } from '../../services/maestros-service';

@Component({
  selector: 'app-maestros',
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
  templateUrl: './maestros.html',
  styleUrl: './maestros.scss',
})
export class Maestros implements OnInit {
  private fb = inject(FormBuilder);
  private maestrosService = inject(MaestrosService);
  private snackBar = inject(MatSnackBar);

  // Señales
  maestrosList = signal<Maestro[]>([]);
  isLoading = signal<boolean>(false);
  editando = signal<boolean>(false);
  editandoId = signal<number | null>(null);

  displayedColumns: string[] = ['nombre', 'apellido', 'correo', 'numero_empleado', 'departamento', 'editar', 'eliminar'];

  maestroForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    numero_empleado: ['', [Validators.required]],
    departamento: ['', [Validators.required]]
  });

  ngOnInit() {
    this.cargarMaestros();
  }

  cargarMaestros() {
    this.maestrosService.getMaestros().subscribe({
      next: (maestros) => {
        this.maestrosList.set(maestros);
      },
      error: (err) => {
        console.error('Error al cargar maestros:', err);
        this.snackBar.open('Error al cargar la lista de maestros', 'Cerrar', { duration: 3000 });
      }
    });
  }

  guardar() {
    if (this.maestroForm.invalid) return;

    this.isLoading.set(true);
    const formValores = this.maestroForm.getRawValue();

    if (this.editando()) {
      const id = this.editandoId()!;
      this.maestrosService.updateMaestro(id, formValores).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Maestro actualizado con éxito', 'Cerrar', { duration: 3000 });
          this.cargarMaestros();
          this.limpiar();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open('Error al actualizar maestro', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    } else {
      this.maestrosService.createMaestro(formValores).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.open('Maestro registrado con éxito', 'Cerrar', { duration: 3000 });
          this.cargarMaestros();
          this.limpiar();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open('Error al registrar maestro', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  editar(maestro: Maestro) {
    this.maestroForm.patchValue({
      nombre: maestro.nombre,
      apellido: maestro.apellido,
      correo: maestro.correo,
      numero_empleado: maestro.numero_empleado,
      departamento: maestro.departamento
    });
    this.editando.set(true);
    this.editandoId.set(maestro.id);
  }

  limpiar() {
    this.maestroForm.reset();
    this.editando.set(false);
    this.editandoId.set(null);
  }

  eliminar(maestro: Maestro) {
    if (!maestro.id) {
      this.snackBar.open('El maestro no tiene ID válido', 'Cerrar', { duration: 3000 });
      return;
    }

    if (confirm(`¿Estás seguro de eliminar a ${maestro.nombre} ${maestro.apellido}?`)) {
      this.maestrosService.deleteMaestro(maestro.id).subscribe({
        next: () => {
          this.snackBar.open('Maestro eliminado', 'Cerrar', { duration: 3000 });
          this.cargarMaestros();
          if (this.editandoId() === maestro.id) {
            this.limpiar();
          }
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.snackBar.open('Error al eliminar maestro', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
