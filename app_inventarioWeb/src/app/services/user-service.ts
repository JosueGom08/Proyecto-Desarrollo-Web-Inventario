import { effect, inject, Service, signal } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Service()
export class UserService {
  // injeccion de dependencias
  public nav = inject(Router);

  // variables
  public CurrentUser = signal<User | null>(null);
  public isAdministrator = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.IsCurrentUserActive();
      const user = this.CurrentUser();
      if (user?.role === 'administrador') {
        this.isAdministrator.set(true);
      }
    });
  }

  // registra a un nuevo usuario
  async registerUser(newUser: User) {
    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          password: newUser.password,
          email: newUser.email,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error en la petición de ingreso: ${res.status}`);
      }

      const data = await res.json();
    } catch (error) {
      console.error('Hubo un problema con la petición:', error);
      alert(error);
    }
  }

  // verifica si hay un usuario registrado en la base de datos (inicio de sesion)
  async IsUserRegistred(userName: string, userPassword: string): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:3000/verifyUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          password: userPassword,
        }),
      });

      if (!res.ok) {
        return false;
        // throw new Error(`Error en la petición de verificacion de usuario: ${res.status}`);
      }

      const newUser = await res.json();
      if (newUser.message) {
        return false;
      } else {
        this.CurrentUser.update((user) => (user = newUser));
        const { id } = newUser;
        this.saveCurrentUser(id); // guarda al usuario con la sesion activa (id)
        return true;
      }
    } catch (error) {
      console.log('Ocurrio un erro durante el proceso de verificar al usuario' + error);
      return false;
    }
  }

  // extrae de la base de datos un usuario con base a un id (guardado en localhost, para reconocer quienes ya habian iniciado sesion)
  async setUserSaved(id: string) {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`);

      if (!res.ok) {
        throw new Error(`Error en la petición de obtencion de usuario: ${res.status}`);
      }

      const user = await res.json(); // usuario obtenido de la db
      this.CurrentUser.update((currentUser) => (currentUser = user));
    } catch (error) {
      console.error('Error al intentar buscar usuario por id', error);
    }
  }

  // si un usuario fue verificado, guarda su sesion en localStorage
  saveCurrentUser(id: string) {
    localStorage.setItem('user', id);
  }

  // verifica si hay un usuario almacenado en localStorage
  IsCurrentUserActive() {
    if (this.CurrentUser() === null) {
      const id = localStorage.getItem('user'); // donde se guarda la sesion iniciada
      if (id === null) {
        this.nav.navigate(['/']); // no hay una sesion actual ni anterior (primera vez entrando)
      } else {
        this.setUserSaved(id); // funcion extrae usuario desde la base de datos y lo inserta como usuario actual
        this.nav.navigate(['/home']); // no hay sesion actual, pero si una anterior (entro anteriormente a la aplicacion)
      }
    } else {
      this.nav.navigate(['/home']); // la sesion esta activa
    }
  }

  userLogout() {
    localStorage.removeItem('user'); // borramos el id, para buscar al usuario
    this.CurrentUser.set(null); // indicamos que no habra usuario
  }
}
