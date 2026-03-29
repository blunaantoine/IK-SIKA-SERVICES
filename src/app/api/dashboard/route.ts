import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // Active drivers count
    const activeDrivers = await db.livreur.count({
      where: { status: "ACTIVE" },
    });

    // Available motos count
    const availableMotos = await db.moto.count({
      where: { state: "ACTIVE" },
    });

    // Today's deliveries
    const todayRecords = await db.comptabiliteJournaliere.findMany({
      where: {
        date: today,
      },
    });

    const todayDeliveries = todayRecords.reduce((sum, r) => sum + r.deliveries, 0);
    const todayAmount = todayRecords.reduce((sum, r) => sum + r.amountCollected, 0);

    // Last 7 days trend
    const weeklyRecords = await db.comptabiliteJournaliere.findMany({
      where: {
        date: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      orderBy: { date: "asc" },
    });

    const trendData: { date: string; deliveries: number; amount: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dayRecords = weeklyRecords.filter(
        (r) => r.date.toDateString() === date.toDateString()
      );
      trendData.push({
        date: date.toLocaleDateString("fr-FR", { weekday: "short" }),
        deliveries: dayRecords.reduce((sum, r) => sum + r.deliveries, 0),
        amount: dayRecords.reduce((sum, r) => sum + r.amountCollected, 0),
      });
    }

    // Driver performance
    const driverPerformance = await db.livreur.findMany({
      where: { status: "ACTIVE" },
      include: {
        dailyRecords: {
          where: {
            date: {
              gte: sevenDaysAgo,
              lte: today,
            },
          },
        },
        moto: true,
      },
    });

    const performanceRanking = driverPerformance
      .map((driver) => ({
        id: driver.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        totalDeliveries: driver.dailyRecords.reduce((sum, r) => sum + r.deliveries, 0),
        totalAmount: driver.dailyRecords.reduce((sum, r) => sum + r.amountCollected, 0),
        motoNumber: driver.moto?.number || "-",
      }))
      .sort((a, b) => b.totalDeliveries - a.totalDeliveries)
      .slice(0, 5);

    // Alerts - upcoming revisions
    const upcomingRevisions = await db.moto.findMany({
      where: {
        nextRevision: {
          lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Alerts - broken motos
    const brokenMotos = await db.moto.findMany({
      where: { state: "BROKEN" },
    });

    // Alerts - maintenance motos
    const maintenanceMotos = await db.moto.findMany({
      where: { state: "MAINTENANCE" },
    });

    return NextResponse.json({
      activeDrivers,
      availableMotos,
      todayDeliveries,
      todayAmount,
      trendData,
      performanceRanking,
      alerts: {
        upcomingRevisions: upcomingRevisions.length,
        brokenMotos: brokenMotos.length,
        maintenanceMotos: maintenanceMotos.length,
        revisionDetails: upcomingRevisions.map(m => ({
          number: m.number,
          nextRevision: m.nextRevision,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement du tableau de bord" },
      { status: 500 }
    );
  }
}
