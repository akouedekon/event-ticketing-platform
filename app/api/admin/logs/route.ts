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
    const logs = await prisma.adminLog.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    })

    const formattedLogs = logs.map((log) => ({
      id: log.id,
      action: log.action,
      userId: log.userId,
      userName: log.user.name,
      details: log.details,
      timestamp: log.timestamp,
    }))

    return NextResponse.json(formattedLogs)
  } catch (error) {
    console.error("Failed to fetch admin logs:", error)
    return NextResponse.json({ error: "Failed to fetch admin logs" }, { status: 500 })
  }
}

