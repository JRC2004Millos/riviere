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
  // ubicacion por fila de Excel: se propaga a cada variante de esa fila
  ubicacion?: string;
}
