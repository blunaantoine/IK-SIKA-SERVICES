import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const livreurId = searchParams.get("livreurId");

    let data: any = {};

    switch (type) {
      case "daily":
        if (!date) {
          return NextResponse.json({ error: "Date requise" }, { status: 400 });
        }
        const dailyDate = new Date(date);
        dailyDate.setHours(0, 0, 0, 0);

        const dailyRecords = await db.comptabiliteJournaliere.findMany({
          where: { date: dailyDate },
          include: {
            livreur: { include: { moto: true } },
          },
        });

        data = {
          title: `Rapport Journalier - ${dailyDate.toLocaleDateString("fr-FR")}`,
          date: dailyDate,
          records: dailyRecords,
          summary: {
            totalDeliveries: dailyRecords.reduce((sum, r) => sum + r.deliveries, 0),
            totalCollected: dailyRecords.reduce((sum, r) => sum + r.amountCollected, 0),
            totalExpenses: dailyRecords.reduce((sum, r) => sum + r.expenses, 0),
            totalToRemit: dailyRecords.reduce((sum, r) => sum + r.amountToRemit, 0),
            driverCount: dailyRecords.length,
          },
        };
        break;

      case "monthly":
        if (!month || !year) {
          return NextResponse.json({ error: "Mois et année requis" }, { status: 400 });
        }

        const monthStart = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthEnd = new Date(parseInt(year), parseInt(month), 0);

        const monthlyRecords = await db.comptabiliteJournaliere.findMany({
          where: {
            date: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
          include: {
            livreur: { include: { moto: true } },
          },
          orderBy: { date: "asc" },
        });

        const monthNames = [
          "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];

        data = {
          title: `Rapport Mensuel - ${monthNames[parseInt(month) - 1]} ${year}`,
          month: parseInt(month),
          year: parseInt(year),
          records: monthlyRecords,
          summary: {
            totalDeliveries: monthlyRecords.reduce((sum, r) => sum + r.deliveries, 0),
            totalCollected: monthlyRecords.reduce((sum, r) => sum + r.amountCollected, 0),
            totalExpenses: monthlyRecords.reduce((sum, r) => sum + r.expenses, 0),
            totalToRemit: monthlyRecords.reduce((sum, r) => sum + r.amountToRemit, 0),
            driverCount: new Set(monthlyRecords.map(r => r.livreurId)).size,
            daysWorked: new Set(monthlyRecords.map(r => r.date.toISOString().split("T")[0])).size,
          },
        };
        break;

      case "driver":
        if (!livreurId) {
          return NextResponse.json({ error: "ID livreur requis" }, { status: 400 });
        }

        const driver = await db.livreur.findUnique({
          where: { id: livreurId },
          include: {
            moto: true,
            dailyRecords: {
              orderBy: { date: "desc" },
              take: 30,
            },
          },
        });

        if (!driver) {
          return NextResponse.json({ error: "Livreur non trouvé" }, { status: 404 });
        }

        data = {
          title: `Rapport Livreur - ${driver.firstName} ${driver.lastName}`,
          driver,
          records: driver.dailyRecords,
          summary: {
            totalDeliveries: driver.dailyRecords.reduce((sum, r) => sum + r.deliveries, 0),
            totalCollected: driver.dailyRecords.reduce((sum, r) => sum + r.amountCollected, 0),
            totalExpenses: driver.dailyRecords.reduce((sum, r) => sum + r.expenses, 0),
            totalToRemit: driver.dailyRecords.reduce((sum, r) => sum + r.amountToRemit, 0),
            daysWorked: driver.dailyRecords.length,
          },
        };
        break;

      case "contract":
        if (!livreurId) {
          return NextResponse.json({ error: "ID livreur requis" }, { status: 400 });
        }

        const contractDriver = await db.livreur.findUnique({
          where: { id: livreurId },
          include: { moto: true },
        });

        if (!contractDriver) {
          return NextResponse.json({ error: "Livreur non trouvé" }, { status: 404 });
        }

        data = {
          title: `Contrat de Travail - ${contractDriver.firstName} ${contractDriver.lastName}`,
          driver: contractDriver,
          company: {
            name: "IK-SIKA SERVICES",
            address: "Lomé, Togo",
            phone: "+228 90 00 00 00",
          },
          generatedAt: new Date(),
        };
        break;

      default:
        return NextResponse.json({ error: "Type de document non reconnu" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Document error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du document" },
      { status: 500 }
    );
  }
}
