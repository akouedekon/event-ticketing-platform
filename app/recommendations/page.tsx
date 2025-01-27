"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Event = {
  id: string
  title: string
  date: string
  image: string
  category: string
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Event[]>([])

  useEffect(() => {
    // Ici, vous feriez normalement un appel API pour obtenir les recommandations
    // basées sur les préférences de l'utilisateur
    const mockRecommendations: Event[] = [
      {
        id: "1",
        title: "Concert de Rock",
        date: "2023-08-15",
        image: "/placeholder.svg?height=200&width=300",
        category: "Musique",
      },
      {
        id: "2",
        title: "Conférence Tech",
        date: "2023-09-20",
        image: "/placeholder.svg?height=200&width=300",
        category: "Technologie",
      },
      {
        id: "3",
        title: "Festival de Jazz",
        date: "2023-10-10",
        image: "/placeholder.svg?height=200&width=300",
        category: "Musique",
      },
    ]
    setRecommendations(mockRecommendations)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Événements recommandés pour vous</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-4">{event.category}</p>
              <Link href={`/event/${event.id}`}>
                <Button className="w-full">Voir les détails</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

