import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LocationStatus, MotoState } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const location = await db.location.findUnique({
      where: { id },
      include: {
        client: true,
        moto: true,
      },
    });

    if (!location) {
      return NextResponse.json({ error: "Location non trouvée" }, { status: 404 });
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error("Get location error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la location" },
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
    const { clientId, motoId, startDate, endDate, dailyRate, depositAmount, status, notes } = body;

    const existing = await db.location.findUnique({
      where: { id },
      include: { moto: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Location non trouvée" }, { status: 404 });
    }

    const location = await db.location.update({
      where: { id },
      data: {
        clientId,
        motoId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        dailyRate: parseFloat(dailyRate),
        depositAmount: depositAmount ? parseFloat(depositAmount) : null,
        status: status as LocationStatus,
        notes: notes || null,
      },
      include: { client: true, moto: true },
    });

    // If location is completed or cancelled, make moto available again
    if ((status === LocationStatus.COMPLETED || status === LocationStatus.CANCELLED) && existing.status === LocationStatus.ACTIVE) {
      await db.moto.update({
        where: { id: existing.motoId },
        data: { state: MotoState.ACTIVE },
      });
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error("Update location error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la location" },
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
    const location = await db.location.findUnique({
      where: { id },
    });

    if (!location) {
      return NextResponse.json({ error: "Location non trouvée" }, { status: 404 });
    }

    // Make moto available again if location was active
    if (location.status === LocationStatus.ACTIVE) {
      await db.moto.update({
        where: { id: location.motoId },
        data: { state: MotoState.ACTIVE },
      });
    }

    await db.location.delete({ where: { id } });

    return NextResponse.json({ message: "Location supprimée avec succès" });
  } catch (error) {
    console.error("Delete location error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la location" },
      { status: 500 }
    );
  }
}
