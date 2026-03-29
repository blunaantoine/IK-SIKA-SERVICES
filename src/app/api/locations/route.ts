import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LocationStatus, MotoState } from "@prisma/client";

export async function GET() {
  try {
    const locations = await db.location.findMany({
      include: {
        client: true,
        moto: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Get locations error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, motoId, startDate, endDate, dailyRate, depositAmount, notes } = body;

    // Check if moto is available
    const moto = await db.moto.findUnique({
      where: { id: motoId },
    });

    if (!moto) {
      return NextResponse.json({ error: "Moto non trouvée" }, { status: 400 });
    }

    if (moto.state !== "ACTIVE") {
      return NextResponse.json(
        { error: "Cette moto n'est pas disponible pour la location" },
        { status: 400 }
      );
    }

    // Check for overlapping rentals
    const overlapping = await db.location.findFirst({
      where: {
        motoId,
        status: LocationStatus.ACTIVE,
        OR: [
          {
            startDate: { lte: new Date(startDate) },
            endDate: { gte: new Date(startDate) },
          },
          startDate && !endDate ? {
            startDate: { lte: new Date() },
            endDate: null,
          } : {},
        ].filter(Boolean),
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Cette moto a déjà une location active sur cette période" },
        { status: 400 }
      );
    }

    const location = await db.location.create({
      data: {
        clientId,
        motoId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        dailyRate: parseFloat(dailyRate),
        depositAmount: depositAmount ? parseFloat(depositAmount) : null,
        notes: notes || null,
        status: LocationStatus.ACTIVE,
      },
      include: { client: true, moto: true },
    });

    // Update moto state to RENTED
    await db.moto.update({
      where: { id: motoId },
      data: { state: MotoState.RENTED },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("Create location error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la location" },
      { status: 500 }
    );
  }
}
