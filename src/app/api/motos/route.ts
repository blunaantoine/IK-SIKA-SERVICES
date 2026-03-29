import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MotoState } from "@prisma/client";

export async function GET() {
  try {
    const motos = await db.moto.findMany({
      include: {
        repairs: {
          orderBy: { date: "desc" },
          take: 5,
        },
        _count: {
          select: { assignments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(motos);
  } catch (error) {
    console.error("Get motos error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des motos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, name, purchaseDate, state, lastRevision, nextRevision } = body;

    // Check if moto number already exists
    const existing = await db.moto.findUnique({
      where: { number },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Une moto avec ce numéro existe déjà" },
        { status: 400 }
      );
    }

    const moto = await db.moto.create({
      data: {
        number,
        name: name || null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        state: state as MotoState || MotoState.ACTIVE,
        lastRevision: lastRevision ? new Date(lastRevision) : null,
        nextRevision: nextRevision ? new Date(nextRevision) : null,
      },
    });

    return NextResponse.json(moto);
  } catch (error) {
    console.error("Create moto error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la moto" },
      { status: 500 }
    );
  }
}
