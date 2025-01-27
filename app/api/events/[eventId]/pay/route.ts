import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import mollieClient from "@/lib/mollie"

export async function POST(req: Request, { params }: { params: { eventId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eventId = params.eventId

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { price: true, name: true, organizerId: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.organizerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: event.price.toFixed(2),
      },
      description: `Payment for event: ${event.name}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}/payment-success`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mollie`,
      metadata: {
        eventId,
        userId: session.user.id,
      },
    })

    await prisma.event.update({
      where: { id: eventId },
      data: { paymentId: payment.id },
    })

    return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() })
  } catch (error) {
    console.error("Failed to create payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}

