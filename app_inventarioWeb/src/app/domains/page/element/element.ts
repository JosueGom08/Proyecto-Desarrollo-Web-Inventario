import { Component, effect, inject, input, signal, SimpleChange } from '@angular/core';
import { ElementService } from '../../../services/element-service';
import { element } from '../../../models/element';
import { Router } from '@angular/router';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-element',
  styleUrl: './element.css',
  templateUrl: './element.html',
})
export class Element {
  public elementService = inject(ElementService);
  public userService = inject(UserService);
  public nav = inject(Router);

  public id = input<String>();
  public date = signal<string>('');
  public element = signal<element | null>(null);
  public editMode = signal<boolean>(false); // para iniciar la edicion
  public isDeletingElement = signal<boolean>(false);
  // public isAdministrator = signal<boolean>(false);

  // alamacenamos los valores de edicion
  nameCTLR = new FormControl('', { validators: [Validators.required] });
  descriptionCTLR = new FormControl('', { validators: [Validators.required] });
  quantityCTLR = new FormControl<number | null>(null, { validators: [Validators.required] });
  categoryCTLR = new FormControl('', { validators: [Validators.required] });
  // eliminacion de cantidad
  quantityEliminate = new FormControl<number | null>(null, { validators: [Validators.required] });

  async ngOnInit() {
    const res = await this.elementService.getElement(Number(this.id()!)); // obtenemos el elemento de la base de datos
    // verifica que si pudo recibir el elemento
    if (res) {
      this.element.set(this.elementService.currentElement()!); // si es asi hace un set en el elemento
    }
  }

  constructor() {
    // rango de administrador acceso a todas las opciones
    // if (this.userService.CurrentUser()?.role === 'administrador') {
    //   this.isAdministrator.set(true);
    // }
    // Sincronización automática: Cada vez que 'element()' cambie, actualiza los campos
    effect(() => {
      const current = this.element();
      if (current) {
        this.nameCTLR.setValue(current.name ?? '', { emitEvent: false });
        this.descriptionCTLR.setValue(current.description ?? '', { emitEvent: false });
        this.quantityCTLR.setValue(current.quantity ?? null, { emitEvent: false });
        this.categoryCTLR.setValue(current.category ?? '', { emitEvent: false });

        // Formatear fecha
        if (current.entryDate) {
          this.date.set(current.entryDate.slice(0, 10));
        }
      }
    });
  }

  dateFixed() {
    return this.element()?.entryDate.slice(0, 10);
  }

  changeUpdateMode() {
    this.editMode.set(true);
  }

  returnHome() {
    this.nav.navigate(['/home']);
  }

  // elimina elemento por completo
  deleteElement() {
    const res = confirm('¿Estás seguro de eliminar el elemento?, esta acción será permantente');
    if (res) {
      this.elementService.deleteElement();
      this.nav.navigate(['/home']);
    }
  }

  // cambia a el modo de eliminacion de cantidad
  changeEliminateEvent() {
    this.isDeletingElement.set(true);
  }
  // elimina logicamente el elemento, elimina por cantidad de elementos ingresados (ej. existencia = 10 y elimina 2; existencia = 8 )
  async updateElementQuantity() {
    // verifica si la cantidad a eliminar es mayor a la establecida
    // si es mayor aplicara la eliminacion directa (elimina el elemento por completo)
    if (this.element()?.quantity! < Number(this.quantityEliminate.value)) {
      // significa que la cantidad a eliminar es mayor a la que realmente tiene
      this.deleteElement();
    } else {
      // si es que no sobrepasa, hace la resta con normalidad
      await this.elementService.ElementQuantity(
        Number(this.element()?.id),
        Number(this.quantityEliminate.value!),
        'DELETE',
      );
      window.location.reload();
    }
  }

  async updateElement() {
    if (this.nameCTLR.invalid || this.quantityCTLR.invalid) {
      return;
    }

    await this.elementService.updateElement(
      String(this.nameCTLR.value),
      String(this.descriptionCTLR.value),
      Number(this.quantityCTLR.value),
      String(this.categoryCTLR.value),
    );

    // Actualizamos la señal con los nuevos datos del servicio
    this.element.set(this.elementService.currentElement()!);
    this.editMode.set(false);
  }

  showElement() {
    const current = this.element();
    if (current) {
      this.nameCTLR.setValue(current.name);
      this.descriptionCTLR.setValue(current.description);
      this.quantityCTLR.setValue(current.quantity);
      this.categoryCTLR.setValue(current.category);
    }
    this.editMode.set(false);
  }
}
