import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

type ColombiaEntry = { id: number; departamento: string; ciudades: string[] };

function loadData(): ColombiaEntry[] {
  const file = path.join(process.cwd(), "data", "colombia.min.txt");
  return JSON.parse(fs.readFileSync(file, "utf-8")) as ColombiaEntry[];
}

export async function GET() {
  try {
    const data = loadData();
    const departments = data
      .map((d) => ({ id: d.id, nombre: d.departamento }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    return NextResponse.json(departments);
  } catch (err) {
    console.error("[colombia] failed to load data:", err);
    return NextResponse.json([], { status: 500 });
  }
}
