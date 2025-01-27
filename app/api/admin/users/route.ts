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
  const nameFilter = searchParams.get("name") || ""
  const emailFilter = searchParams.get("email") || ""
  const roleFilter = searchParams.get("role") || ""

  try {
    const users = await prisma.user.findMany({
      where: {
        name: { contains: nameFilter, mode: "insensitive" },
        email: { contains: emailFilter, mode: "insensitive" },
        role: roleFilter ? { equals: roleFilter } : undefined,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

