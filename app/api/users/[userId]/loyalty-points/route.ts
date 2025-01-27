import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.id !== params.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { loyaltyPoints: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ points: user.loyaltyPoints })
  } catch (error) {
    console.error("Failed to fetch loyalty points:", error)
    return NextResponse.json({ error: "Failed to fetch loyalty points" }, { status: 500 })
  }
}

