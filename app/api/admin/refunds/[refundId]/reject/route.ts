import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { refundId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const refundId = params.refundId

  try {
    const updatedRefund = await prisma.refund.update({
      where: { id: refundId },
      data: { status: "REJECTED" },
    })

    return NextResponse.json(updatedRefund)
  } catch (error) {
    console.error("Failed to reject refund:", error)
    return NextResponse.json({ error: "Failed to reject refund" }, { status: 500 })
  }
}

