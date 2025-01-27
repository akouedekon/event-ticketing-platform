"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"

export function EventRecommendations() {
  const { data: session } = useSession()
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    if (session?.user?.id) {
      const fetchRecommendations = async () => {
        const response = await fetch(`/api/users/${session.user.id}/recommendations`)
        const data = await response.json()
        setRecommendations(data.recommendations)
      }
      fetchRecommendations()
    }
  }, [session])

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Recommandations d'événements</h2>
      <ul className="list-disc pl-5">
        {recommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    </Card>
  )
}

