import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getRecommendations } from "@/lib/recommendations"

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.id !== params.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const recommendations = await getRecommendations(params.userId)
    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Failed to fetch recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}

