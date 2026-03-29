import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";

    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case "week":
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(today.getMonth() - 1);
    }

    // Get all records in period
    const records = await db.comptabiliteJournaliere.findMany({
      where: {
        date: {
          gte: startDate,
          lte: today,
        },
      },
      include: {
        livreur: true,
      },
      orderBy: { date: "asc" },
    });

    // Overall KPIs
    const totalDeliveries = records.reduce((sum, r) => sum + r.deliveries, 0);
    const totalRevenue = records.reduce((sum, r) => sum + r.amountCollected, 0);
    const totalExpenses = records.reduce((sum, r) => sum + r.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Trend data
    const trendMap = new Map<string, { deliveries: number; revenue: number; expenses: number }>();
    
    records.forEach((record) => {
      const dateKey = record.date.toISOString().split("T")[0];
      const existing = trendMap.get(dateKey) || { deliveries: 0, revenue: 0, expenses: 0 };
      existing.deliveries += record.deliveries;
      existing.revenue += record.amountCollected;
      existing.expenses += record.expenses;
      trendMap.set(dateKey, existing);
    });

    const trend = Array.from(trendMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    // Driver performance
    const driverPerformance = new Map<string, {
      livreur: any;
      deliveries: number;
      revenue: number;
      days: Set<string>;
    }>();

    records.forEach((record) => {
      const driverId = record.livreurId;
      const existing = driverPerformance.get(driverId) || {
        livreur: record.livreur,
        deliveries: 0,
        revenue: 0,
        days: new Set(),
      };
      existing.deliveries += record.deliveries;
      existing.revenue += record.amountCollected;
      existing.days.add(record.date.toISOString().split("T")[0]);
      driverPerformance.set(driverId, existing);
    });

    const leaderboard = Array.from(driverPerformance.values())
      .map((item) => ({
        ...item.livreur,
        totalDeliveries: item.deliveries,
        totalRevenue: item.revenue,
        daysWorked: item.days.size,
        avgDeliveriesPerDay: item.deliveries / item.days.size,
      }))
      .sort((a, b) => b.totalDeliveries - a.totalDeliveries);

    // Moto stats
    const motos = await db.moto.findMany({
      include: {
        assignments: {
          include: {
            dailyRecords: {
              where: {
                date: {
                  gte: startDate,
                  lte: today,
                },
              },
            },
          },
        },
        repairs: {
          where: {
            date: {
              gte: startDate,
              lte: today,
            },
          },
        },
      },
    });

    const motoStats = motos.map((moto) => ({
      ...moto,
      totalDeliveries: moto.assignments.reduce(
        (sum, a) => sum + a.dailyRecords.reduce((s, r) => s + r.deliveries, 0),
        0
      ),
      totalRevenue: moto.assignments.reduce(
        (sum, a) => sum + a.dailyRecords.reduce((s, r) => s + r.amountCollected, 0),
        0
      ),
      repairCosts: moto.repairs.reduce((sum, r) => sum + (r.cost || 0), 0),
    }));

    return NextResponse.json({
      kpis: {
        totalDeliveries,
        totalRevenue,
        totalExpenses,
        netProfit,
        avgDeliveriesPerDay: records.length > 0 ? totalDeliveries / new Set(records.map(r => r.date.toISOString().split("T")[0])).size : 0,
      },
      trend,
      leaderboard,
      motoStats,
    });
  } catch (error) {
    console.error("Statistiques error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des statistiques" },
      { status: 500 }
    );
  }
}
