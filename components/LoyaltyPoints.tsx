"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function LoyaltyPoints() {
  const { data: session } = useSession()
  const [points, setPoints] = useState(0)

  useEffect(() => {
    if (session?.user?.id) {
      const fetchLoyaltyPoints = async () => {
        const response = await fetch(`/api/users/${session.user.id}/loyalty-points`)
        const data = await response.json()
        setPoints(data.points)
      }
      fetchLoyaltyPoints()
    }
  }, [session])

  return <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full">Points de fidélité : {points}</div>
}

