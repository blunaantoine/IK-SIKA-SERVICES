import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Add a repair record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { motoId, description, cost } = body;

    if (!motoId || !description) {
      return NextResponse.json({ error: "Moto ID and description are required" }, { status: 400 });
    }

    // Check if moto exists
    const moto = await db.moto.findUnique({
      where: { id: motoId },
    });

    if (!moto) {
      return NextResponse.json({ error: "Moto not found" }, { status: 404 });
    }

    // Create repair record
    await db.repairHistory.create({
      data: {
        motoId,
        description,
        cost: cost || null,
      },
    });

    // Return updated moto with repairs
    const updatedMoto = await db.moto.findUnique({
      where: { id: motoId },
      include: {
        repairs: {
          orderBy: { date: "desc" },
        },
      },
    });

    return NextResponse.json(updatedMoto);
  } catch (error) {
    console.error("Error adding repair:", error);
    return NextResponse.json({ error: "Error adding repair" }, { status: 500 });
  }
}
