import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { eventId: string } }) {
  const eventId = params.eventId

  try {
    const seats = await prisma.seat.findMany({
      where: { eventId },
      include: { ticket: true },
    })

    const formattedSeats = seats.map((seat) => ({
      id: seat.id,
      row: seat.row,
      number: seat.number,
      isAvailable: !seat.ticket,
    }))

    return NextResponse.json(formattedSeats)
  } catch (error) {
    console.error("Failed to fetch seats:", error)
    return NextResponse.json({ error: "Failed to fetch seats" }, { status: 500 })
  }
}

