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
    const payments = await prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        status: true,
        mollieId: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
        event: {
          select: {
            name: true,
          },
        },
      },
    })

    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      mollieId: payment.mollieId,
      userName: payment.user?.name || "N/A",
      eventName: payment.event?.name || "N/A",
      date: payment.createdAt,
    }))

    return NextResponse.json(formattedPayments)
  } catch (error) {
    console.error("Failed to fetch payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

