import { Component, signal } from '@angular/core';
import { Movement } from '../../../models/movement';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-history',
  styleUrl: './history.css',
  templateUrl: './history.html',
})
export class History {
  public MovementsList = signal<Movement[]>([]);

  // cada vez que se inicie realizara lo siguiente
  constructor() {
    this.getList();
    const date = new Date();
    this.getNewDate(date);
  }

  // extrae todos los registros de movements
  private async getList() {
    try {
      const res = await fetch('http://localhost:3000/moveAll');

      if (!res.ok) {
        throw new Error('Error al intentar obtener la lista');
      }
      this.MovementsList.set(await res.json());
    } catch (error) {
      throw new Error('Error al intentar obtener la lista');
    }
  }

  getNewDate(date: Date) {
    const newdateToDate = new Date(date);
    const newDate = newdateToDate.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Cambia a true si prefieres formato 12h (AM/PM)
    });
    return newDate;
  }
}
