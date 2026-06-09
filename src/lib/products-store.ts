import { prisma } from "./prisma";

export type ProductVariant = {
  id: string;
  talla: string;
  color: string; // "" = producto de un solo color sin nombre de color
  cantidad: number;
  ubicacion: string;
};

export type ProductOverride = {
  precio?: number;
  descripcion?: string;
  caracteristicas?: string;
  nombre?: string;
  material?: string | null;
};

export type MergedProduct = {
  id: string;
  estilo: string;
  patron: string;
  caracteristicas: string;
  mangaCorta: boolean;
  precio: number;
  estado: string;
  hasImage: boolean;
  descripcion?: string;
  nombre: string;
  material?: string;
  variantes: ProductVariant[];
  // Campos derivados para compatibilidad con filtros y display
  tallas: string[];   // tallas únicas entre todas las variantes
  colores: string[];  // colores únicos (excluye "")
  cantidad: number;   // stock total (suma de todas las variantes)
};

type DBProduct = {
  id: string;
  estilo: string;
  patron: string;
  caracteristicas: string;
  mangaCorta: boolean;
  precio: number;
  estado: string;
  hasImage: boolean;
  descripcion: string | null;
  nombre: string;
  material: string | null;
  variantes: Array<{ id: string; talla: string; color: string; cantidad: number; ubicacion: string }>;
};

export const TALLA_ORDER = ["S", "S-M", "M", "M-L", "L", "L-XL", "XL", "XL-XXL", "XXL"];

function sortTallas(tallas: string[]): string[] {
  return [...tallas].sort((a, b) => {
    const ai = TALLA_ORDER.indexOf(a);
    const bi = TALLA_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function toMerged(p: DBProduct): MergedProduct {
  const variantes: ProductVariant[] = p.variantes;
  const tallas = sortTallas([...new Set(variantes.map((v) => v.talla))]);
  const colores = [...new Set(variantes.map((v) => v.color).filter((c) => c !== ""))];
  const cantidad = variantes.reduce((sum, v) => sum + v.cantidad, 0);

  return {
    id: p.id,
    estilo: p.estilo,
    patron: p.patron,
    caracteristicas: p.caracteristicas,
    mangaCorta: p.mangaCorta,
    precio: p.precio,
    estado: p.estado,
    hasImage: p.hasImage,
    descripcion: p.descripcion ?? undefined,
    nombre: p.nombre,
    material: p.material ?? undefined,
    variantes,
    tallas,
    colores,
    cantidad,
  };
}

export async function getAllProducts(): Promise<MergedProduct[]> {
  const rows = await prisma.product.findMany({
    orderBy: { estilo: "asc" },
    include: { variantes: true },
  });
  return rows.map(toMerged);
}

export async function getProductByEstilo(
  estilo: string,
): Promise<MergedProduct | null> {
  const row = await prisma.product.findFirst({
    where: { estilo: { equals: estilo, mode: "insensitive" } },
    include: { variantes: true },
  });
  return row ? toMerged(row) : null;
}

export async function saveProductOverride(
  estilo: string,
  override: ProductOverride,
): Promise<void> {
  await prisma.product.update({
    where: { estilo },
    data: {
      ...(override.precio !== undefined && { precio: override.precio }),
      ...(override.descripcion !== undefined && {
        descripcion: override.descripcion || null,
      }),
      ...(override.caracteristicas !== undefined && {
        caracteristicas: override.caracteristicas,
      }),
      ...(override.nombre !== undefined && { nombre: override.nombre }),
      ...(override.material !== undefined && {
        material: override.material || null,
      }),
    },
  });
}

export async function saveVariantStock(
  updates: Array<{ id: string; cantidad: number }>,
): Promise<void> {
  await prisma.$transaction(
    updates.map(({ id, cantidad }) =>
      prisma.productVariant.update({
        where: { id },
        data: { cantidad: Math.max(0, cantidad) },
      }),
    ),
  );
}

export async function upsertVariants(
  productId: string,
  variants: Array<{ talla: string; color: string; cantidad: number; ubicacion: string }>,
): Promise<void> {
  await prisma.$transaction(
    variants.map(({ talla, color, cantidad, ubicacion }) =>
      prisma.productVariant.upsert({
        where: { productId_talla_color: { productId, talla, color } },
        update: { cantidad: Math.max(0, cantidad), ubicacion },
        create: { productId, talla, color, cantidad: Math.max(0, cantidad), ubicacion },
      }),
    ),
  );
}
