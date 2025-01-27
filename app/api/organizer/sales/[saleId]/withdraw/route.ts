import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import mollieClient from "@/lib/mollie"

export async function POST(req: Request, { params }: { params: { saleId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const saleId = params.saleId

  try {
    const sale = await prisma.event.findUnique({
      where: { id: saleId },
      include: { tickets: true },
    })

    if (!sale || sale.organizerId !== session.user.id) {
      return NextResponse.json({ error: "Sale not found or unauthorized" }, { status: 404 })
    }

    const totalAmount = sale.tickets.reduce((sum, ticket) => sum + ticket.price, 0)

    // Here you would typically integrate with your payment provider's payout API
    // For this example, we'll just mark the sale as paid out
    await prisma.event.update({
      where: { id: saleId },
      data: { isPaid: false }, // Mark as paid out
    })

    // You might want to create a record of this payout
    await prisma.payment.create({
      data: {
        amount: totalAmount,
        currency: "EUR",
        status: "paid_out",
        userId: session.user.id,
        eventId: saleId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to process withdrawal:", error)
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 })
  }
}

