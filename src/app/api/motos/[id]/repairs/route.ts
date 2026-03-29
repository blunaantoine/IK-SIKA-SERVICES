import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, cost } = body;

    // Check if moto exists
    const moto = await db.moto.findUnique({ where: { id } });
    if (!moto) {
      return NextResponse.json({ error: "Moto non trouvée" }, { status: 404 });
    }

    const repair = await db.repairHistory.create({
      data: {
        motoId: id,
        description,
        cost: cost ? parseFloat(cost) : null,
      },
    });

    return NextResponse.json(repair);
  } catch (error) {
    console.error("Create repair error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la réparation" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repairs = await db.repairHistory.findMany({
      where: { motoId: id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(repairs);
  } catch (error) {
    console.error("Get repairs error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des réparations" },
      { status: 500 }
    );
  }
}
