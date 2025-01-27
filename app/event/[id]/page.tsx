"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SocialShare } from "@/components/SocialShare"

type Event = {
  id: string
  title: string
  description: string
  date: string
  location: string
  image: string
}

export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)

  useEffect(() => {
    // Ici, vous feriez normalement un appel API pour obtenir les détails de l'événement
    const mockEvent: Event = {
      id: id as string,
      title: "Concert de Rock",
      description: "Un concert de rock inoubliable avec les meilleurs groupes du moment.",
      date: "2023-08-15",
      location: "Stade de France, Paris",
      image: "/placeholder.svg?height=400&width=600",
    }
    setEvent(mockEvent)
  }, [id])

  if (!event) return <div>Chargement...</div>

  return (
    <div className="p-6">
      <Card className="overflow-hidden">
        <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <p className="text-gray-600 mb-2">Date : {new Date(event.date).toLocaleDateString()}</p>
          <p className="text-gray-600 mb-4">Lieu : {event.location}</p>
          <div className="flex justify-between items-center">
            <Button>Acheter des billets</Button>
            <SocialShare url={`https://votre-site.com/event/${event.id}`} title={event.title} />
          </div>
        </div>
      </Card>
    </div>
  )
}

