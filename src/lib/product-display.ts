import type { Product } from "@/src/types/product";

export function getProductStyleCategory(product: Product) {
  return product.caracteristicas.trim() || "Sin clasificar";
}

export function getProductCatalogStatus(product: Product) {
  return product.cantidad > 0 ? "Disponible" : "Sin stock";
}
