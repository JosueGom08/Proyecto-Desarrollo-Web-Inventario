import { Component, inject } from '@angular/core';
import { FormControl, FormGroupName, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  // injeccion de dependencias
  nav = inject(Router);
  userService = inject(UserService);

  // variables

  // form inicio de sesion
  // nombre de usuario
  userName = new FormControl('', {
    validators: [Validators.required, Validators.nullValidator],
  });

  // contrasena
  userPassword = new FormControl('', {
    validators: [Validators.required, Validators.nullValidator],
  });

  // acceder a la pagina
  async GetAccess(event: Event) {
    // event.preventDefault();
    if ((this.userName.value || this.userPassword.value) !== null) {
      const answer = await this.userService.IsUserRegistred(
        this.userName.value!,
        this.userPassword.value!,
      );
      if (answer) {
        this.nav.navigate(['/home']);
      } else {
        alert(
          'Usuario no reconocido, si no esta registrado inicie primero el proceso de registro para ser admitido',
        );
      }
    }
  }

  // registrarse (boton que dirige a la seccion de registro)
  Register() {
    this.nav.navigate(['/register']);
  }
}
