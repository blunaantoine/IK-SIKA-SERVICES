import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ContractType, LivreurStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const livreur = await db.livreur.findUnique({
      where: { id },
      include: {
        moto: true,
        dailyRecords: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    });

    if (!livreur) {
      return NextResponse.json({ error: "Livreur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(livreur);
  } catch (error) {
    console.error("Get livreur error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement du livreur" },
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
    const { firstName, lastName, phone, startDate, contractType, motoId, status } = body;

    // Check if livreur exists
    const existing = await db.livreur.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Livreur non trouvé" }, { status: 404 });
    }

    // Check if moto is available for assignment
    if (motoId && motoId !== existing.motoId) {
      const moto = await db.moto.findUnique({
        where: { id: motoId },
        include: {
          assignments: {
            where: { 
              status: "ACTIVE",
              id: { not: id },
            },
          },
        },
      });

      if (!moto) {
        return NextResponse.json(
          { error: "Moto non trouvée" },
          { status: 400 }
        );
      }

      if (moto.assignments.length > 0) {
        return NextResponse.json(
          { error: "Cette moto est déjà assignée à un autre livreur actif" },
          { status: 400 }
        );
      }
    }

    const livreur = await db.livreur.update({
      where: { id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        startDate: startDate ? new Date(startDate) : null,
        contractType: contractType as ContractType,
        motoId: motoId || null,
        status: status as LivreurStatus,
      },
      include: { moto: true },
    });

    return NextResponse.json(livreur);
  } catch (error) {
    console.error("Update livreur error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du livreur" },
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

    // Check if livreur has daily records
    const recordsCount = await db.comptabiliteJournaliere.count({
      where: { livreurId: id },
    });

    if (recordsCount > 0) {
      return NextResponse.json(
        { error: "Ce livreur a des enregistrements comptables. Suppression impossible." },
        { status: 400 }
      );
    }

    await db.livreur.delete({ where: { id } });

    return NextResponse.json({ message: "Livreur supprimé avec succès" });
  } catch (error) {
    console.error("Delete livreur error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du livreur" },
      { status: 500 }
    );
  }
}
