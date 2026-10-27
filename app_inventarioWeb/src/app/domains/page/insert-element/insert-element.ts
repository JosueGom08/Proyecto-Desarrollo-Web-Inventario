import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ElementService } from '../../../services/element-service';
import { UserService } from '../../../services/user-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-insert-element',
  styleUrl: './insert-element.css',
  templateUrl: './insert-element.html',
})
export class InsertElement {
  // injeccion de dependencias
  public nav = inject(Router);
  public elementService = inject(ElementService);
  public userService = inject(UserService);

  // para cargar la imagen en pantalla
  public previewURL = signal<String | null>(null);
  // guarda la imagen para ser ingresada
  public img = signal<File | null>(null);

  // obtienen la data de los inputs
  nameCTLR = new FormControl('', { validators: [Validators.required] });
  descriptionCTLR = new FormControl('', { validators: [Validators.required] });
  quantityCTLR = new FormControl<number | null>(null, { validators: [Validators.required] });
  categoryCTLR = new FormControl('', { validators: [Validators.required] });
  typeCTLR = new FormControl('', { validators: [Validators.required] });

  constructor() {
    // evita que una persona sin los permisos pueda acceder
    if (this.userService.CurrentUser()?.role !== 'administrador') {
      this.nav.navigate(['/home']);
    }
  }

  // funcion la cual permite ver las imagenes seleccionadas (como vista previa)
  previewFile(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const archivo = input.files[0];
      const lector = new FileReader();

      // guardamos la imagen
      this.img.set(archivo);

      // la hacemos leible
      lector.onload = () => {
        // Actualizamos el signal con la cadena base64 de la imagen
        this.previewURL.set(lector.result as string);
      };

      lector.readAsDataURL(archivo);
    }
  }

  async insertElement() {
    // envia los datos y espera un respuesta, insertado correctamente o un mensaje de error
    const res = await this.elementService.addElement(
      this.nameCTLR.value!,
      this.descriptionCTLR.value!,
      this.quantityCTLR.value!,
      this.categoryCTLR.value!,
      this.typeCTLR.value!,
      this.img()!,
    );

    if (!res.message) {
      // Registramos el movimiento de 'INSERT'
      alert('El siguiente elemento ha sido agregado: ' + res.name!);
      this.nav.navigate(['/home']);
    } else {
      alert(res.message);
    }
  }

  returnHome() {
    this.nav.navigate(['/home']);
  }
}
