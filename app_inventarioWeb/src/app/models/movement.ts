export interface Movement {
  id?: string; // id movimiento
  type: string; // tipo de movimiento
  name: string; // nombrel del producto
  elementId: number; // id del producto
  quantity: number;
  description: string;
  lastModification: Date; // el ultimo movimiento (si es insert = null)
  newModification: Date; // cuando se hizo el movimiento actual
}
