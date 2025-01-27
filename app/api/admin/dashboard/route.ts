import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const period = searchParams.get("period") || "month"

  try {
    const stats = await getStats()
    const salesData = await getSalesData(period)
    const userGrowthData = await getUserGrowthData(period)

    return NextResponse.json({
      stats,
      salesData,
      userGrowthData,
    })
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

async function getStats() {
  const userCount = await prisma.user.count()
  const eventCount = await prisma.event.count()
  const ticketCount = await prisma.ticket.count()
  const totalSales = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  })

  return {
    userCount,
    eventCount,
    ticketCount,
    totalSales: totalSales._sum.amount || 0,
  }
}

async function getSalesData(period: string) {
  // Implement logic to fetch sales data based on the period
  // This is a placeholder implementation
  const labels =
    period === "week"
      ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
      : period === "month"
        ? ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"]
        : ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]

  const data = labels.map(() => Math.floor(Math.random() * 10000))

  return {
    labels,
    datasets: [
      {
        label: "Ventes",
        data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }
}

async function getUserGrowthData(period: string) {
  // Implement logic to fetch user growth data based on the period
  // This is a placeholder implementation
  const labels =
    period === "week"
      ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
      : period === "month"
        ? ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"]
        : ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]

  const data = labels.map(() => Math.floor(Math.random() * 1000))

  return {
    labels,
    datasets: [
      {
        label: "Nouveaux utilisateurs",
        data,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }
}

