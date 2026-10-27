import { Component, inject, input, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { element } from '../../../models/element';

@Component({
  imports: [RouterLink],
  selector: 'app-card-element',
  styleUrl: './card-element.css',
  templateUrl: './card-element.html',
})
export class CardElement {
  // injeccion de dependencias
  public nav = inject(Router);

  // inputs
  public element = input<element>(); // del elemento exacto

  public date = signal<String>('');

  ngOnInit() {
    this.date.update((date) => (date = this.dateFixed()!));
  }

  dateFixed() {
    return this.element()?.entryDate.slice(0, 10);
  }
}
