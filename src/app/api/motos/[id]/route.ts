import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MotoState } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const moto = await db.moto.findUnique({
      where: { id },
      include: {
        repairs: {
          orderBy: { date: "desc" },
        },
        assignments: {
          where: { status: "ACTIVE" },
          include: {
            _count: {
              select: { dailyRecords: true },
            },
          },
        },
      },
    });

    if (!moto) {
      return NextResponse.json({ error: "Moto non trouvée" }, { status: 404 });
    }

    return NextResponse.json(moto);
  } catch (error) {
    console.error("Get moto error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la moto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { number, name, purchaseDate, state, lastRevision, nextRevision } = body;

    // Check if moto exists
    const existing = await db.moto.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Moto non trouvée" }, { status: 404 });
    }

    // Check if new number conflicts with another moto
    if (number !== existing.number) {
      const numberConflict = await db.moto.findUnique({ where: { number } });
      if (numberConflict) {
        return NextResponse.json(
          { error: "Une moto avec ce numéro existe déjà" },
          { status: 400 }
        );
      }
    }

    const moto = await db.moto.update({
      where: { id },
      data: {
        number,
        name: name || null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        state: state as MotoState,
        lastRevision: lastRevision ? new Date(lastRevision) : null,
        nextRevision: nextRevision ? new Date(nextRevision) : null,
      },
    });

    return NextResponse.json(moto);
  } catch (error) {
    console.error("Update moto error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la moto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if moto is assigned to a driver
    const assignments = await db.livreur.count({
      where: { motoId: id },
    });

    if (assignments > 0) {
      return NextResponse.json(
        { error: "Cette moto est assignée à un livreur. Veuillez d'abord désassigner." },
        { status: 400 }
      );
    }

    await db.moto.delete({ where: { id } });

    return NextResponse.json({ message: "Moto supprimée avec succès" });
  } catch (error) {
    console.error("Delete moto error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la moto" },
      { status: 500 }
    );
  }
}
