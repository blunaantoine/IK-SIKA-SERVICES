import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await db.client.findUnique({
      where: { id },
      include: {
        locations: {
          include: { moto: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Get client error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement du client" },
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
    const { firstName, lastName, phone, address, idCardNumber } = body;

    const client = await db.client.update({
      where: { id },
      data: {
        firstName,
        lastName,
        phone,
        address: address || null,
        idCardNumber: idCardNumber || null,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Update client error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du client" },
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

    // Check if client has active locations
    const activeLocations = await db.location.count({
      where: { clientId: id, status: "ACTIVE" },
    });

    if (activeLocations > 0) {
      return NextResponse.json(
        { error: "Ce client a des locations actives. Suppression impossible." },
        { status: 400 }
      );
    }

    await db.client.delete({ where: { id } });

    return NextResponse.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Delete client error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du client" },
      { status: 500 }
    );
  }
}
