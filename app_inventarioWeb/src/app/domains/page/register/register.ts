import { Component, inject } from '@angular/core';
import { User } from '../../../models/user';
import { Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  nav = inject(Router);
  user = inject(UserService);

  nameCtlr = new FormControl('', {
    validators: [Validators.required, Validators.nullValidator],
  });
  emailCtlr = new FormControl('', {
    validators: [Validators.required, Validators.nullValidator],
  });
  passwordCtlr = new FormControl('', {
    validators: [Validators.required, Validators.nullValidator],
  });

  registerUser(event: Event) {
    event.preventDefault();
    const name = String(this.nameCtlr.value);
    const email = String(this.emailCtlr.value);
    const password = String(this.passwordCtlr.value);

    if ((name || password || email) !== null) {
      const newUser: User = {
        name: name,
        password: password,
        email: email,
      };

      this.user.registerUser(newUser);
      this.nav.navigate(['/']);
    }
  }

  ReturnLogin() {
    this.nav.navigate(['/']);
  }
}
