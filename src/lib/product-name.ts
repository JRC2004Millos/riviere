export function generateProductName(
  caracteristicas: string,
  colores: string[],
  mangaCorta: boolean,
): string {
  const cat = caracteristicas.trim() || "Diseño";
  const colorStr = colores.filter(Boolean).join("/").toLowerCase();
  const suffix = mangaCorta ? " manga corta" : "";
  return `Camisa ${cat} ${colorStr}${suffix}`.trim();
}
