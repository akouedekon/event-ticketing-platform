import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.id !== params.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const sales = await prisma.event.findMany({
      where: { organizerId: params.userId, isPaid: true },
      select: {
        id: true,
        name: true,
        tickets: {
          select: {
            price: true,
          },
        },
        _count: {
          select: { tickets: true },
        },
        createdAt: true,
      },
    })

    const formattedSales = sales.map((sale) => ({
      id: sale.id,
      eventName: sale.name,
      ticketsSold: sale._count.tickets,
      totalAmount: sale.tickets.reduce((sum, ticket) => sum + ticket.price, 0),
      date: sale.createdAt,
    }))

    return NextResponse.json(formattedSales)
  } catch (error) {
    console.error("Failed to fetch sales:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

