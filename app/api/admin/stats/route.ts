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
    const revenueData = await getRevenueData(period)
    const userGrowthData = await getUserGrowthData(period)
    const eventCategoryData = await getEventCategoryData()

    return NextResponse.json({
      stats,
      revenueData,
      userGrowthData,
      eventCategoryData,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

async function getStats() {
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  })
  const totalUsers = await prisma.user.count()
  const totalEvents = await prisma.event.count()
  const totalTicketsSold = await prisma.ticket.count()

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    totalUsers,
    totalEvents,
    totalTicketsSold,
  }
}

async function getRevenueData(period: string) {
  // Implement logic to fetch revenue data based on the period
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
        label: "Revenus",
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

async function getEventCategoryData() {
  // Implement logic to fetch event category data
  // This is a placeholder implementation
  const categories = ["Concert", "Festival", "Conférence", "Sport", "Théâtre"]
  const data = categories.map(() => Math.floor(Math.random() * 100))

  return {
    labels: categories,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  }
}

