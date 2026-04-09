import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Registrar Nuevo Usuario</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="usuario-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej. Juan Pérez">
          @if (userForm.controls.nombre.hasError('required')) {
            <mat-error>El nombre es requerido</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Ej. juan@correo.com">
          @if (userForm.controls.email.hasError('required')) {
            <mat-error>El correo es requerido</mat-error>
          }
          @if (userForm.controls.email.hasError('email')) {
            <mat-error>Formato de correo inválido</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contraseña</mat-label>
          <input matInput formControlName="password" type="password" placeholder="Tu contraseña">
          @if (userForm.controls.password.hasError('required')) {
            <mat-error>La contraseña es requerida</mat-error>
          }
          @if (userForm.controls.password.hasError('minlength')) {
            <mat-error>Mínimo 6 caracteres</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="userForm.invalid" (click)="guardar()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .usuario-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 16px;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class UsuarioDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);

  userForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  guardar() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.getRawValue());
    }
  }
}
