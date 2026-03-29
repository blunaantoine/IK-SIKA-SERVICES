import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@ik-sika.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Les utilisateurs existent déjà" });
    }

    // Create admin user
    await db.user.create({
      data: {
        email: "admin@ik-sika.com",
        password: "admin123",
        name: "Ignace",
        role: UserRole.ADMIN,
      },
    });

    // Create assistant user
    await db.user.create({
      data: {
        email: "assistant@ik-sika.com",
        password: "assistant123",
        name: "Assistant",
        role: UserRole.ASSISTANT,
      },
    });

    return NextResponse.json({ message: "Utilisateurs créés avec succès" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création des utilisateurs" },
      { status: 500 }
    );
  }
}
