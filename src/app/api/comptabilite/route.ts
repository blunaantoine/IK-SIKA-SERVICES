import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (date) {
      // Get records for a specific date
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      const records = await db.comptabiliteJournaliere.findMany({
        where: { date: targetDate },
        include: {
          livreur: {
            include: { moto: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const summary = {
        totalDeliveries: records.reduce((sum, r) => sum + r.deliveries, 0),
        totalCollected: records.reduce((sum, r) => sum + r.amountCollected, 0),
        totalExpenses: records.reduce((sum, r) => sum + r.expenses, 0),
        totalToRemit: records.reduce((sum, r) => sum + r.amountToRemit, 0),
      };

      return NextResponse.json({ records, summary });
    }

    if (month && year) {
      // Get monthly consolidation
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      const records = await db.comptabiliteJournaliere.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          livreur: true,
        },
      });

      // Group by driver
      const byDriver = records.reduce((acc, record) => {
        const driverId = record.livreurId;
        if (!acc[driverId]) {
          acc[driverId] = {
            livreur: record.livreur,
            totalDeliveries: 0,
            totalCollected: 0,
            totalExpenses: 0,
            totalToRemit: 0,
            daysWorked: new Set(),
          };
        }
        acc[driverId].totalDeliveries += record.deliveries;
        acc[driverId].totalCollected += record.amountCollected;
        acc[driverId].totalExpenses += record.expenses;
        acc[driverId].totalToRemit += record.amountToRemit;
        acc[driverId].daysWorked.add(record.date.toDateString());
        return acc;
      }, {} as Record<string, any>);

      const consolidation = Object.values(byDriver).map((item: any) => ({
        ...item,
        daysWorked: item.daysWorked.size,
      }));

      return NextResponse.json(consolidation);
    }

    // Get all records
    const records = await db.comptabiliteJournaliere.findMany({
      include: {
        livreur: {
          include: { moto: true },
        },
      },
      orderBy: { date: "desc" },
      take: 100,
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Get comptabilite error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la comptabilité" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { livreurId, date, deliveries, amountCollected, expenses } = body;

    const recordDate = new Date(date);
    recordDate.setHours(0, 0, 0, 0);

    // Calculate amount to remit
    const amountToRemit = parseFloat(amountCollected) - parseFloat(expenses || 0);

    // Check if record exists for this driver and date
    const existing = await db.comptabiliteJournaliere.findUnique({
      where: {
        livreurId_date: {
          livreurId,
          date: recordDate,
        },
      },
    });

    if (existing) {
      // Update existing record
      const record = await db.comptabiliteJournaliere.update({
        where: { id: existing.id },
        data: {
          deliveries: parseInt(deliveries),
          amountCollected: parseFloat(amountCollected),
          expenses: parseFloat(expenses || 0),
          amountToRemit,
        },
        include: { livreur: true },
      });
      return NextResponse.json(record);
    }

    const record = await db.comptabiliteJournaliere.create({
      data: {
        livreurId,
        date: recordDate,
        deliveries: parseInt(deliveries),
        amountCollected: parseFloat(amountCollected),
        expenses: parseFloat(expenses || 0),
        amountToRemit,
      },
      include: { livreur: true },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("Create comptabilite error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement comptable" },
      { status: 500 }
    );
  }
}
