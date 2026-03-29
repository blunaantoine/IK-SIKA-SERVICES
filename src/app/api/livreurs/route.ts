import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ContractType, LivreurStatus } from "@prisma/client";

export async function GET() {
  try {
    const livreurs = await db.livreur.findMany({
      include: {
        moto: true,
        _count: {
          select: { dailyRecords: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(livreurs);
  } catch (error) {
    console.error("Get livreurs error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des livreurs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, startDate, contractType, motoId, status } = body;

    // Check if moto is available for assignment
    if (motoId) {
      const moto = await db.moto.findUnique({
        where: { id: motoId },
        include: {
          assignments: {
            where: { status: "ACTIVE" },
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
          { error: "Cette moto est déjà assignée à un livreur actif" },
          { status: 400 }
        );
      }
    }

    const livreur = await db.livreur.create({
      data: {
        firstName,
        lastName,
        phone: phone || null,
        startDate: startDate ? new Date(startDate) : null,
        contractType: contractType as ContractType || ContractType.CDD,
        motoId: motoId || null,
        status: status as LivreurStatus || LivreurStatus.ACTIVE,
      },
      include: { moto: true },
    });

    return NextResponse.json(livreur);
  } catch (error) {
    console.error("Create livreur error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du livreur" },
      { status: 500 }
    );
  }
}
