export interface Product {
  id: string;
  estilo: string;
  patron: string;
  cantidad: number;
  tallas: string[];
  colores: string[];
  caracteristicas: string;
  mangaCorta: boolean;
  precio: number;
  estado: string;
  hasImage: boolean;
}
