import { Component, computed, effect, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { ElementService } from '../../../services/element-service';
import { CardElement } from '../../../shared/components/card-element/card-element';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../../../shared/components/login/login';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [CardElement, Login, ReactiveFormsModule, RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  // injeccion de dependencias
  public elementService = inject(ElementService);
  public userService = inject(UserService);
  public nav = inject(Router);

  // senal
  public filter = signal<string>('Todos');
  public isAddingElement = signal<boolean>(false);

  // obtencion de datos del form (id)
  idCTRL = new FormControl('', {
    validators: [Validators.required, Validators.nullValidator],
  });

  // cantidad
  quantityCTRL = new FormControl('', {
    validators: [Validators.required, Validators.nullValidator],
  });

  constructor() {
    // se asegura de obtener la lista al iniciar el componente
    effect(() => {
      this.elementService.getListDB();
    });
  }

  // salir de la pantalla inicial
  logout() {
    this.userService.userLogout();
    this.nav.navigate(['/']);
  }

  // agregacion de elemento nuevo
  addElement() {
    this.nav.navigate(['/insert-element']);
  }

  // agregacion de elementos existentes
  async addElementQuantity() {
    console.log(this.idCTRL.value, this.quantityCTRL.value);
    await this.elementService.ElementQuantity(
      Number(this.idCTRL.value!),
      Number(this.quantityCTRL.value!),
      'INSERT',
    );
    window.location.reload();
  }

  // filtro de categoria
  filterSelector = computed(() => {
    const filter = this.filter();
    const listElement = this.elementService.elementList();
    // filtro por categoria de elementos
    if (filter === 'Todos') {
      return listElement;
    } else {
      return listElement.filter((element) => element.category === filter);
    }
  });

  // set de la categoria elegida
  setFilter(event: Event) {
    const text = event.target as HTMLElement;
    this.filter.update((state) => (state = text.textContent.trim()));
  }
}
