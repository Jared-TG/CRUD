import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutService } from '../../services/aut-service';
import { Router } from '@angular/router';   
import { observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private fb = inject (FormBuilder);
  private auth = inject(AutService);
  private router = inject(Router);

  public login_valido = signal<boolean>(true);
  public showPassword = signal<boolean>(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  onSubmit() {
    if (this.form.invalid){
      this.form.markAllAsDirty();
      return; 
    }
    const { email, password } = this.form.getRawValue(); 

    this.auth.Login(email!, password!)
      .subscribe({
        next: () => this.router.navigateByUrl('/home'),
        error: (error: HttpErrorResponse) => {
          console.log(error);
          console.log(error.status);
        }
      });

  }
}

