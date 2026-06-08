export function generateProductName(
  caracteristicas: string,
  colores: string[],
  mangaCorta: boolean,
): string {
  const cat = caracteristicas.trim() || "Diseño";
  const color = (colores[0] ?? "").toLowerCase();
  const suffix = mangaCorta ? " manga corta" : "";
  return `Camisa ${cat} ${color}${suffix}`.trim();
}
