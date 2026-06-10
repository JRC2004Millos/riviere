import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

type ColombiaEntry = { id: number; departamento: string; ciudades: string[] };

function loadData(): ColombiaEntry[] {
  const file = path.join(process.cwd(), "data", "colombia.min.txt");
  return JSON.parse(fs.readFileSync(file, "utf-8")) as ColombiaEntry[];
}

export async function GET(req: NextRequest) {
  const depId = req.nextUrl.searchParams.get("depId");
  if (depId === null || isNaN(Number(depId))) {
    return NextResponse.json([], { status: 400 });
  }

  try {
    const data = loadData();
    const dept = data.find((d) => d.id === Number(depId));
    if (!dept) return NextResponse.json([], { status: 404 });

    const cities = dept.ciudades
      .map((nombre, i) => ({ id: i, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

    return NextResponse.json(cities);
  } catch (err) {
    console.error("[colombia/ciudades] failed to load data:", err);
    return NextResponse.json([], { status: 500 });
  }
}
