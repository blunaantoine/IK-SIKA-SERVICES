import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        success: true,
        message: "Si ce compte existe, vous recevrez un email de réinitialisation",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save token to database
    await db.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // In production, send email with reset link
    // For demo purposes, we return the token
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    // For development: log the reset link
    console.log("=== RESET PASSWORD LINK ===");
    console.log(resetUrl);
    console.log("===========================");

    return NextResponse.json({
      success: true,
      message: "Si ce compte existe, vous recevrez un email de réinitialisation",
      // For demo purposes, include the reset URL
      resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la demande de réinitialisation" },
      { status: 500 }
    );
  }
}
