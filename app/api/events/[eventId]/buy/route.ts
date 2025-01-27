import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import mollieClient from "@/lib/mollie"

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { quantity } = await req.json()
  const eventId = params.eventId

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { price: true, name: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const totalAmount = event.price * quantity

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: totalAmount.toFixed(2),
      },
      description: `${quantity} ticket(s) for event: ${event.name}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}/ticket-confirmation`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mollie`,
      metadata: {
        eventId,
        userId: session.user.id,
        quantity,
      },
    })

    return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() })
  } catch (error) {
    console.error("Failed to create payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}

