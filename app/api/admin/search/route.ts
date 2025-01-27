import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "No search query provided" }, { status: 400 })
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ name: { contains: query, mode: "insensitive" } }, { email: { contains: query, mode: "insensitive" } }],
      },
      take: 5,
    })

    const events = await prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    })

    const sales = await prisma.payment.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: "insensitive" } } },
          { event: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        user: true,
        event: true,
      },
      take: 5,
    })

    const results = [
      ...users.map((user) => ({
        id: user.id,
        type: "user" as const,
        name: user.name || user.email,
        details: `Email: ${user.email}`,
      })),
      ...events.map((event) => ({
        id: event.id,
        type: "event" as const,
        name: event.name,
        details: `Date: ${event.date.toLocaleDateString()}, Lieu: ${event.location}`,
      })),
      ...sales.map((sale) => ({
        id: sale.id,
        type: "sale" as const,
        name: `Vente: ${sale.event?.name || "N/A"}`,
        details: `Montant: ${sale.amount} €, Acheteur: ${sale.user?.name || "N/A"}`,
      })),
    ]

    return NextResponse.json(results)
  } catch (error) {
    console.error("Failed to perform global search:", error)
    return NextResponse.json({ error: "Failed to perform global search" }, { status: 500 })
  }
}

