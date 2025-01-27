import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const eventId = searchParams.get("event")

  if (!from || !to) {
    return NextResponse.json({ error: "Missing date range" }, { status: 400 })
  }

  try {
    const whereClause = {
      organizerId: session.user.id,
      date: {
        gte: new Date(from),
        lte: new Date(to),
      },
      ...(eventId !== "all" && eventId ? { id: eventId } : {}),
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        tickets: {
          include: {
            user: true,
          },
        },
      },
    })

    // Process data for ticket sales chart
    const ticketSales = events.reduce(
      (acc, event) => {
        event.tickets.forEach((ticket) => {
          const type = ticket.type || "Standard"
          if (!acc[type]) {
            acc[type] = 0
          }
          acc[type]++
        })
        return acc
      },
      {} as Record<string, number>,
    )

    // Process data for revenue over time chart
    const revenueOverTime = events.reduce(
      (acc, event) => {
        const date = event.date.toISOString().split("T")[0]
        const revenue = event.tickets.reduce((sum, ticket) => sum + ticket.price, 0)
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += revenue
        return acc
      },
      {} as Record<string, number>,
    )

    // Process data for audience demographics chart
    const audienceDemographics = events.reduce(
      (acc, event) => {
        event.tickets.forEach((ticket) => {
          const age = ticket.user?.age || "Unknown"
          if (!acc[age]) {
            acc[age] = 0
          }
          acc[age]++
        })
        return acc
      },
      {} as Record<string, number>,
    )

    // Process data for top events
    const topEvents = events
      .map((event) => ({
        name: event.name,
        ticketsSold: event.tickets.length,
        revenue: event.tickets.reduce((sum, ticket) => sum + ticket.price, 0),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    const analyticsData = {
      ticketSales: {
        labels: Object.keys(ticketSales),
        datasets: [
          {
            label: "Ventes de billets",
            data: Object.values(ticketSales),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      revenueOverTime: {
        labels: Object.keys(revenueOverTime),
        datasets: [
          {
            label: "Revenus",
            data: Object.values(revenueOverTime),
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      audienceDemographics: {
        labels: Object.keys(audienceDemographics),
        datasets: [
          {
            data: Object.values(audienceDemographics),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
          },
        ],
      },
      topEvents,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Failed to fetch analytics data:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

