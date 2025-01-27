import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const sales = await prisma.payment.findMany({
      where: {
        status: "paid",
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        event: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    const formattedSales = sales.map((sale) => ({
      id: sale.id,
      eventName: sale.event?.name || "N/A",
      buyerName: sale.user?.name || "N/A",
      amount: sale.amount,
      date: sale.createdAt,
    }))

    return NextResponse.json(formattedSales)
  } catch (error) {
    console.error("Failed to fetch sales:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

