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
  dcto?: number | null;
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
  dcto: number | null;
  sortOrder: number;
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
  dcto: number | null;
  sortOrder: number;
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
    dcto: p.dcto,
    sortOrder: p.sortOrder,
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
    orderBy: [{ sortOrder: "asc" }, { estilo: "asc" }],
    include: { variantes: true },
  });
  return rows.map(toMerged);
}

export async function hasActiveOffers(): Promise<boolean> {
  const count = await prisma.product.count({
    where: {
      dcto: {
        not: null,
        gt: 0,
      },
    },
  });

  return count > 0;
}

export async function resetAllDiscounts(): Promise<number> {
  const result = await prisma.product.updateMany({
    data: { dcto: 0 },
  });

  return result.count;
}

export async function applyRandomDiscounts(
  discount: number,
  quantity: number,
): Promise<{
  updated: number;
  eligible: number;
}> {
  const eligibleProducts = await prisma.product.findMany({
    where: {
      OR: [{ dcto: null }, { dcto: 0 }],
    },
    select: { id: true },
  });

  const eligible = eligibleProducts.length;
  if (eligible === 0 || quantity <= 0) {
    return { updated: 0, eligible };
  }

  const shuffled = [...eligibleProducts].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(quantity, eligible));

  const result = await prisma.$transaction(
    selected.map((product) =>
      prisma.product.update({
        where: { id: product.id },
        data: { dcto: discount },
      }),
    ),
  );

  return { updated: result.length, eligible };
}

export async function saveSortOrder(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.product.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
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
      ...(override.dcto !== undefined && { dcto: override.dcto }),
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
