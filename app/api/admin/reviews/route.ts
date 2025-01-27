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
  const status = searchParams.get("status")

  try {
    const reviews = await prisma.review.findMany({
      where: status !== "ALL" ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : undefined,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        event: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      userName: review.user.name,
      eventId: review.eventId,
      eventName: review.event.name,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      createdAt: review.createdAt,
    }))

    return NextResponse.json(formattedReviews)
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, status } = await req.json()
    const updatedReview = await prisma.review.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Failed to update review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await req.json()
    await prisma.review.delete({
      where: { id },
    })
    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Failed to delete review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}

