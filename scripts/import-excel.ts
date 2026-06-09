import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import type { Product } from "../src/types/product.ts";
import type * as XLSXType from "xlsx";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx") as typeof XLSXType;

const rootDir = process.cwd();
const defaultExcelPath = path.join(rootDir, "data", "inventario_actual.xlsx");
const excelPath = path.resolve(process.argv[2] ?? defaultExcelPath);
const outputPath = path.join(rootDir, "src", "data", "productos.ts");
const imagesDir = path.join(rootDir, "public", "images");

type ExcelRow = Record<string, unknown>;

type RawSKU = {
  estilo: string;
  talla: string;
  color: string; // "" si el producto no tiene variante de color
  cantidad: number;
  ubicacion: string;
};

type ImportReport = {
  rows: number;
  imported: number;
  variants: number;
  withImage: Product[];
  withoutImage: Product[];
  imagesWithoutProduct: string[];
};

const givenchySizeMap: Record<string, string> = {
  "14 1/2": "S",
  "14/2": "S",
  "15": "S-M",
  "15 1/2": "M",
  "15/2": "M",
  "16": "M-L",
  "16 1/2": "L",
  "16/2": "L",
  "17": "L-XL",
  "17 1/2": "XL",
  "17/2": "XL",
  "18": "XL-XXL",
  "18 1/2": "XXL",
  "18/2": "XXL",
};

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function getCell(row: ExcelRow, columnName: string) {
  const normalizedColumn = normalizeKey(columnName);
  const matchingKey = Object.keys(row).find(
    (key) => normalizeKey(key) === normalizedColumn,
  );
  return matchingKey ? row[matchingKey] : "";
}

function toText(value: unknown) {
  return String(value ?? "").trim();
}

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const normalized = toText(value)
    .replace(/[^\d.,-]/g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toList(value: unknown) {
  return toText(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toSizeList(value: unknown) {
  return toList(value).map((size) => {
    const normalizedSize = size.replace(/\s+/g, " ").trim();
    return givenchySizeMap[normalizedSize] ?? normalizedSize;
  });
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  const normalized = toText(value).toLowerCase();
  return ["si", "sí", "true", "1", "x", "yes"].includes(normalized);
}

function normalizeStyle(value: unknown) {
  return toText(value)
    .replace(/^estilo\s+/i, "")
    .replace(/\//g, "")
    .trim();
}

function normalizeImageLookupKey(value: string) {
  return normalizeKey(normalizeStyle(value));
}

function resolveStyleWithImageName(estilo: string) {
  const matchingImageName = getProductImageNames().find(
    (imageName) =>
      normalizeImageLookupKey(imageName) === normalizeImageLookupKey(estilo),
  );
  return matchingImageName ?? estilo;
}

function hasProductImage(estilo: string) {
  return fs.existsSync(path.join(imagesDir, `${estilo}.png`));
}

function rowToProduct(row: ExcelRow): Product {
  const estilo = resolveStyleWithImageName(
    normalizeStyle(getCell(row, "Estilo")),
  );
  return {
    id: estilo,
    estilo,
    patron: toText(getCell(row, "Patrón")),
    cantidad: toNumber(getCell(row, "Cantidad")),
    tallas: toSizeList(getCell(row, "Tallas")),
    colores: toList(getCell(row, "Colores")),
    caracteristicas: toText(getCell(row, "Características")),
    mangaCorta: toBoolean(getCell(row, "Manga corta")),
    precio: toNumber(getCell(row, "Precio")),
    estado: toText(getCell(row, "Estado")),
    hasImage: hasProductImage(estilo),
    ubicacion: toText(getCell(row, "Guardada en")),
  };
}

function uniqueList(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function mergeProductsByStyle(products: Product[]) {
  const productsByStyle = new Map<string, Product>();

  for (const product of products) {
    const existingProduct = productsByStyle.get(product.estilo);
    if (!existingProduct) {
      productsByStyle.set(product.estilo, product);
      continue;
    }
    productsByStyle.set(product.estilo, {
      ...existingProduct,
      cantidad: existingProduct.cantidad + product.cantidad,
      tallas: uniqueList([...existingProduct.tallas, ...product.tallas]),
      colores: uniqueList([...existingProduct.colores, ...product.colores]),
      mangaCorta: existingProduct.mangaCorta || product.mangaCorta,
      precio: existingProduct.precio || product.precio,
      estado: existingProduct.estado || product.estado,
      patron: existingProduct.patron || product.patron,
      caracteristicas:
        existingProduct.caracteristicas || product.caracteristicas,
      hasImage: existingProduct.hasImage || product.hasImage,
      ubicacion: existingProduct.ubicacion || product.ubicacion,
    });
  }

  return Array.from(productsByStyle.values()).map((product, index) => ({
    ...product,
    id: `product-${String(index + 1).padStart(3, "0")}-${product.estilo}`,
  }));
}

/**
 * Genera SKUs individuales desde las filas crudas (sin merge).
 * Usa un Map para acumular cantidades: si el Excel tiene 3 filas con
 * el mismo estilo+talla+color (cada una con cantidad=1), el SKU
 * resultante tiene cantidad=3.
 * La ubicacion se toma de la primera fila no vacía que aparezca para esa combinación.
 */
function rowsToSKUs(rawRows: Product[]): RawSKU[] {
  const skuMap = new Map<string, RawSKU>();

  for (const row of rawRows) {
    const colores = row.colores.length > 0 ? row.colores : [""];
    const numVariantes = row.tallas.length * colores.length;
    const qtyPerVariante =
      numVariantes > 0 ? Math.floor(row.cantidad / numVariantes) : 0;

    for (const talla of row.tallas) {
      for (const color of colores) {
        const key = `${row.estilo}|${talla}|${color}`;
        const existing = skuMap.get(key);
        if (existing) {
          existing.cantidad += qtyPerVariante;
          if (!existing.ubicacion && row.ubicacion) {
            existing.ubicacion = row.ubicacion;
          }
        } else {
          skuMap.set(key, {
            estilo: row.estilo,
            talla,
            color,
            cantidad: qtyPerVariante,
            ubicacion: row.ubicacion ?? "",
          });
        }
      }
    }
  }

  return Array.from(skuMap.values());
}

function getProductImageNames() {
  if (!fs.existsSync(imagesDir)) return [];
  return fs
    .readdirSync(imagesDir)
    .filter((fileName) => path.extname(fileName).toLowerCase() === ".png")
    .map((fileName) => path.basename(fileName, ".png"));
}

function buildOutput(products: Product[], skus: RawSKU[]) {
  return `import type { Product } from "@/src/types/product";

export const productos: Product[] = ${JSON.stringify(products, null, 2)};

export type RawSKU = { estilo: string; talla: string; color: string; cantidad: number; ubicacion: string };
export const skus: RawSKU[] = ${JSON.stringify(skus, null, 2)};
`;
}

function printReport(report: ImportReport) {
  console.log("Importacion desde Excel completada");
  console.log(`Filas leidas: ${report.rows}`);
  console.log(`Productos importados: ${report.imported}`);
  console.log(`Variantes generadas: ${report.variants}`);
  console.log(`Productos con imagen: ${report.withImage.length}`);
  console.log(`Productos sin imagen: ${report.withoutImage.length}`);
  if (report.withoutImage.length > 0) {
    console.log(
      `Sin imagen: ${report.withoutImage.map((p) => p.estilo).join(", ")}`,
    );
  }
  console.log(
    `Imagenes sin producto asociado: ${report.imagesWithoutProduct.length}`,
  );
  if (report.imagesWithoutProduct.length > 0) {
    console.log(report.imagesWithoutProduct.join(", "));
  }
}

function main() {
  if (!fs.existsSync(excelPath)) {
    throw new Error(
      `No se encontro el Excel en ${excelPath}. Usa data/inventario_actual.xlsx o pasa una ruta: npm run import-excel -- data/inventario.xlsx`,
    );
  }

  const workbook = XLSX.readFile(excelPath);
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error("El Excel no contiene hojas.");

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: "" });

  const rawProducts = rows
    .map(rowToProduct)
    .filter((p) => p.estilo.length > 0);

  // SKUs crudos (una fila = una variante con cantidad exacta)
  const skus = rowsToSKUs(rawProducts);

  // Productos agrupados para la info compartida (nombre, precio, imagen, etc.)
  const products = mergeProductsByStyle(rawProducts);

  const productStyles = new Set(products.map((p) => p.estilo));
  const imagesWithoutProduct = getProductImageNames().filter(
    (imageName) => !productStyles.has(imageName),
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buildOutput(products, skus), "utf8");

  printReport({
    rows: rows.length,
    imported: products.length,
    variants: skus.length,
    withImage: products.filter((p) => p.hasImage),
    withoutImage: products.filter((p) => !p.hasImage),
    imagesWithoutProduct,
  });
}

main();
