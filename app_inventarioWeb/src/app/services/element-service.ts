import { Service, signal, SimpleChange } from '@angular/core';
import { element } from '../models/element';
import { Movement } from '../models/movement';

@Service()
export class ElementService {
  public isLoadingHome = signal<boolean>(false);
  public isLoadingElement = signal<boolean>(false);
  public isLoadingMovements = signal<boolean>(false);

  // lista donde se almacenaran todas los elementos del inventario
  public elementList = signal<element[]>([]);

  // lista de movimientos
  public movementsList = signal<Movement[]>([]);

  // vista detallada del elemento
  public currentElement = signal<element | null>(null);

  public async getMovements() {
    this.isLoadingMovements.set(true);
    try {
      const res = await fetch('http://localhost:3000/moveAll');

      if (!res.ok) {
        throw new Error('Error al intentar obtener la lista de movimientos');
      }

      const data: Movement[] = await res.json();
      this.movementsList.set(data);
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoadingMovements.set(false);
    }
  }

  public async getListDB() {
    this.isLoadingHome.set(true);
    try {
      const res = await fetch('http://localhost:3000/elements');

      if (!res.ok) {
        throw new Error('Error al intentar obtener los elementos de la lista');
      }

      const data: element[] = await res.json();
      this.elementList.set(data);
    } catch (error) {
      console.error('Error al intentar obtener la lista de elementos');
    } finally {
      this.isLoadingHome.set(false);
    }
  }

  public async getElement(id: number): Promise<boolean> {
    this.isLoadingElement.set(true);
    try {
      const res = await fetch(`http://localhost:3000/elements/${id}`);

      if (!res.ok) {
        throw new Error('Error al intentar obtener el elemento por id');
      }

      const element: element = await res.json();
      this.currentElement.set(element);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      this.isLoadingElement.set(false);
    }
  }

  public async addElement(
    name: string,
    description: string,
    quantity: number,
    category: string,
    type: string,
    file: File,
  ) {
    try {
      // para poder enviar la imagen de tipo file, debemos de crear un formdata
      const formData = new FormData();
      formData.append('img', file);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('type', type);
      formData.append('quantity', String(quantity));

      const res = await fetch('http://localhost:3000/elements', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Error al intentar ingresar nuevo elemento');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  public async updateElement(
    name: string,
    description: string,
    quantity: number,
    category: string,
  ) {
    if (this.currentElement() === null) {
      throw new Error(
        'No hay un elemento ingresado, ocurrio un error que no deberia de haber ocurrido',
      );
    }

    try {
      const res = await fetch(`http://localhost:3000/elements/${this.currentElement()?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: description,
          quantity: quantity,
          category: category,
        }),
      });

      if (!res.ok) {
        throw new Error('Ocurrio un error al intentar actualizar el producto' + name);
      }

      const data = await res.json();
      // actualizamos el elemento actual
      this.currentElement.update((element) => ({
        ...element!,
        id: Number(data.element.id),
        name: String(data.element.name),
        description: String(data.element.description),
        quantity: Number(data.element.quantity),
        category: String(data.element.category),
      }));

      // Registramos el movimiento 'UPDATE'
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteElement() {
    try {
      const res = await fetch(`http://localhost:3000/elements/${this.currentElement()?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'Application/json',
        },
      });

      const data = await res.json();
      alert(data.message);
      // actualizamos la lista
      this.elementList.update((list) => {
        return list.filter((value) => value.id !== this.currentElement()?.id);
      });

      // Registramos el movimiento 'DELETE'
    } catch (error) {
      console.log(error);
    }
  }

  public async ElementQuantity(id: number, quantity: number, type: string) {
    try {
      const res = await fetch(`http://localhost:3000/elementsQuantity/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          quantity: quantity,
          type: type,
        }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  }
}
