import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const clients = await db.client.findMany({
      include: {
        _count: {
          select: { locations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Get clients error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, address, idCardNumber } = body;

    const client = await db.client.create({
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
    console.error("Create client error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du client" },
      { status: 500 }
    );
  }
}
