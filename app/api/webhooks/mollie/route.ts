import { NextResponse } from "next/server"
import mollieClient from "@/lib/mollie"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.text()
  const { id } = Object.fromEntries(new URLSearchParams(body))

  try {
    const payment = await mollieClient.payments.get(id)
    const { eventId, userId } = payment.metadata

    if (payment.isPaid()) {
      await prisma.event.update({
        where: { id: eventId },
        data: { isPaid: true },
      })

      await prisma.payment.create({
        data: {
          mollieId: payment.id,
          amount: Number.parseFloat(payment.amount.value),
          currency: payment.amount.currency,
          status: payment.status,
          userId,
          eventId,
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

