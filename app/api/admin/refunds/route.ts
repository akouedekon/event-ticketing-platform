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
    const refunds = await prisma.refund.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(refunds)
  } catch (error) {
    console.error("Failed to fetch refunds:", error)
    return NextResponse.json({ error: "Failed to fetch refunds" }, { status: 500 })
  }
}

