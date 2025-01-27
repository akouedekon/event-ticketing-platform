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
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: {
            name: true,
          },
        },
        tickets: {
          select: {
            id: true,
          },
        },
      },
    })

    const formattedEvents = events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.date,
      location: event.location,
      organizerName: event.organizer.name,
      ticketsSold: event.tickets.length,
      isPaid: event.isPaid,
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, date, location, organizerId, isPaid } = await req.json()

    const newEvent = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        location,
        organizerId,
        isPaid,
      },
    })

    return NextResponse.json(newEvent)
  } catch (error) {
    console.error("Failed to create event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

