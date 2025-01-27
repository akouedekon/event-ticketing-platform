import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { eventId, quantity } = await req.json()

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { tickets: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const availableTickets = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)

    if (quantity > availableTickets) {
      return NextResponse.json({ error: "Not enough tickets available" }, { status: 400 })
    }

    const ticket = await prisma.ticket.create({
      data: {
        quantity,
        event: { connect: { id: eventId } },
        user: { connect: { id: session.user.id } },
        price: event.tickets[0].price, // Assuming same price for all tickets
      },
    })

    // Update available tickets
    await prisma.ticket.update({
      where: { id: event.tickets[0].id },
      data: { quantity: { decrement: quantity } },
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Failed to purchase ticket:", error)
    return NextResponse.json({ error: "Failed to purchase ticket" }, { status: 500 })
  }
}

